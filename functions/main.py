# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_functions.options import set_global_options
from firebase_admin import initialize_app, credentials, storage
import json
from datetime import datetime
import base64
from google.cloud import storage as gcs_storage
import tempfile
import os

# For cost control, you can set the maximum number of containers that can be
# running at the same time. This helps mitigate the impact of unexpected
# traffic spikes by instead downgrading performance. This limit is a per-function
# limit. You can override the limit for each function using the max_instances
# parameter in the decorator, e.g. @https_fn.on_request(max_instances=5).
set_global_options(max_instances=10)

# Initialize Firebase app with storage bucket configuration
# In Cloud Functions, Firebase Admin SDK is automatically initialized
# but we can configure the storage bucket
initialize_app(options={
    'storageBucket': 'allstate-8f387.appspot.com'  # Replace with your actual Firebase project ID
})

# GCS bucket configuration
BUCKET_NAME = "allstate-8f387.firebasestorage.app"

def upload_image_to_firebase(image_path, destination_blob_name):
    """
    Uploads an image file to Firebase Storage.
    
    Args:
        image_path (str): The local path to the image file.
        destination_blob_name (str): The desired path/name for the image in Firebase Storage.
    """
    try:
        # Get the default Firebase Storage bucket
        bucket = storage.bucket()
        blob = bucket.blob(destination_blob_name)

        # Upload the image
        blob.upload_from_filename(image_path)

        print(f"Image '{image_path}' uploaded successfully to '{destination_blob_name}' in Firebase Storage.")
        # Optionally, you can get the public URL of the uploaded image
        # print(f"Public URL: {blob.public_url}")
        
        return {
            'success': True,
            'message': f'Image uploaded successfully to Firebase Storage',
            'destination': destination_blob_name,
            'publicUrl': blob.public_url if blob.public_url else None
        }

    except Exception as e:
        print(f"Error uploading image: {e}")
        return {
            'success': False,
            'error': str(e)
        }

@https_fn.on_request()
def upload_image_notification(req: https_fn.Request) -> https_fn.Response:
    """Notify that image was successfully uploaded to Google Storage"""
    try:
        # Set CORS headers
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json"
        }
        
        # Handle preflight requests
        if req.method == "OPTIONS":
            return https_fn.Response("", status=200, headers=headers)
        
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers=headers
            )
        
        # Parse request data
        request_data = req.get_json()
        user_id = request_data.get('userId', 'anonymous')
        image_url = request_data.get('imageUrl', '')
        file_name = request_data.get('fileName', 'screenshot')
        
        if not user_id:
            return https_fn.Response(
                json.dumps({"error": "User ID is required"}),
                status=400,
                headers=headers
            )
        
        # Create upload notification response
        upload_result = {
            'success': True,
            'message': f'Image successfully uploaded to Google Storage for user {user_id}',
            'userId': user_id,
            'fileName': file_name,
            'imageUrl': image_url,
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'storageLocation': f'gs://{BUCKET_NAME}/users/{user_id}/{file_name}'
        }
        
        return https_fn.Response(
            json.dumps(upload_result),
            status=200,
            headers=headers
        )
        
    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers=headers
        )

