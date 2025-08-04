# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_functions.options import set_global_options
from firebase_admin import initialize_app
import json
from datetime import datetime
import base64
from google.cloud import storage
import tempfile
import os

# For cost control, you can set the maximum number of containers that can be
# running at the same time. This helps mitigate the impact of unexpected
# traffic spikes by instead downgrading performance. This limit is a per-function
# limit. You can override the limit for each function using the max_instances
# parameter in the decorator, e.g. @https_fn.on_request(max_instances=5).
set_global_options(max_instances=10)

# Initialize Firebase app
initialize_app()

# GCS bucket configuration
BUCKET_NAME = "allstate-8f387.firebasestorage.app"

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
            storage_client = storage.Client()
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