@https_fn.on_request()
def store_image_to_gcs(req: https_fn.Request) -> https_fn.Response:
    """Store uploaded image to Google Cloud Storage"""
    try:
        # Set CORS headers
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json"
        }
        
        # Handle preflight requests
        if req.method == "OPTIONS":
            return https_fn.Response("", status=200, headers=headers)
        
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers=headers
            )
        
        # Parse request data
        request_data = req.get_json()
        user_id = request_data.get('userId', 'anonymous')
        image_data = request_data.get('imageData', '')  # Base64 encoded image
        file_name = request_data.get('fileName', f'screenshot_{datetime.utcnow().strftime("%Y%m%d_%H%M%S")}.png')
        content_type = request_data.get('contentType', 'image/png')
        
        if not user_id:
            return https_fn.Response(
                json.dumps({"error": "User ID is required"}),
                status=400,
                headers=headers
            )
        
        if not image_data:
            return https_fn.Response(
                json.dumps({"error": "Image data is required"}),
                status=400,
                headers=headers
            )
        
        # Initialize GCS client inside the function to avoid deployment timeouts
        try:
            storage_client = gcs_storage.Client()
            bucket = storage_client.bucket(BUCKET_NAME)
        except Exception as e:
            return https_fn.Response(
                json.dumps({"error": f"Failed to initialize GCS client: {str(e)}"}),
                status=500,
                headers=headers
            )
        
        # Create file path in GCS
        gcs_path = f"users/{user_id}/{file_name}"
        blob = bucket.blob(gcs_path)
        
        # Decode base64 image data
        try:
            # Remove data URL prefix if present
            if image_data.startswith('data:'):
                image_data = image_data.split(',')[1]
            
            image_bytes = base64.b64decode(image_data)
        except Exception as e:
            return https_fn.Response(
                json.dumps({"error": f"Invalid image data: {str(e)}"}),
                status=400,
                headers=headers
            )
        
        # Upload to GCS
        try:
            blob.upload_from_string(
                image_bytes,
                content_type=content_type
            )
            
            # Make the blob publicly readable (optional)
            blob.make_public()
            
            # Get the public URL
            public_url = blob.public_url
            
        except Exception as e:
            return https_fn.Response(
                json.dumps({"error": f"Failed to upload to GCS: {str(e)}"}),
                status=500,
                headers=headers
            )
        
        # Create response
        upload_result = {
            'success': True,
            'message': f'Image successfully stored in Google Cloud Storage',
            'userId': user_id,
            'fileName': file_name,
            'gcsPath': gcs_path,
            'publicUrl': public_url,
            'storageLocation': f'gs://{BUCKET_NAME}/{gcs_path}',
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'fileSize': len(image_bytes),
            'contentType': content_type
        }
        
        return https_fn.Response(
            json.dumps(upload_result),
            status=200,
            headers=headers
        )
        
    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers=headers
        )

@https_fn.on_request()
def upload_file_to_firebase(req: https_fn.Request) -> https_fn.Response:
    """Upload a file to Firebase Storage using the template pattern"""
    try:
        # Set CORS headers
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json"
        }
        
        # Handle preflight requests
        if req.method == "OPTIONS":
            return https_fn.Response("", status=200, headers=headers)
        
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers=headers
            )
        
        # Parse request data
        request_data = req.get_json()
        image_data = request_data.get('imageData', '')  # Base64 encoded image
        destination_blob_name = request_data.get('destinationBlobName', '')
        user_id = request_data.get('userId', 'anonymous')
        
        if not destination_blob_name:
            return https_fn.Response(
                json.dumps({"error": "Destination blob name is required"}),
                status=400,
                headers=headers
            )
        
        if not image_data:
            return https_fn.Response(
                json.dumps({"error": "Image data is required"}),
                status=400,
                headers=headers
            )
        
        # Create temporary file from base64 data
        try:
            # Remove data URL prefix if present
            if image_data.startswith('data:'):
                image_data = image_data.split(',')[1]
            
            image_bytes = base64.b64decode(image_data)
            
            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_file:
                temp_file.write(image_bytes)
                temp_file_path = temp_file.name
            
            # Upload using the template function
            result = upload_image_to_firebase(temp_file_path, destination_blob_name)
            
            # Clean up temporary file
            os.unlink(temp_file_path)
            
            if result['success']:
                # Add additional metadata
                result.update({
                    'userId': user_id,
                    'timestamp': datetime.utcnow().isoformat() + 'Z',
                    'fileSize': len(image_bytes)
                })
                
                return https_fn.Response(
                    json.dumps(result),
                    status=200,
                    headers=headers
                )
            else:
                return https_fn.Response(
                    json.dumps({"error": result['error']}),
                    status=500,
                    headers=headers
                )
                
        except Exception as e:
            return https_fn.Response(
                json.dumps({"error": f"Failed to process image: {str(e)}"}),
                status=500,
                headers=headers
            )
        
    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers=headers
        )

