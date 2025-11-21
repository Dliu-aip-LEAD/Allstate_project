// Mission data configuration
export const missions = {
  
  // **************************************************
  //                   EMAIL CRIMES MISSIONS
  // **************************************************
  // ===== BEGINNER MISSIONS =====
  
  'know-the-lingo': {
    id: 'know-the-lingo',
    title: 'Case #2024-001: Know the Lingo',
    description: 'Master the basic terminology and common attack types in email security',
    department: 'email-crimes',
    difficulty: 'beginner',
    requiredLevel: 1,
    estimatedTime: 8,
    
    content: {
      type: 'terminology',
      scenario: 'Welcome to the Email Crimes Unit! Before investigating real cases, you need to understand the language of email security and common attack patterns.',
      
      clues: {
        phishing: {
          title: "Phishing",
          description: "A fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity in an electronic communication.",
          redFlag: "Deceptive emails requesting personal information"
        },
        spoofing: {
          title: "Email Spoofing",  
          description: "The creation of email messages with a forged sender address to deceive recipients about the message's origin.",
          redFlag: "Fake sender addresses"
        },
        typosquatting: {
          title: "Typosquatting",
          description: "Registering domains with intentional misspellings of popular sites to trick users into visiting malicious websites.",
          redFlag: "Domains that look similar to legitimate sites"
        },
        bec: {
          title: "Business Email Compromise (BEC)",
          description: "A type of scam targeting companies that conduct business via email, often impersonating executives to authorize fraudulent transfers.",
          redFlag: "Executives requesting urgent financial transactions"
        },
        pretext: {
          title: "Pretexting",
          description: "Creating a fabricated scenario to engage a victim and gain their trust to obtain information or access.",
          redFlag: "False stories to build trust"
        }
      },
      
      quizzes: {
        phishing: {
          text: "📧 What is 'phishing' in cybersecurity?",
          options: [
            { text: "A legitimate way to verify email addresses", correct: false },
            { text: "Fraudulent emails designed to steal personal information", correct: true },
            { text: "A method to filter spam emails", correct: false },
            { text: "A type of email encryption", correct: false }
          ],
          feedback: "Correct! Phishing emails pretend to be from trusted sources to trick you into sharing sensitive data."
        },
        typosquatting: {
          text: "🎯 What does 'typosquatting' mean?",
          options: [
            { text: "Making typos in email content", correct: false },
            { text: "Using domains that look similar to real companies", correct: true },
            { text: "Sending emails with spelling errors", correct: false },
            { text: "A type of email formatting", correct: false }
          ],
          feedback: "Exactly! Typosquatting uses fake domains like 'gooogle.com' to trick users."
        },
        bec: {
          text: "🚨 Which scenario describes Business Email Compromise (BEC)?",
          options: [
            { text: "Spam emails selling products", correct: false },
            { text: "CEO asking finance team to wire money urgently", correct: true },
            { text: "Newsletter subscription confirmations", correct: false },
            { text: "Password reset notifications", correct: false }
          ],
          feedback: "Perfect! BEC often involves impersonating executives to authorize fraudulent financial transactions."
        },
        spoofing: {
          text: "🕵️ What is 'email spoofing'?",
          options: [
            { text: "Encrypting an email so others can't read it", correct: false },
            { text: "Forging the sender address to appear from someone else", correct: true },
            { text: "Using emojis in email subjects", correct: false },
            { text: "Forwarding an email without consent", correct: false }
          ],
          feedback: "Right! Spoofing forges the 'From' address to trick recipients into trusting the message."
        },
        pretext: {
          text: "🎭 What does 'pretexting' involve?",
          options: [
            { text: "Pretending to be busy to ignore emails", correct: false },
            { text: "Creating a believable story to gain trust and extract information", correct: true },
            { text: "Sending texts before emails", correct: false },
            { text: "Hiding email headers from recipients", correct: false }
          ],
          feedback: "Exactly. Pretexting builds a false scenario to manipulate victims into sharing data or access."
        }
      }
    },
    
    scoring: {
      maxScore: 100,
      scorePerFlag: 15,
      scorePerQuiz: 25,
      bonusPoints: 10,
      xpReward: 50
    },
    
    unlockRequirements: {
      minimumLevel: 1
    }
  },

  'spot-red-flags': {
    id: 'spot-red-flags',
    title: 'Case #2024-015: Spot the Red Flags',
    description: 'Practice identifying obvious phishing attempts and suspicious email elements',
    department: 'email-crimes',
    difficulty: 'beginner', 
    requiredLevel: 1,
    estimatedTime: 10,
    
    content: {
      type: 'email',
      scenario: 'Your colleague received this email and asks for your opinion. Several red flags make this clearly suspicious - can you spot them all?',
      
      emailContent: {
        from: 'security-team@bank0famerica.net',
        to: 'customer@email.com',
        subject: '🚨 URGENT: Your Account Will Be Closed in 24 Hours!!',
        replyTo: 'no-reply@temporarymail.org',
        body: `Dear Valued Customer,

We have detected SUSPICIOUS ACTIVITY on your account. Your account will be PERMANENTLY CLOSED in 24 hours unless you verify your identity immediately.

CLICK HERE NOW to secure your account: http://secure-bankofamerica-verify.tk/login

You must provide:
- Full Social Security Number
- Complete Credit Card Details  
- Mother's Maiden Name
- Online Banking Password

Failure to comply will result in account termination and legal action.

Best Regards,
Security Team
Bank of America`
      },
      
      // Add bodyHotspots to map suspicious text fragments to clues
      bodyHotspots: {
        // 'SUSPICIOUS ACTIVITY': 'excessiveUrgency',
        'PERMANENTLY CLOSED in 24 hours': 'excessiveUrgency',
        'http://secure-bankofamerica-verify.tk/login': 'suspiciousLink',
        'Full Social Security Number': 'sensitiveInfo',
        'Complete Credit Card Details': 'sensitiveInfo',
        'Online Banking Password': 'sensitiveInfo',
        'Dear Valued Customer': 'poorGrammar'
      },
      
      clues: {
        fakeDomain: {
          title: "Fake Domain",
          description: "The sender uses 'bank0famerica.net' with a zero instead of 'o', which is not the real Bank of America domain.",
          redFlag: "Typosquatting domain impersonation"
        },
        excessiveUrgency: {
          title: "Excessive Urgency",
          description: "Multiple urgent warnings, caps lock, and exclamation points create artificial panic.",
          redFlag: "Overly dramatic urgency tactics"
        },
        suspiciousLink: {
          title: "Malicious Link",
          description: "The link uses a .tk domain (free domain service) and doesn't match the real bank's website.",
          redFlag: "Suspicious shortened or fake URLs"
        },
        sensitiveInfo: {
          title: "Requests Sensitive Data",
          description: "Real banks never ask for full SSN, credit card details, and passwords via email.",
          redFlag: "Requesting sensitive personal information"
        },
        poorGrammar: {
          title: "Generic Greeting",
          description: "Uses 'Dear Valued Customer' instead of your actual name that the real bank would have.",
          redFlag: "Generic, impersonal greetings"
        },
        replyMismatch: {
          title: "Mismatched Reply-To",
          description: "The reply-to address uses a temporary email service, not the bank's official domain.",
          redFlag: "Reply-to address doesn't match sender"
        }
      },
      
      quizzes: {
        fakeDomain: {
          text: "🔍 What's wrong with the sender's email address?",
          options: [
            { text: "It uses 'bank0famerica.net' with a zero instead of 'o'", correct: true },
            { text: "It's too long", correct: false },
            { text: "It doesn't have a security team", correct: false },
            { text: "Nothing seems wrong", correct: false }
          ],
          feedback: "Correct! The zero instead of 'o' is a classic typosquatting technique to fool victims."
        },
        excessiveUrgency: {
          text: "🚨 Why is the subject line with multiple exclamation marks suspicious?",
          options: [
            { text: "It creates artificial panic and urgency", correct: true },
            { text: "It's written in all caps", correct: false },
            { text: "It mentions urgent matters", correct: false },
            { text: "Nothing seems wrong", correct: false }
          ],
          feedback: "Exactly! Multiple exclamation marks and urgent language create artificial panic to pressure victims."
        },
        suspiciousLink: {
          text: "🔗 What's suspicious about the link in the email?",
          options: [
            { text: "It uses a .tk domain which is often used for scams", correct: true },
            { text: "It's too long", correct: false },
            { text: "It mentions security", correct: false },
            { text: "Nothing seems wrong", correct: false }
          ],
          feedback: "Correct! The .tk domain is a free domain service often used by scammers to create fake websites."
        },
        sensitiveInfo: {
          text: "🚨 Why should you never respond to this email?",
          options: [
            { text: "Banks never ask for SSN and passwords via email", correct: true },
            { text: "The email is too long", correct: false },
            { text: "It's sent on the wrong day", correct: false },
            { text: "The font is suspicious", correct: false }
          ],
          feedback: "Exactly! Legitimate banks will never request sensitive information like SSN or passwords through email."
        },
        poorGrammar: {
          text: "📝 What's wrong with the greeting 'Dear Valued Customer'?",
          options: [
            { text: "It's generic and impersonal - real banks know your name", correct: true },
            { text: "It's too formal", correct: false },
            { text: "It's written in English", correct: false },
            { text: "Nothing seems wrong", correct: false }
          ],
          feedback: "Correct! Real banks would address you by your actual name, not with generic greetings."
        },
        replyMismatch: {
          text: "🔍 What's suspicious about the Reply-To address?",
          options: [
            { text: "It uses a temporary email service, not the bank's domain", correct: true },
            { text: "It matches the sender's domain", correct: false },
            { text: "It's a valid business email", correct: false },
            { text: "Nothing seems wrong", correct: false }
          ],
          feedback: "Exactly! The reply-to uses 'temporarymail.org' which is not associated with Bank of America."
        }
      }
    },
    
    scoring: {
      maxScore: 100,
      scorePerFlag: 12,
      scorePerQuiz: 20,
      bonusPoints: 15,
      xpReward: 50
    },
    
    unlockRequirements: {
      minimumLevel: 1
    }
  },

  'email-imposter': {
    id: 'email-imposter',
    title: 'Case #2024-037: The Email Imposter',
    description: 'Investigate a suspicious email claiming to be from a company CEO',
    department: 'email-crimes',
    difficulty: 'beginner',
    requiredLevel: 1,
    estimatedTime: 15,
    
    content: {
      type: 'email',
      scenario: 'You received an urgent email from the CEO requesting immediate action on a confidential matter.',
      
      emailContent: {
        from: 'ceo@techinnovation-corp.co',
        to: 'finance@techinnovation.com',
        subject: 'URGENT: Confidential Payment Required Today',
        replyTo: 'mchen.ceo@tempmail-service.net',
        body: `Dear Finance Team,

I need you to process an urgent wire transfer for a confidential acquisition we're closing today.

Amount: $15,000.00
Recipient: Strategic Consulting LLC
Account: 4789362501
Routing: 021000021

This must be completed by 5 PM today or we'll lose the deal. Please confirm once sent.

Do not discuss this with anyone until the acquisition is announced.

Best regards,
Michael Johnson
CEO`
      },
      
      // Add bodyHotspots to map suspicious text fragments to clues
      bodyHotspots: {
        // 'urgent wire transfer': 'pressure',
        'confidential acquisition': 'secrecy',
        'This must be completed by 5 PM today': 'deadline',
        'Do not discuss this with anyone': 'silence',
        'Michael Johnson': 'signature'
      },
      
      clues: {
        domain: {
          title: "Suspicious Domain",
          description: "The domain 'techinnovation-corp.co' is very similar to the real company domain 'techinnovation.com' but uses '.co' instead. This is a common typosquatting technique.",
          redFlag: "Fake domain mimicking real company"
        },
        urgency: {
          title: "Artificial Urgency",
          description: "Scammers often use urgent language to pressure victims into acting quickly without thinking.",
          redFlag: "Creates false time pressure"
        },
        reply: {
          title: "Suspicious Reply-To",
          description: "The reply-to address uses a temporary email service, not the company's official domain.",
          redFlag: "Reply-to address doesn't match sender"
        },
        // pressure: {
        //   title: "Pressure Tactics",
        //   description: "The word 'urgent' is used to create stress and bypass normal verification procedures.",
        //   redFlag: "Psychological pressure tactics"
        // },
        secrecy: {
          title: "Enforced Secrecy",
          description: "Legitimate business transactions don't typically require secrecy from the finance team.",
          redFlag: "Requests unusual secrecy"
        },
        deadline: {
          title: "Tight Deadline",
          description: "A same-day deadline for a large financial transaction is highly unusual in legitimate business.",
          redFlag: "Unrealistic deadline for verification"
        },
        silence: {
          title: "Isolation Tactic",
          description: "Preventing the victim from discussing with others is a classic scammer technique.",
          redFlag: "Prevents victim from seeking advice"
        },
        signature: {
          title: "Generic Signature",
          description: "Real CEO emails typically have detailed signatures with contact information.",
          redFlag: "Unusually simple signature for CEO"
        }
      },
      
      quizzes: {
        domain: {
          text: "🤔 What's suspicious about the sender's email domain?",
          options: [
            { text: "It's using a secure .com extension", correct: false },
            { text: "The email format looks normal", correct: false },
            { text: "It's 'techinnovation-corp.co' instead of 'techinnovation.com'", correct: true },
            { text: "Nothing seems wrong to me", correct: false }
          ],
          feedback: "Exactly! The domain is designed to look like the real company but uses '.co' instead of '.com' - this is called typosquatting."
        },
        urgency: {
          text: "🎯 Why is the 'URGENT' subject line a red flag?",
          options: [
            { text: "It shows the CEO is very busy", correct: false },
            { text: "It creates pressure to act without thinking", correct: true },
            { text: "It's written in all caps", correct: false },
            { text: "It mentions confidential information", correct: false }
          ],
          feedback: "Correct! Urgent language is a psychological tactic to make you act quickly without proper verification."
        },
        reply: {
          text: "🔍 What's suspicious about the Reply-To address?",
          options: [
            { text: "It uses a temporary email service", correct: true },
            { text: "It matches the sender's domain", correct: false },
            { text: "It's a valid business email", correct: false },
            { text: "Nothing seems wrong", correct: false }
          ],
          feedback: "Correct! The reply-to uses a temporary email service, not the company's official domain."
        },
        pressure: {
          text: "⚡ Why is 'urgent wire transfer' suspicious?",
          options: [
            { text: "It's a legitimate business term", correct: false },
            { text: "It creates psychological pressure", correct: true },
            { text: "It's written in bold", correct: false },
            { text: "It mentions money", correct: false }
          ],
          feedback: "Exactly! The word 'urgent' is used to create stress and bypass normal verification procedures."
        },
        secrecy: {
          text: "🤐 Why is 'confidential acquisition' suspicious?",
          options: [
            { text: "It's a normal business term", correct: false },
            { text: "It requests unusual secrecy", correct: true },
            { text: "It's written in italics", correct: false },
            { text: "It sounds professional", correct: false }
          ],
          feedback: "Correct! Legitimate business transactions don't typically require secrecy from the finance team."
        },
        deadline: {
          text: "⏰ Why is the same-day deadline suspicious?",
          options: [
            { text: "It's a normal business practice", correct: false },
            { text: "It's an unrealistic timeframe", correct: true },
            { text: "It shows urgency", correct: false },
            { text: "It's written clearly", correct: false }
          ],
          feedback: "Exactly! A same-day deadline for a large financial transaction is highly unusual in legitimate business."
        },
        silence: {
          text: "🤫 Why is 'Do not discuss this with anyone' suspicious?",
          options: [
            { text: "It's a security measure", correct: false },
            { text: "It prevents seeking advice", correct: true },
            { text: "It's a standard policy", correct: false },
            { text: "It protects confidentiality", correct: false }
          ],
          feedback: "Correct! Preventing the victim from discussing with others is a classic scammer technique."
        },
        signature: {
          text: "✍️ Why is the CEO signature suspicious?",
          options: [
            { text: "It's too simple for a CEO", correct: true },
            { text: "It's professionally formatted", correct: false },
            { text: "It includes contact info", correct: false },
            { text: "It looks normal", correct: false }
          ],
          feedback: "Exactly! Real CEO emails typically have detailed signatures with contact information."
        }
      }
    },
    
    scoring: {
      maxScore: 100,
      scorePerFlag: 10,
      scorePerQuiz: 15,
      bonusPoints: 20,
      xpReward: 50
    },
    
    unlockRequirements: {
      
      minimumLevel: 1
     
    }
  },

  // ===== ADVANCED MISSIONS =====
  
  'spear-phishing': {
    id: 'spear-phishing', 
    title: 'Case #2024-058: The Spear Phishing Campaign',
    description: 'Analyze a sophisticated targeted attack using personal information to gain credibility',
    department: 'email-crimes',
    difficulty: 'advanced',
    requiredLevel: 2,
    estimatedTime: 12,
    
    content: {
      type: 'email',
      scenario: 'A marketing manager at TechCorp received this highly personalized email. Unlike generic phishing, this attacker has done research on the target. Can you identify the sophisticated tactics?',
      
      emailContent: {
        from: 'sarah.martinez@techcorp-partners.com',
        to: 'mike.johnson@techcorp.com',
        subject: 'Follow-up on the Azure Migration Project - Urgent Security Update',
        replyTo: 'sarah.martinez@techcorp-partners.com',
        body: `Hi Mike,

Hope you had a great weekend! I saw your LinkedIn post about the company retreat in Denver - looked like fun.

I'm reaching out regarding the Azure migration project we discussed last month. Our security team has identified a critical vulnerability that affects the cloud infrastructure we're implementing for TechCorp.

Since you're leading the IT security for this project, I need you to review these updated security protocols immediately. The vulnerability could compromise all migrated data if not addressed by tomorrow's deployment.

Please click here to access the secure document: https://techcorp-partners.com/secure-docs/azure-security-update.pdf

You'll need to enter your TechCorp credentials to verify your identity and access the confidential security protocols.

Given the sensitivity and timeline, I've also cc'd our mutual connection James Chen from the cybersecurity conference in Austin last year.

Best regards,
Sarah Martinez  
Senior Security Consultant
TechCorp Partners LLC
📞 (555) 123-4567
📧 sarah.martinez@techcorp-partners.com

P.S. Looking forward to catching up properly after we resolve this security issue!`
      },
      
      // Add bodyHotspots to map suspicious text fragments to clues
      bodyHotspots: {
        'I saw your LinkedIn post about the company retreat in Denver': 'personalInfo',
        'Azure migration project we discussed last month': 'projectKnowledge',
        'critical vulnerability that affects the cloud infrastructure': 'urgentTechnical',
        'must be addressed by tomorrow\'s deployment': 'urgentTechnical',
        'enter your TechCorp credentials to verify your identity': 'credentialHarvesting',
        'James Chen from the cybersecurity conference in Austin last year': 'mutualConnection',
        'Senior Security Consultant': 'roleImpersonation'
      },
      
      clues: {
        personalInfo: {
          title: "Personal Information Abuse",
          description: "The attacker mentions specific personal details (LinkedIn post, Denver retreat) to build false credibility.",
          redFlag: "Uses researched personal information inappropriately"
        },
        projectKnowledge: {
          title: "Insider Project Knowledge", 
          description: "References the specific 'Azure migration project' suggesting they've researched the company's current initiatives.",
          redFlag: "Demonstrates knowledge of internal projects"
        },
        mutualConnection: {
          title: "False Mutual Connection",
          description: "Claims to know 'James Chen' from a cybersecurity conference to increase trust through social proof.",
          redFlag: "References fake mutual connections"
        },
        urgentTechnical: {
          title: "Technical Urgency",
          description: "Creates urgency around a 'critical vulnerability' that must be fixed by tomorrow's deployment.",
          redFlag: "Technical urgency to bypass security procedures"
        },
        credentialHarvesting: {
          title: "Credential Harvesting",
          description: "Requests TechCorp credentials under the guise of 'verifying identity' for security access.",
          redFlag: "Requests corporate login credentials"
        },
        domainSimilarity: {
          title: "Similar Domain Spoofing",
          description: "Uses 'techcorp-partners.com' which sounds like a legitimate business partner domain.",
          redFlag: "Domain designed to appear as business partner"
        },
        roleImpersonation: {
          title: "Authority Role Impersonation",
          description: "Poses as 'Senior Security Consultant' to justify requesting security-related actions.",
          redFlag: "Impersonates authority figure in relevant field"
        }
      },
      
      quizzes: {
        personalInfo: {
          text: "🎯 What makes this phishing attempt more dangerous than generic ones?",
          options: [
            { text: "It's longer than usual", correct: false },
            { text: "It uses personal information to build false trust", correct: true },
            { text: "It has better grammar", correct: false },
            { text: "It comes from a .com domain", correct: false }
          ],
          feedback: "Correct! Spear phishing uses researched personal information to appear legitimate and trustworthy."
        },
        projectKnowledge: {
          text: "🔍 How does the attacker demonstrate insider knowledge?",
          options: [
            { text: "By mentioning the Azure migration project", correct: true },
            { text: "By using a professional email format", correct: false },
            { text: "By including contact information", correct: false },
            { text: "By mentioning the company name", correct: false }
          ],
          feedback: "Exactly! The attacker references the specific 'Azure migration project' to appear knowledgeable."
        },
        mutualConnection: {
          text: "🤝 Why does the attacker mention 'James Chen'?",
          options: [
            { text: "To increase trust through social proof", correct: true },
            { text: "To provide a reference", correct: false },
            { text: "To show professionalism", correct: false },
            { text: "To avoid suspicion", correct: false }
          ],
          feedback: "Correct! Mentioning mutual connections is a social engineering tactic to build trust."
        },
        urgentTechnical: {
          text: "⚡ What creates urgency in this email?",
          options: [
            { text: "A critical vulnerability affecting tomorrow's deployment", correct: true },
            { text: "The email length", correct: false },
            { text: "The professional signature", correct: false },
            { text: "The company name", correct: false }
          ],
          feedback: "Exactly! The attacker creates urgency around a 'critical vulnerability' to pressure action."
        },
        credentialHarvesting: {
          text: "🚨 What's the biggest red flag in this email?",
          options: [
            { text: "It mentions personal social media activity", correct: false },
            { text: "It requests corporate login credentials via email", correct: true },
            { text: "It talks about a cybersecurity conference", correct: false },
            { text: "It has a professional signature", correct: false }
          ],
          feedback: "Perfect! Requesting corporate credentials via email is a major red flag - legitimate companies never do this."
        },
        domainSimilarity: {
          text: "🔗 What's suspicious about the domain 'techcorp-partners.com'?",
          options: [
            { text: "It's designed to sound like a legitimate business partner", correct: true },
            { text: "It uses a .com extension", correct: false },
            { text: "It's too long", correct: false },
            { text: "It mentions the company name", correct: false }
          ],
          feedback: "Correct! The domain is designed to appear as a legitimate business partner to build trust."
        },
        roleImpersonation: {
          text: "👔 Why does the attacker pose as a 'Senior Security Consultant'?",
          options: [
            { text: "To justify requesting security-related actions", correct: true },
            { text: "To show professionalism", correct: false },
            { text: "To avoid detection", correct: false },
            { text: "To provide credibility", correct: false }
          ],
          feedback: "Exactly! Impersonating an authority figure in the relevant field makes the request seem legitimate."
        }
      }
    },
    
    scoring: {
      maxScore: 100,
      scorePerFlag: 15,
      scorePerQuiz: 25,
      bonusPoints: 30,
      xpReward: 75
    },
    
    unlockRequirements: {
     
      minimumLevel: 2
      
    }
  },

  'fake-account': {
    id: 'fake-account',
    title: 'Case #2024-072: Fake Account Notification',
    description: 'Investigate emails claiming account suspension that steal login credentials',
    department: 'email-crimes',
    difficulty: 'advanced',
    requiredLevel: 2, 
    estimatedTime: 10,
    
    content: {
      type: 'email',
      scenario: 'This Netflix account suspension email looks convincing at first glance. The attackers have improved their tactics - can you spot the subtle deceptions designed to steal login credentials?',
      
      emailContent: {
        from: 'no-reply@netflix.com',
        to: 'subscriber@email.com',
        subject: 'Action Required: Netflix Account Suspended Due to Payment Issue',
        replyTo: 'support@netflix-billing.net',
        body: `Dear Netflix Subscriber,

We hope this email finds you well. We're writing to inform you that your Netflix account has been temporarily suspended due to a payment authorization failure.

Account Details:
- Account Status: Suspended
- Last Payment Attempt: Failed on March 18, 2024
- Subscription Plan: Premium (4 screens, Ultra HD)
- Next Billing Date: March 20, 2024

To avoid permanent account closure and loss of your viewing history, watchlist, and personalized recommendations, please update your payment information within 48 hours.

UPDATE PAYMENT METHOD: https://netflix-account-billing.com/update-payment

What you'll need:
• Your current email and password
• Updated credit card or payment information  
• Billing address verification

If you don't update your payment method by March 20, 2024, your account will be permanently deleted along with all your saved content and viewing preferences.

We apologize for any inconvenience and appreciate your prompt attention to this matter.

Thank you for choosing Netflix.

Best regards,
The Netflix Team

Questions? Visit our Help Center or contact customer support.
---
This email was sent to you because you have a Netflix account. If you no longer wish to receive these emails, you can unsubscribe here.

Netflix, Inc. | 100 Winchester Circle | Los Gatos, CA 95032`
      },
      
      // Add bodyHotspots to map suspicious text fragments to clues
      bodyHotspots: {
        'loss of your viewing history, watchlist, and personalized recommendations': 'timelyThreat',
        'https://netflix-account-billing.com/update-payment': 'fakeUrl',
        'Your current email and password': 'credentialRequest',
        'your account will be permanently deleted along with all your saved content': 'timelyThreat',
        'The Netflix Team': 'lookingReal'
      },
      
      clues: {
        replyMismatch: {
          title: "Reply-To Domain Mismatch",
          description: "While the sender appears to be from netflix.com, the reply-to uses 'netflix-billing.net' which is not Netflix's real domain.",
          redFlag: "Reply-to address uses different domain"
        },
        fakeUrl: {
          title: "Fraudulent Website",
          description: "The link goes to 'netflix-account-billing.com' instead of the real 'netflix.com' domain.",
          redFlag: "Links to fake website mimicking real service"
        },
        credentialRequest: {
          title: "Password Request",
          description: "Legitimate companies never ask you to enter your current password to update payment information.",
          redFlag: "Requests existing login credentials"
        },
        timelyThreat: {
          title: "Data Loss Threat",
          description: "Threatens loss of viewing history and personalized content to create emotional urgency.",
          redFlag: "Threatens loss of personal data"
        },
        lookingReal: {
          title: "Professional Appearance",
          description: "The email looks very professional with proper formatting, realistic account details, and official language.",
          redFlag: "Sophisticated design to appear legitimate"
        },
        spoofedSender: {
          title: "Spoofed Sender Address",
          description: "The 'From' field shows netflix.com but this can be easily faked by attackers.",
          redFlag: "Potentially spoofed sender address"
        }
      },
      
      quizzes: {
        replyMismatch: {
          text: "🔐 How can you tell this isn't really from Netflix?",
          options: [
            { text: "Netflix emails always have different formatting", correct: false },
            { text: "The reply-to address uses a different domain than the sender", correct: true },
            { text: "Netflix never mentions viewing history", correct: false },
            { text: "The grammar is too good", correct: false }
          ],
          feedback: "Correct! The reply-to domain 'netflix-billing.net' is different from the sender's 'netflix.com' - a clear sign of fraud."
        },
        fakeUrl: {
          text: "🔗 What's suspicious about the payment link?",
          options: [
            { text: "It goes to 'netflix-account-billing.com' instead of netflix.com", correct: true },
            { text: "It's too long", correct: false },
            { text: "It mentions billing", correct: false },
            { text: "Nothing seems wrong", correct: false }
          ],
          feedback: "Exactly! The link goes to a fake domain designed to mimic Netflix's real website."
        },
        credentialRequest: {
          text: "🚨 Why is asking for your current password suspicious?",
          options: [
            { text: "Legitimate companies never ask for passwords via email", correct: true },
            { text: "It's a security measure", correct: false },
            { text: "It's required for payment updates", correct: false },
            { text: "It's standard practice", correct: false }
          ],
          feedback: "Correct! Legitimate companies will never ask you to enter your current password to update payment information."
        },
        timelyThreat: {
          text: "⏰ What creates urgency in this email?",
          options: [
            { text: "Threat of losing viewing history and saved content", correct: true },
            { text: "The email length", correct: false },
            { text: "The professional formatting", correct: false },
            { text: "The company name", correct: false }
          ],
          feedback: "Exactly! The email threatens loss of personal data to create emotional urgency and pressure."
        },
        lookingReal: {
          text: "🎭 Why does this email look so convincing?",
          options: [
            { text: "It uses sophisticated design to appear legitimate", correct: true },
            { text: "It's from Netflix", correct: false },
            { text: "It has good grammar", correct: false },
            { text: "It's professionally formatted", correct: false }
          ],
          feedback: "Correct! The attackers have improved their tactics with professional formatting and realistic details."
        },
        spoofedSender: {
          text: "📧 What's suspicious about the sender address?",
          options: [
            { text: "The 'From' field can be easily faked by attackers", correct: true },
            { text: "It uses netflix.com", correct: false },
            { text: "It's too long", correct: false },
            { text: "Nothing seems wrong", correct: false }
          ],
          feedback: "Exactly! The 'From' field showing netflix.com can be easily spoofed by attackers."
        }

    }
  },
    
    scoring: {
      maxScore: 100,
      scorePerFlag: 15,
      scorePerQuiz: 20,
      bonusPoints: 25,
      xpReward: 75
    },
    
    unlockRequirements: {
      
      minimumLevel: 2
    }
  },

  'wire-transfer': {
    id: 'wire-transfer',
    title: 'Case #2024-089: The Wire Transfer Trap', 
    description: 'Complex business email compromise with multiple layers of deception',
    department: 'email-crimes',
    difficulty: 'advanced',
    requiredLevel: 3,
    estimatedTime: 15,
    
    content: {
      type: 'email',
      scenario: 'This sophisticated BEC attack targets a law firm\'s financial operations. The attacker has compromised multiple email accounts and is orchestrating a complex fraud scheme. Can you unravel all the deception layers?',
      
      emailContent: {
        from: 'robert.thompson@partners-legal.com',
        to: 'accounting@partners-legal.com',
        subject: 'RE: Urgent - Confidential Acquisition Wire Transfer - Henderson Holdings',
        replyTo: 'robert.thompson@partners-legal.com',
        body: `Dear Maria,

Following up on our brief conversation yesterday about the Henderson Holdings acquisition. As discussed, we need to execute the earnest money transfer today to secure the deal.

I've been in meetings with Henderson's legal team all morning, and they've confirmed the escrow account details. Please process the wire transfer immediately as their deadline is 3:00 PM EST today.

Transfer Details:
Amount: $245,000.00
Recipient: Henderson Holdings Escrow
Bank: First National Business Bank
Account #: 847592-18493  
Routing #: 021000089
Swift Code: FNBBUS33
Reference: Acquisition Earnest Money - Partners Legal

IMPORTANT: Henderson's acquisition team emphasized this must remain confidential until the deal closes. Please do not discuss this transfer with anyone else in the firm, including David or Jennifer, as it could jeopardize the negotiation if word gets out to competitors.

I'll be unreachable for the next 2 hours as I'm in final negotiations with their board. Please confirm completion by reply email and send the wire confirmation receipt to this email address.

Given the time sensitivity, please prioritize this above other pending transfers. The partnership has been working on this acquisition for 6 months and we cannot afford to lose it over a missed deadline.

Best regards,
Robert Thompson
Senior Partner
Partners Legal Group
Direct: (555) 987-6543

--- CONFIDENTIAL AND PRIVILEGED ---
This communication contains information that is confidential and privileged. If you are not the intended recipient, please delete this message.`
      },
      
      // Add bodyHotspots to map suspicious text fragments to clues
      bodyHotspots: {
        'deadline is 3:00 PM EST today': 'urgentDeadline',
        'do not discuss this transfer with anyone else in the firm, including David or Jennifer': 'isolationTactic',
        'I\'ll be unreachable for the next 2 hours': 'unverifiableAbsence',
        'must remain confidential until the deal closes': 'confidentialityAbuse',
        'The partnership has been working on this acquisition for 6 months and we cannot afford to lose it': 'emotionalPressure',
        'First National Business Bank': 'bankingDetails',
        'Account #: 847592-18493': 'bankingDetails'
      },
      
      clues: {
        compromisedAccount: {
          title: "Potentially Compromised Account",
          description: "The email appears to come from a legitimate company email, suggesting the attacker may have compromised Robert's actual account.",
          redFlag: "Possible account compromise or spoofing"
        },
        isolationTactic: {
          title: "Isolation from Verification",
          description: "Specifically instructs not to discuss with David or Jennifer who could verify the legitimacy of this transaction.",
          redFlag: "Prevents verification through colleagues"
        },
        urgentDeadline: {
          title: "Artificial Deadline Pressure",
          description: "Creates time pressure with a 3:00 PM deadline and claims the deal will be lost if not completed immediately.",
          redFlag: "Urgent deadline to prevent proper verification"
        },
        unverifiableAbsence: {
          title: "Convenient Unavailability",
          description: "Claims to be unreachable for 2 hours during the critical time period, preventing immediate verification.",
          redFlag: "Strategic unavailability during fraud execution"
        },
        confidentialityAbuse: {
          title: "Misused Confidentiality",
          description: "Uses legitimate business confidentiality as a reason to bypass normal verification procedures.",
          redFlag: "Exploits confidentiality to prevent verification"
        },
        bankingDetails: {
          title: "Suspicious Banking Information",
          description: "The bank name and account details should be verified independently as they could be attacker-controlled accounts.",
          redFlag: "Unverified bank account details"
        },
        emotionalPressure: {
          title: "Emotional Investment Pressure",
          description: "Mentions 6 months of work and potential loss of the deal to create emotional pressure to comply.",
          redFlag: "Emotional manipulation to prevent careful consideration"
        },
        processOverride: {
          title: "Procedure Override Request",
          description: "Asks to prioritize this transfer above normal pending transfers, suggesting a bypass of usual controls.",
          redFlag: "Requests to override normal procedures"
        }
      },
      
      quizzes: {
        verification: {
          text: "🔍 What should Maria do before processing this wire transfer?",
          options: [
            { text: "Process it immediately since it's from the senior partner", correct: false },
            { text: "Verify the request through a separate communication channel", correct: true },
            { text: "Wait until Robert is available to discuss", correct: false },
            { text: "Ask David or Jennifer about the acquisition", correct: false }
          ],
          feedback: "Correct! Always verify large financial requests through independent channels like phone calls or in-person confirmation."
        },
        redFlag: {
          text: "🚨 What's the biggest warning sign in this email?",
          options: [
            { text: "The large amount of money", correct: false },
            { text: "Instructions not to verify with other colleagues", correct: true },
            { text: "The mention of confidentiality", correct: false },
            { text: "The tight deadline", correct: false }
          ],
          feedback: "Exactly! Legitimate requests encourage verification, they don't discourage it. This isolation tactic is a major red flag."
        },
        bestPractice: {
          text: "✅ What's the best practice for handling wire transfer requests?",
          options: [
            { text: "Always process executive requests immediately", correct: false },
            { text: "Require dual approval for large transfers", correct: true },
            { text: "Only verify if the amount is over $500,000", correct: false },
            { text: "Trust emails from company domains", correct: false }
          ],
          feedback: "Perfect! Dual approval systems and independent verification procedures help prevent BEC fraud."
        }
      }
    },
    
    scoring: {
      maxScore: 100,
      scorePerFlag: 20,
      scorePerQuiz: 30,
      bonusPoints: 50,
      xpReward: 75
    },
    
    unlockRequirements: {
      
      minimumLevel: 3
     
    }
  },

  // ===== EXPERT MISSION =====
  
  'perfect-impersonation': {
    id: 'perfect-impersonation',
    title: 'Case #2024-100: The Perfect Impersonation',
    description: 'The ultimate test - a nearly flawless CEO impersonation attempt using advanced social engineering',
    department: 'email-crimes',
    difficulty: 'expert',
    requiredLevel: 3,
    estimatedTime: 20,
    
    content: {
      type: 'email',
      scenario: 'This is the final exam of Email Crimes Unit. A master attacker has spent weeks researching TechGlobal Corp and its CEO. They\'ve crafted a nearly perfect impersonation. Only the most subtle clues reveal this as fraud. Can you achieve detective excellence?',
      
      emailContent: {
        from: 'alexandra.williams@techglobal.com',
        to: 'finance-team@techglobal.com',
        subject: 'Time-Sensitive: Q4 Strategic Acquisition Funding - Board Approved',
        replyTo: 'alexandra.williams@techglobal.com',
        body: `Team,

I hope everyone is well and staying productive during this busy quarter.

I'm writing to inform you about a strategic acquisition opportunity that the board approved in yesterday's emergency session. Due to the confidential nature and competitive landscape, I need to keep this information within our core finance team until the announcement.

We're acquiring CloudTech Solutions, a company that perfectly complements our current infrastructure services. The acquisition will strengthen our Q4 results and position us excellently for next year's expansion goals.

The terms require a immediate earnest money deposit of $380,000 to secure the preliminary agreement. CloudTech's investors have given us until COB Friday to commit, as they have competing offers.

Please wire the funds to their designated escrow account:
Recipient: CloudTech Acquisition Escrow LLC
Account: 4847293501847  
Routing: 021000321
Bank: National Business Trust
Reference: TechGlobal-CloudTech Preliminary Agreement

I've attached the board resolution and preliminary term sheet for your records. Please ensure this transaction receives priority processing and send me confirmation once completed.

Given the strategic importance and timeline, I've asked my assistant to hold my calls this afternoon while I finalize terms with CloudTech's legal team. Please proceed with the transfer and we'll discuss details in Monday's finance meeting.

This acquisition represents exactly the type of strategic growth initiative we discussed in our Q3 planning sessions. I'm confident it will exceed our revenue projections for next year.

Thanks for your continued dedication and professionalism.

Best regards,

Alexandra Williams
Chief Executive Officer
TechGlobal Corporation
📧 alexandra.williams@techglobal.com  
📞 Direct: (555) 123-4567
🏢 TechGlobal Corp | 1500 Corporate Plaza, Suite 200 | San Francisco, CA 94105

---
CONFIDENTIAL: This email contains privileged and confidential information intended only for the addressee. If you have received this email in error, please notify the sender and delete this message.`
      },
      
      // Add bodyHotspots to map suspicious text fragments to clues
      bodyHotspots: {
        'COB Friday to commit, as they have competing offers': 'subtleUrgency',
        'Q3 planning sessions': 'contextualKnowledge',
        'infrastructure services': 'contextualKnowledge',
        'board approved in yesterday\'s emergency session': 'boardAuthority',
        'CloudTech Acquisition Escrow LLC': 'bankingDetails',
        'Account: 4847293501847': 'bankingDetails',
        'I\'ve asked my assistant to hold my calls this afternoon': 'unverifiableAbsence'
      },
      
      clues: {
        subtleUrgency: {
          title: "Sophisticated Urgency",
          description: "Creates urgency through 'COB Friday deadline' and 'competing offers' rather than obvious panic language.",
          redFlag: "Sophisticated time pressure tactics"
        },
        contextualKnowledge: {
          title: "Deep Company Knowledge",
          description: "References specific company details like Q3 planning sessions and infrastructure services showing extensive research.",
          redFlag: "Extensive company research for credibility"
        },
        strategicJustification: {
          title: "Legitimate Business Rationale",
          description: "Provides compelling business reasons for the acquisition that align with company goals.",
          redFlag: "Sophisticated business justification"
        },
        boardAuthority: {
          title: "False Authority Reference",
          description: "Claims board approval and emergency session to justify the authority for large expenditure.",
          redFlag: "False claim of board authorization"
        },
        professionalTone: {
          title: "Authentic Communication Style",
          description: "Uses professional language and tone consistent with CEO communications.",
          redFlag: "Mimics authentic executive communication style"
        },
        documentReference: {
          title: "False Document Claims",
          description: "Claims to have attached board resolution and term sheet (but no actual attachments present).",
          redFlag: "References non-existent supporting documents"
        },
        strategicAvailability: {
          title: "Plausible Unavailability",
          description: "Gives a believable reason for being unavailable (legal team meetings) during the transaction period.",
          redFlag: "Believable excuse for unavailability during verification period"
        },
        isolationJustification: {
          title: "Justified Secrecy",
          description: "Uses legitimate business confidentiality and competitive concerns to justify limited communication.",
          redFlag: "Sophisticated justification for secrecy"
        },
        perfectDetails: {
          title: "Accurate Company Details",
          description: "All company information, contact details, and address information appears accurate and professional.",
          redFlag: "Extensive research provides accurate company details"
        }
      },
      
      quizzes: {
        detection: {
          text: "🕵️ What makes this attack so sophisticated and dangerous?",
          options: [
            { text: "It uses perfect grammar and spelling", correct: false },
            { text: "It demonstrates extensive research and authentic communication style", correct: true },
            { text: "It requests a very large amount of money", correct: false },
            { text: "It comes from the real company domain", correct: false }
          ],
          feedback: "Correct! This attack is dangerous because it uses extensive research to create an authentic, believable scenario that's hard to detect."
        },
        verification: {
          text: "🔐 Even with this sophisticated attack, what should the finance team do?",
          options: [
            { text: "Process it since it looks completely legitimate", correct: false },
            { text: "Verify through independent communication with the CEO", correct: true },
            { text: "Wait for the attached documents to be sent", correct: false },
            { text: "Ask other employees if they know about the acquisition", correct: false }
          ],
          feedback: "Correct! No matter how legitimate an email appears, large financial requests should always be verified independently."
        },
        policy: {
          text: "🛡️ What organizational policy would prevent this attack?",
          options: [
            { text: "Requiring all emails to be encrypted", correct: false },
            { text: "Mandatory dual approval for wire transfers over $100,000", correct: true },
            { text: "Blocking emails with financial terms", correct: false },
            { text: "Only allowing wire transfers on Mondays", correct: false }
          ],
          feedback: "Perfect! Dual approval systems ensure that even sophisticated social engineering attacks cannot succeed without multiple verification steps."
        },
        expertise: {
          text: "🎯 What expert-level insight helps detect this fraud?",
          options: [
            { text: "Real CEOs never send wire transfer requests via email", correct: false },
            { text: "Board resolutions for acquisitions follow formal documented processes", correct: true },
            { text: "Acquisitions always require SEC approval first", correct: false },
            { text: "The dollar amount is too specific to be real", correct: false }
          ],
          feedback: "Excellent detective work! Real acquisition processes involve formal documentation, legal reviews, and established protocols that can't be bypassed via email."
        }
      }
    },
    
    scoring: {
      maxScore: 100,
      scorePerFlag: 25,
      scorePerQuiz: 50,
      bonusPoints: 100,
      xpReward: 100
    },
    
    unlockRequirements: {
      
      minimumLevel: 3
      
    }
  },

  // **************************************************
  //                SOCIAL MEDIA MISSIONS
  // **************************************************
  // ===== BEGINNER MISSIONS =====
  
  'social-media-basics': {
    id: 'social-media-basics',
    title: 'Social Media Basics',
    description: 'Learn about common social media scams and red flags to watch for',
    department: 'social-media',
    difficulty: 'beginner',
    requiredLevel: 1,
    estimatedTime: 10,
    
    content: {
      type: 'terminology',
      scenario: 'Welcome to the Social Media Division! Learn the fundamentals of social media security and common scam patterns.',
      
      clues: {
        fakeProfile: {
          title: "Fake Profiles",
          description: "Scammers create fake accounts using stolen photos and false information to build trust with victims.",
          redFlag: "Accounts with few friends, new profiles, or suspicious photos"
        },
        romanceScam: {
          title: "Romance Scams",
          description: "Scammers build romantic relationships online to eventually request money or personal information.",
          redFlag: "Quick declarations of love, requests for money, or refusal to video chat"
        },
        socialEngineering: {
          title: "Social Engineering",
          description: "Manipulating people into revealing confidential information or performing actions.",
          redFlag: "Pressure tactics, urgency, or requests for sensitive information"
        }
      },
      
      quizzes: {
        fakeProfile: {
          text: "📱 What are common signs of a fake social media profile?",
          options: [
            { text: "Many friends and long history", correct: false },
            { text: "Few friends, new account, stolen photos", correct: true },
            { text: "Regular posting schedule", correct: false },
            { text: "Verified account badge", correct: false }
          ],
          feedback: "Correct! Fake profiles often have few connections, are newly created, and use stolen photos."
        },
        romanceScam: {
          text: "💔 What is a red flag in a romance scam?",
          options: [
            { text: "Asking to meet in person", correct: false },
            { text: "Quickly declaring love and asking for money", correct: true },
            { text: "Sharing photos", correct: false },
            { text: "Having mutual friends", correct: false }
          ],
          feedback: "Exactly! Romance scammers move fast, declare love quickly, and eventually ask for money."
        }
      }
    },
    
    scoring: {
      maxScore: 100,
      scorePerFlag: 20,
      scorePerQuiz: 30,
      bonusPoints: 10,
      xpReward: 50
    },
    
    unlockRequirements: {
      minimumLevel: 1
    }
  },

  'spot-fake-profile':{
    id: "spot-fake-profile",
    title: "Spot Fake Profile",
    description: "Identify fake celebrity/influencer accounts trying to scam followers",
    department: "social-media",
    difficulty: "beginner",
    requiredLevel: 1,
    estimatedTime: 12,
    
    content: {
      type: "social-media-accounts",
      scenario: "We've received reports of fake celebrity accounts scamming fans. These imposters pretend to be famous influencers and ask followers to send money, gift cards, or personal information. Your mission is to identify which account is fake by analyzing profile details, engagement patterns, and communication style. Let's catch these imposters!",
      
      comparisonSetup: {
        instruction: "One of these accounts is REAL, one is FAKE. Study the details carefully!",
        accountsToCompare: 2,
        realAccountIndex: 0,
        fakeAccountIndex: 1
      },
      
      accounts: [
        {
          accountId: "account-1",
          accountType: "real",
          isCorrectAnswer: false,
          
          header: {
            platformStyle: "instagram",
            backgroundColor: "#667eea",
            backgroundGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          },
          
          profile: {
            name: "Sarah Mitchell",
            username: "@SarahMitchellOfficial",
            avatar: "👩",
            verified: true,
            verificationBadge: {
              type: "platform",
              color: "#1DA1F2",
              icon: "✓"
            },
            bio: "Content Creator | Fashion & Lifestyle\n📍 Los Angeles, CA\n💼 Business: team@sarahmitchell.com",
            location: "Los Angeles, CA"
          },
          
          statistics: {
            followers: 2400000,
            following: 892,
            posts: 3245,
            averageEngagement: {
              likesPerPost: 45000,
              commentsPerPost: 2300,
              description: "High engagement ratio - typical for verified accounts"
            }
          },
          
          accountInfo: [
            {
              label: "Joined",
              value: "March 2015",
              isRedFlag: false
            },
            {
              label: "Website",
              value: "sarahmitchell.com",
              isRedFlag: false,
              verifiable: true
            },
            {
              label: "Business Email",
              value: "team@sarahmitchell.com",
              isRedFlag: false
            },
            {
              label: "Recent Activity",
              value: "Posts regularly with authentic engagement",
              isRedFlag: false
            }
          ],
          
          recentPost: {
            text: "Thank you for 2M followers! 🎉 Remember, I NEVER ask for money or gift cards via DM. If someone claiming to be me does, it's a scam! Report and block them. Stay safe! ❤️",
            engagement: {
              likes: 52000,
              comments: 3400,
              shares: 890
            },
            hasScamWarning: true
          },
          
          redFlags: [],
          
          legitimacyIndicators: [
            "✅ Official verified account with real blue checkmark",
            "✅ Established join date (2015)",
            "✅ High follower count with reasonable following ratio",
            "✅ Official website linked",
            "✅ Professional business contact information",
            "✅ High engagement rate (45K likes per post)",
            "✅ Actively warns followers about scams",
            "✅ Authentic interaction patterns"
          ]
        },
        
        {
          accountId: "account-2",
          accountType: "fake",
          isCorrectAnswer: true,
          
          header: {
            platformStyle: "instagram",
            backgroundColor: "#667eea",
            backgroundGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          },
          
          profile: {
            name: "Sarah Mitchell",
            username: "@SarahMitchell_0fficial",
            avatar: "👩",
            verified: false,
            verificationBadge: {
              type: "fake-emoji",
              color: "#999999",
              icon: "✓",
              note: "This is just an emoji, not a platform-issued badge"
            },
            bio: "Official Account 💎\nDM me for collaborations! 💰\nClick link below 👇",
            location: "Not specified"
          },
          
          statistics: {
            followers: 15200,
            following: 7234,
            posts: 47,
            averageEngagement: {
              likesPerPost: 200,
              commentsPerPost: 45,
              description: "Very low engagement ratio - suspicious"
            }
          },
          
          accountInfo: [
            {
              label: "Joined",
              value: "October 2024",
              isRedFlag: true,
              redFlagType: "recentAccount"
            },
            {
              label: "Website",
              value: "No website linked",
              isRedFlag: true,
              redFlagType: "noWebsite"
            },
            {
              label: "Contact",
              value: "DM me for collaborations! 💰",
              isRedFlag: true,
              redFlagType: "unprofessionalContact"
            },
            {
              label: "Recent Activity",
              value: "Sends unsolicited DMs asking for money",
              isRedFlag: true,
              redFlagType: "scamBehavior"
            }
          ],
          
          recentPost: {
            text: "🎁 GIVEAWAY ALERT! 🎁 I'm giving away $5000 to 10 lucky winners! To enter: 1) Follow me 2) Like this post 3) DM me your email and phone number 4) Send $25 processing fee via Cash App to claim your prize! Winner announced in 24 hours! ⏰✨",
            engagement: {
              likes: 180,
              comments: 89,
              shares: 12
            },
            hasScamWarning: false
          },
          
          redFlags: [
            {
              type: "usernameVariation",
              description: "Username uses '0' instead of 'O' and underscore",
              severity: "high",
              explanation: "Typosquatting - using character substitutions to impersonate real accounts"
            },
            {
              type: "fakeVerification",
              description: "Verification badge is just an emoji, not platform-issued",
              severity: "critical",
              explanation: "Real verification badges are issued by the platform and have specific styling"
            },
            {
              type: "recentCreation",
              description: "Account created recently (October 2024)",
              severity: "medium",
              explanation: "Real influencer accounts are typically established years ago"
            },
            {
              type: "suspiciousRatio",
              description: "Following more accounts (7,234) than followers (15,200)",
              severity: "medium",
              explanation: "Real influencers typically have much higher follower-to-following ratio"
            },
            {
              type: "lowPostCount",
              description: "Only 47 posts despite claiming to be established influencer",
              severity: "medium",
              explanation: "Real content creators have extensive post history"
            },
            {
              type: "lowEngagement",
              description: "Only 200 likes per post with 15K followers (1.3% engagement)",
              severity: "high",
              explanation: "Real influencers typically have 3-10% engagement rate"
            },
            {
              type: "noWebsite",
              description: "No official website or professional contact information",
              severity: "medium",
              explanation: "Established influencers always have official websites"
            },
            {
              type: "scamGiveaway",
              description: "Giveaway requires processing fee ($25)",
              severity: "critical",
              explanation: "Legitimate giveaways NEVER require payment"
            },
            {
              type: "personalInfoRequest",
              description: "Asks for email and phone number via DM",
              severity: "high",
              explanation: "Collecting personal information for identity theft or further scams"
            }
          ],
          
          scamTactics: [
            "🚩 Username variation to deceive followers",
            "🚩 Fake verification badge (emoji)",
            "🚩 Very recent account creation",
            "🚩 Low engagement vs follower count",
            "🚩 Minimal post history",
            "🚩 No professional contact information",
            "🚩 Requests payment for 'giveaway'",
            "🚩 Asks for personal information",
            "🚩 Unprofessional communication"
          ]
        }
      ],
      
      quiz: {
        instruction: "Answer these questions to complete your investigation:",
        questions: [
          {
            questionId: "q1",
            type: "single-choice",
            text: "Which account is the FAKE impersonator?",
            points: 25,
            options: [
              {
                id: "opt1",
                text: "Account 1 (@SarahMitchellOfficial)",
                isCorrect: false
              },
              {
                id: "opt2",
                text: "Account 2 (@SarahMitchell_0fficial)",
                isCorrect: true
              }
            ],
            feedback: {
              correct: "Correct! Account 2 is the fake impersonator using typosquatting (0 instead of O).",
              incorrect: "Incorrect. Account 2 is the fake one - notice the '0' instead of 'O' in the username and the fake verification badge."
            },
            explanation: "The fake account uses '@SarahMitchell_0fficial' with a zero instead of the letter O, a common impersonation technique called typosquatting."
          },
          
          {
            questionId: "q2",
            type: "single-choice",
            text: "What is the BIGGEST red flag in the fake account?",
            points: 25,
            options: [
              {
                id: "opt1",
                text: "Low follower count",
                isCorrect: false
              },
              {
                id: "opt2",
                text: "Asking for money/processing fees in 'giveaway'",
                isCorrect: true
              },
              {
                id: "opt3",
                text: "Recent join date",
                isCorrect: false
              },
              {
                id: "opt4",
                text: "No website linked",
                isCorrect: false
              }
            ],
            feedback: {
              correct: "Exactly right! Asking for payment to claim a prize is the clearest sign of a scam. Real giveaways NEVER require fees.",
              incorrect: "While all these are red flags, the BIGGEST one is asking for $25 processing fee. Legitimate giveaways never require payment."
            },
            explanation: "Requesting payment or 'processing fees' for giveaways is a critical red flag. Real influencers and brands never ask for money to claim prizes."
          },
          
          {
            questionId: "q3",
            type: "single-choice",
            text: "How can you tell the verification badge is fake?",
            points: 25,
            options: [
              {
                id: "opt1",
                text: "Real verified accounts have blue checkmarks from the platform",
                isCorrect: false
              },
              {
                id: "opt2",
                text: "The badge looks slightly different in color",
                isCorrect: false
              },
              {
                id: "opt3",
                text: "Anyone can add emoji checkmarks to their name",
                isCorrect: false
              },
              {
                id: "opt4",
                text: "All of the above",
                isCorrect: true
              }
            ],
            feedback: {
              correct: "Perfect! All of these are correct. Platform-issued verification badges have specific styling that can't be replicated with emojis.",
              incorrect: "Actually, all of these statements are true. The combination of these factors helps identify fake verification badges."
            },
            explanation: "Real verification badges are issued by the social media platform and have distinctive styling. Fake accounts often use emoji checkmarks (✓) that anyone can add to their username or bio."
          },
          
          {
            questionId: "q4",
            type: "single-choice",
            text: "What should you do if you receive a DM from this fake account?",
            points: 25,
            options: [
              {
                id: "opt1",
                text: "Send the money to see if it's real",
                isCorrect: false
              },
              {
                id: "opt2",
                text: "Report the account and block them",
                isCorrect: true
              },
              {
                id: "opt3",
                text: "Share your personal information",
                isCorrect: false
              },
              {
                id: "opt4",
                text: "Reply to ask questions",
                isCorrect: false
              }
            ],
            feedback: {
              correct: "Absolutely correct! Always report and block suspicious accounts to protect yourself and others.",
              incorrect: "Never engage with scam accounts. The correct action is to report and block them immediately."
            },
            explanation: "When you encounter a fake account, report it to the platform and block it. Never send money, share personal information, or engage with scammers."
          }
        ]
      },
      
      educationalContent: {
        keyLearnings: {
          title: "🎓 Key Red Flags in Fake Influencer Accounts",
          points: [
            "Username variations (0 for O, added underscores, slight misspellings)",
            "Fake verification badges (emoji checkmarks instead of platform badges)",
            "Recent account creation dates",
            "Low post count compared to claimed popularity",
            "Suspicious follower-to-following ratios",
            "Very low engagement rates (likes/comments vs followers)",
            "No official website or professional contact",
            "Requests for payment in 'giveaways'",
            "Asking for personal information via DM"
          ]
        },
        
        safetyTips: {
          title: "🛡️ How to Verify Real Accounts",
          tips: [
            "✅ Check for platform-issued verification badge (blue checkmark)",
            "✅ Verify username spelling carefully",
            "✅ Look at account creation date (established accounts)",
            "✅ Check engagement ratio (should be 3-10% of followers)",
            "✅ Visit official website to confirm social media links",
            "✅ Real celebrities never ask for money in DMs",
            "✅ Cross-reference with other official accounts",
            "✅ Be skeptical of too-good-to-be-true offers"
          ]
        },
        
        commonTactics: {
          title: "🎭 Common Impersonation Tactics",
          tactics: [
            "Typosquatting - slight username variations (O→0, I→l)",
            "Fake verification badges - emoji checkmarks",
            "Copy-paste bio and photos from real accounts",
            "Promise of exclusive deals or giveaways",
            "Request payment for 'processing fees'",
            "Ask for personal information",
            "Create urgency with limited-time offers",
            "Use emotional manipulation",
            "Impersonate customer service accounts"
          ]
        }
      }
    },
    
    scoring: {
      maxScore: 100,
      accountSelection: {
        points: 0,
        description: "No points for account selection - included in quiz Q1"
      },
      quizScoring: {
        totalQuestions: 4,
        pointsPerQuestion: 25,
        passingScore: 75
      },
      bonusPoints: 0,
      xpReward: 75
    },
    
    unlockRequirements: {
      minimumLevel: 1,
      prerequisiteMissions: []
    },
    
    rewards: {
      xp: 75,
      points: 100,
      badges: ["profile-detective", "impersonation-spotter"],
      unlocks: ["investment-scheme-alert", "friend-request-trap"]
    },
    
    hints: [
      {
        cost: 5,
        text: "Look carefully at the usernames - is there any character substitution?"
      },
      {
        cost: 5,
        text: "Compare the engagement rates (likes per post vs total followers)"
      },
      {
        cost: 10,
        text: "Check if the verification badge is a real platform badge or just an emoji"
      }
    ]
  },

  'fake-giveaway-detector': {
    // Basic Mission Information
    id: 'fake-giveaway-detector',
    title: 'Fake Giveaway Detector',
    description: 'Analyze social media posts to distinguish legitimate giveaways from scam attempts',
    department: 'social-media',
    difficulty: 'beginner',
    requiredLevel: 2,
    estimatedTime: 12,
    
    // Mission Content
    content: {
      type: 'social-media-posts',
      scenario: 'Detective, fake giveaways are everywhere on social media! Scammers use them to steal personal information, spread malware, or trick people into sending money. Your mission: analyze these social media posts and determine which are legitimate and which are scams. Look for red flags like suspicious URLs, requests for payment, and unrealistic prizes!',
      
      // Array of social media posts to analyze
      posts: [
        {
          // Post 1: SCAM - Fake iPhone Giveaway
          postId: 'post-1',
          postType: 'scam',
          
          // Post Header Information
          header: {
            username: 'Apple Giveaways',
            handle: '@AppleGiveaways_Official',
            avatar: '📱',
            verified: false, // fake verification
            verifiedBadge: '✓', // emoji badge (fake)
            timestamp: '2 hours ago'
          },
          
          // Post Content
          content: {
            text: `🎉 **FREE iPhone 15 Pro MAX GIVEAWAY!** 🎉
  
  We're giving away 100 NEW iPhone 15 Pro to celebrate reaching 50K followers! 🎊
  
  **TO ENTER:**
  1. Follow @AppleGiveaways_Official
  2. Like & Share this post
  3. Tag 10 friends in comments
  4. Click link to verify: bit.ly/free-iphone-claim
  5. Pay $9.99 shipping fee to claim
  
  ⏰ ONLY 24 HOURS LEFT! Winners announced tomorrow!
  
  ⚠️ Must complete ALL steps or you won't be entered!`,
            
            // Highlighted suspicious elements
            highlightedElements: [
              {
                text: '100 NEW iPhone 15 Pro',
                flagType: 'unrealisticPrize',
                tooltip: 'Click to flag: Unrealistic prize quantity'
              },
              {
                text: 'bit.ly/free-iphone-claim',
                flagType: 'suspiciousUrl',
                tooltip: 'Click to flag: Shortened URL'
              },
              {
                text: 'Pay $9.99 shipping fee',
                flagType: 'paymentRequest',
                tooltip: 'Click to flag: Payment required'
              },
              {
                text: 'ONLY 24 HOURS LEFT!',
                flagType: 'artificialUrgency',
                tooltip: 'Click to flag: Artificial urgency'
              },
              {
                text: '✓',
                flagType: 'fakeVerification',
                tooltip: 'Click to flag: Fake verification badge'
              }
            ]
          },
          
          // Post Statistics
          stats: {
            likes: 1243,
            comments: 5672,
            shares: 892
          },
          
          // Correct Answer
          correctVerdict: 'scam',
          
          // Feedback for user's choice
          feedback: {
            correct: {
              title: '✅ Correct! This is a SCAM',
              message: 'Great detective work! Here are the red flags you spotted:',
              redFlags: [
                '🚩 Asks for shipping/processing fee (legitimate giveaways never require payment)',
                '🚩 Fake verification badge (just an emoji, not real platform verification)',
                '🚩 Shortened URL (bit.ly) - could lead to phishing site',
                '🚩 Unrealistic prize (100 iPhones worth $100,000+)',
                '🚩 Artificial urgency ("24 HOURS LEFT!")',
                '🚩 Suspicious account name not matching official Apple social media'
              ]
            },
            incorrect: {
              title: '❌ Incorrect - This is actually a SCAM',
              message: 'Let me show you the red flags you missed:',
              redFlags: [
                '🚩 Legitimate companies NEVER ask for fees to claim prizes',
                '🚩 The verification badge is fake (just an emoji)',
                '🚩 Shortened URLs often lead to phishing sites',
                '🚩 100 new iPhones would cost over $100,000 - unrealistic',
                '🚩 Real Apple giveaways would be on official @Apple account'
              ]
            }
          }
        },
        
        {
          // Post 2: LEGITIMATE - Real Company Giveaway
          postId: 'post-2',
          postType: 'legitimate',
          
          // Post Header Information
          header: {
            username: 'Starbucks',
            handle: '@Starbucks',
            avatar: '☕',
            verified: true, // real platform verification
            verifiedBadge: '✓', // platform badge (real)
            verifiedColor: '#1DA1F2',
            timestamp: '5 hours ago'
          },
          
          // Post Content
          content: {
            text: `☕ **Holiday Season Giveaway** ☕
  
  To celebrate the holidays, we're giving away a year of free coffee to 5 lucky winners!
  
  **How to enter:**
  1. Follow @Starbucks
  2. Like this post
  3. Comment with your favorite holiday drink
  
  Winners will be randomly selected on December 20th and notified via DM. No purchase necessary. See official rules at starbucks.com/giveaway
  
  *We will NEVER ask you to pay fees or provide credit card information to claim a prize.*`,
            
            // No highlighted elements - this is legitimate
            highlightedElements: []
          },
          
          // Post Statistics
          stats: {
            likes: 45293,
            comments: 12847,
            shares: 3421
          },
          
          // Correct Answer
          correctVerdict: 'legitimate',
          
          // Feedback for user's choice
          feedback: {
            correct: {
              title: '✅ Correct! This is LEGITIMATE',
              message: 'Excellent judgment! Here are the signs of a real giveaway:',
              redFlags: [
                '✅ Official verified account with real blue checkmark',
                '✅ Reasonable prize (year of coffee, not cash/expensive items)',
                '✅ No payment or personal information required',
                '✅ Links to official rules on company website',
                '✅ Explicitly states they won\'t ask for payment or credit cards',
                '✅ High engagement from real followers',
                '✅ Simple entry process (no suspicious links or fees)'
              ]
            },
            incorrect: {
              title: '❌ Incorrect - This is actually LEGITIMATE',
              message: 'This is a real giveaway! Here\'s what makes it legitimate:',
              redFlags: [
                '✅ Official verified Starbucks account',
                '✅ No payment required',
                '✅ Links to official rules on their website',
                '✅ Reasonable prize that matches their business',
                '✅ States clearly they won\'t ask for payment',
                'Real companies do run legitimate giveaways for marketing!'
              ]
            }
          }
        },
        
        {
          // Post 3: SCAM - Cash App Advance-Fee Fraud
          postId: 'post-3',
          postType: 'scam',
          
          // Post Header Information
          header: {
            username: 'Mr.Beast Official',
            handle: '@MrBeast-Giveaway99',
            avatar: '💰',
            verified: false, // fake verification
            verifiedBadge: '✓', // emoji badge (fake)
            timestamp: '1 hour ago'
          },
          
          // Post Content
          content: {
            text: `💵 **$10,000 CASH GIVEAWAY!!!** 💵
  
  I'm feeling generous today! Sending $10,000 via Cash App to the first 100 people who follow these steps:
  
  1. Follow me NOW
  2. Send $25 activation fee to my Cash App: $MrBeast-Giveaway99
  3. Send screenshot of payment in DM
  4. I'll send you $10,000 within 5 minutes!
  
  ⏰ HURRY! Limited spots! ⏰
  
  Already paid out 47 people! You could be next! 🤑💰`,
            
            // Highlighted suspicious elements
            highlightedElements: [
              {
                text: '$10,000 CASH GIVEAWAY!!!',
                flagType: 'unrealisticPrize',
                tooltip: 'Click to flag: Unrealistic cash prize'
              },
              {
                text: 'Mr.Beast Official',
                flagType: 'impersonation',
                tooltip: 'Click to flag: Celebrity impersonation'
              },
              {
                text: '$25 activation fee',
                flagType: 'paymentRequest',
                tooltip: 'Click to flag: Requires payment'
              },
              {
                text: 'Send screenshot of payment',
                flagType: 'sensitiveInfo',
                tooltip: 'Click to flag: Requests sensitive info'
              },
              {
                text: 'I\'ll send you $10,000 within 5 minutes!',
                flagType: 'tooGoodToBeTrue',
                tooltip: 'Click to flag: Too good to be true'
              },
              {
                text: 'HURRY! Limited spots!',
                flagType: 'artificialUrgency',
                tooltip: 'Click to flag: Artificial urgency'
              }
            ]
          },
          
          // Post Statistics
          stats: {
            likes: 892,
            comments: 2341,
            shares: 156
          },
          
          // Correct Answer
          correctVerdict: 'scam',
          
          // Feedback for user's choice
          feedback: {
            correct: {
              title: '✅ Correct! This is a SCAM',
              message: 'Perfect! You spotted this "advance fee" scam. Red flags:',
              redFlags: [
                '🚩 Requires payment ($25 "activation fee") to receive money',
                '🚩 Fake account impersonating celebrity (likely misspelled username)',
                '🚩 Fake verification badge (emoji)',
                '🚩 Too good to be true (send $25, get $10,000)',
                '🚩 Artificial urgency and limited spots',
                '🚩 Asks to DM payment screenshots (to confirm victims)',
                '🚩 Real MrBeast would NEVER ask followers to send money first'
              ]
            },
            incorrect: {
              title: '❌ Incorrect - This is a classic SCAM',
              message: 'This is a dangerous advance-fee fraud! Red flags:',
              redFlags: [
                '🚩 MAJOR: Requires payment to receive prize (classic scam)',
                '🚩 Real celebrities NEVER ask followers to send money',
                '🚩 Promise of huge return ($25 → $10,000) is impossible',
                '🚩 Impersonating famous person',
                '🚩 Creates false urgency',
                'RULE: If you have to pay to "win," it\'s ALWAYS a scam!'
              ]
            }
          }
        }
      ],
      
      // Educational content to display
      educationalContent: {
        introduction: {
          title: '🎓 What You\'ll Learn',
          points: [
            'Distinguish legitimate from fake giveaways',
            'Recognize advance-fee fraud tactics',
            'Identify suspicious URLs and payment requests',
            'Understand verification authenticity'
          ]
        },
        
        safetyTips: {
          title: '🛡️ Giveaway Safety Tips',
          tips: [
            '✅ Real companies never ask for fees to claim prizes',
            '✅ Verify accounts through official channels',
            '✅ Check for platform-issued verification badges',
            '✅ Be skeptical of "too good to be true" offers',
            '✅ Never send money to claim a prize',
            '✅ Report suspicious accounts immediately'
          ]
        },
        
        commonScamTactics: {
          title: '🚨 Common Scam Tactics',
          tactics: [
            'Advance-fee fraud (pay to claim prize)',
            'Fake verification badges',
            'Celebrity/brand impersonation',
            'Artificial urgency and limited availability',
            'Shortened or suspicious URLs',
            'Requests for personal/financial information',
            'Unrealistic prize values or quantities'
          ]
        }
      }
    },
    
    // Scoring Configuration
    scoring: {
      maxScore: 100,
      scorePerCorrectVerdict: 33, // 33 points per correct answer (3 posts)
      bonusPoints: 1, // bonus for getting all correct
      passingScore: 66, // need 2 out of 3 correct
      xpReward: 75
    },
    
    // Completion Requirements
    completionRequirements: {
      minimumCorrect: 2, // must get at least 2 out of 3 correct
      totalPosts: 3
    },
    
    // Unlock Requirements
    unlockRequirements: {
      minimumLevel: 2,
      prerequisiteMissions: ['spot-fake-profile']
    },
    
    // Mission Rewards
    rewards: {
      xp: 75,
      points: 100,
      badges: ['giveaway-detective'],
      unlocks: ['investment-scheme-alert']
    }
  },

  // ===== ADVANCED MISSIONS =====
  
  'spear-phishing-campaign': {
    id: 'spear-phishing-campaign',
    title: 'The Spear Phishing Campaign',
    description: 'Analyze a targeted attack using personal information to gain credibility',
    department: 'social-media',
    difficulty: 'advanced',
    requiredLevel: 2,
    estimatedTime: 20,
    
    content: {
      type: 'message',
      scenario: 'You receive a message from someone who knows personal details about you. Is this a legitimate contact or a sophisticated spear phishing attempt?',
      
      clues: {
        personalInfo: {
          title: "Personal Information Used",
          description: "Scammers gather public information from your social media to appear legitimate.",
          redFlag: "Mentioning specific personal details you've shared publicly"
        },
        urgentRequest: {
          title: "Urgent Request",
          description: "Creating urgency to bypass your normal security checks.",
          redFlag: "Pressure to act immediately without verification"
        },
        suspiciousLink: {
          title: "Suspicious Link",
          description: "Links that don't match the claimed sender or service.",
          redFlag: "URLs that don't match official domains"
        }
      },
      
      quizzes: {
        personalInfo: {
          text: "🎣 How do spear phishers gain credibility?",
          options: [
            { text: "Using official email addresses", correct: false },
            { text: "Using personal information from your public profiles", correct: true },
            { text: "Sending from verified accounts", correct: false },
            { text: "Using professional language", correct: false }
          ],
          feedback: "Correct! Spear phishers research their targets using public social media information."
        }
      }
    },
    
    scoring: {
      maxScore: 150,
      scorePerFlag: 30,
      scorePerQuiz: 40,
      bonusPoints: 20,
      xpReward: 100
    },
    
    unlockRequirements: {
      minimumLevel: 2,
      previousMissions: ['fake-giveaway-detector']
    }
  },

  'fake-account-notification': {
    id: 'fake-account-notification',
    title: 'Fake Account Notification',
    description: 'Investigate emails claiming account suspension that steal login credentials',
    department: 'social-media',
    difficulty: 'advanced',
    requiredLevel: 2,
    estimatedTime: 18,
    
    content: {
      type: 'email',
      scenario: 'You receive an email claiming your social media account will be suspended. Is this legitimate or a phishing attempt?',
      
      clues: {
        fakeSender: {
          title: "Fake Sender Address",
          description: "The email comes from a domain that doesn't match the official service.",
          redFlag: "Sender domain doesn't match official company domain"
        },
        loginRequest: {
          title: "Requests Login",
          description: "Legitimate services rarely ask you to log in via email links.",
          redFlag: "Asking you to click a link and enter credentials"
        },
        urgency: {
          title: "False Urgency",
          description: "Creating panic to make you act without thinking.",
          redFlag: "Threats of immediate account closure"
        }
      },
      
      quizzes: {
        fakeSender: {
          text: "📧 What should you check in a suspicious email?",
          options: [
            { text: "The email subject", correct: false },
            { text: "The sender's email address domain", correct: true },
            { text: "The email formatting", correct: false },
            { text: "The email length", correct: false }
          ],
          feedback: "Exactly! Always verify the sender's domain matches the official company."
        }
      }
    },
    
    scoring: {
      maxScore: 150,
      scorePerFlag: 30,
      scorePerQuiz: 40,
      bonusPoints: 20,
      xpReward: 100
    },
    
    unlockRequirements: {
      minimumLevel: 2,
      previousMissions: ['spear-phishing-campaign']
    }
  },

  'wire-transfer-trap': {
    id: 'wire-transfer-trap',
    title: 'The Wire Transfer Trap',
    description: 'Complex business email compromise with multiple layers of deception',
    department: 'social-media',
    difficulty: 'advanced',
    requiredLevel: 2,
    estimatedTime: 25,
    
    content: {
      type: 'scenario',
      scenario: 'A sophisticated scam combines social media research with email impersonation to trick you into a wire transfer. Can you identify all the deception layers?',
      
      clues: {
        socialResearch: {
          title: "Social Media Research",
          description: "Scammers researched your connections and business relationships online.",
          redFlag: "Mentioning specific business contacts or relationships"
        },
        impersonation: {
          title: "Executive Impersonation",
          description: "Pretending to be a trusted authority figure to authorize transactions.",
          redFlag: "Urgent requests from executives via email"
        },
        wireTransfer: {
          title: "Wire Transfer Request",
          description: "Legitimate businesses have proper procedures, not urgent email requests.",
          redFlag: "Requesting immediate wire transfers via email"
        }
      },
      
      quizzes: {
        socialResearch: {
          text: "💸 How do scammers make wire transfer scams convincing?",
          options: [
            { text: "Using official letterhead", correct: false },
            { text: "Researching your business relationships on social media", correct: true },
            { text: "Sending from company domains", correct: false },
            { text: "Using professional language", correct: false }
          ],
          feedback: "Correct! They research your connections to make their impersonation more believable."
        }
      }
    },
    
    scoring: {
      maxScore: 150,
      scorePerFlag: 30,
      scorePerQuiz: 40,
      bonusPoints: 20,
      xpReward: 120
    },
    
    unlockRequirements: {
      minimumLevel: 2,
      previousMissions: ['fake-account-notification']
    }
  },

  // ===== EXPERT MISSIONS =====
  
  'perfect-impersonation': {
    id: 'perfect-impersonation',
    title: 'The Perfect Impersonation',
    description: 'Account Notification impersonation login credentials',
    department: 'social-media',
    difficulty: 'expert',
    requiredLevel: 3,
    estimatedTime: 30,
    
    content: {
      type: 'complex',
      scenario: 'A nearly perfect impersonation attack combines multiple techniques. Every detail seems legitimate. Can you find the subtle flaws?',
      
      clues: {
        perfectTiming: {
          title: "Perfect Timing",
          description: "The attack happens at a time when you'd expect such communication.",
          redFlag: "Coincidental timing that seems too perfect"
        },
        subtleDomain: {
          title: "Subtle Domain Variation",
          description: "The domain is almost identical to the real one, with a tiny difference.",
          redFlag: "Domain with subtle character substitution (e.g., rn vs m)"
        },
        multiChannel: {
          title: "Multi-Channel Attack",
          description: "Uses multiple communication channels to build credibility.",
          redFlag: "Coordinated messages across email, social media, and text"
        }
      },
      
      quizzes: {
        subtleDomain: {
          text: "🎭 What makes an impersonation 'perfect'?",
          options: [
            { text: "Using exact official branding", correct: false },
            { text: "Combining subtle domain tricks with social engineering", correct: true },
            { text: "Sending from verified accounts", correct: false },
            { text: "Using professional templates", correct: false }
          ],
          feedback: "Exactly! Perfect impersonations combine technical tricks with psychological manipulation."
        }
      }
    },
    
    scoring: {
      maxScore: 200,
      scorePerFlag: 40,
      scorePerQuiz: 50,
      bonusPoints: 30,
      xpReward: 150
    },
    
    unlockRequirements: {
      minimumLevel: 3,
      previousMissions: ['wire-transfer-trap']
    }
  },

  

};

// Department configuration
export const departments = {
  'email-crimes': {
    id: 'email-crimes',
    name: 'Email Crimes Unit',
    description: 'Master phishing detection, spoofing, and email security',
    icon: '📧',
    color: 'from-blue-600 to-blue-700',
    
    unlockRequirements: {
      minimumLevel: 1,
      previousDepartment: null,
      minimumMissionsCompleted: 0
    },
    
    missions: [
      'know-the-lingo',
      'spot-red-flags', 
      'email-imposter',
      'spear-phishing',
      'fake-account',
      'wire-transfer',
      'perfect-impersonation'
    ],
    
    rewards: {
      experiencePoints: 50,
      scoreMultiplier: 1.0,
      specialAbilities: ['email_analysis_boost']
    }
  },
  
  'social-media': {
    id: 'social-media',
    name: 'Social Media Division',
    description: 'Combat fake profiles, romance scams, and social engineering',
    icon: '📱',
    color: 'from-purple-600 to-purple-700',
    
    unlockRequirements: {
      minimumLevel: 1,
      previousDepartment: 'email-crimes',
      minimumMissionsCompleted: 0
    },
    
    missions: [
      'social-media-basics',
      'spot-fake-profile',
      'fake-giveaway-detector',
      'spear-phishing-campaign',
      'fake-account-notification',
      'wire-transfer-trap',
      'perfect-impersonation'
    ],
    
    rewards: {
      experiencePoints: 75,
      scoreMultiplier: 1.1,
      specialAbilities: ['social_media_awareness']
    }
  },
  
  'financial-crimes': {
    id: 'financial-crimes',
    name: 'Financial Crimes',
    description: 'Investigate payment scams, fake banks, and crypto fraud',
    icon: '💰',
    color: 'from-green-600 to-green-700',
    
    unlockRequirements: {
      minimumLevel: 2,
      previousDepartment: 'social-media',
      minimumMissionsCompleted: 3
    },
    
    missions: [],
    
    rewards: {
      experiencePoints: 100,
      scoreMultiplier: 1.2,
      specialAbilities: ['financial_analysis']
    }
  },
  
  'elder-fraud': {
    id: 'elder-fraud',
    name: 'Elder Fraud Task Force',
    description: 'Specialized training for protecting vulnerable populations',
    icon: '👴',
    color: 'from-red-600 to-red-700',
    
    unlockRequirements: {
      minimumLevel: 3,
      previousDepartment: 'financial-crimes',
      minimumMissionsCompleted: 3
    },
    
    missions: [],
    
    rewards: {
      experiencePoints: 150,
      scoreMultiplier: 1.3,
      specialAbilities: ['elder_protection', 'empathy_boost']
    }
  }
};

// Get department information
export const getDepartment = (departmentId) => {
  return departments[departmentId] || null;
};

// Get all missions for a department
export const getDepartmentMissions = (departmentId) => {
  const department = departments[departmentId];
  if (!department) return [];
  
  return department.missions.map(missionId => missions[missionId]).filter(Boolean);
};

// Check if department is unlocked
export const isDepartmentUnlocked = (userProgress, departmentId) => {
  const department = departments[departmentId];
  if (!department) return false;
  
  const requirements = department.unlockRequirements;
  
  // Check level requirement
  if (userProgress.level < requirements.minimumLevel) {
    return false;
  }
  
  // Check previous department requirement
  if (requirements.previousDepartment && 
      userProgress.departmentProgress[requirements.previousDepartment]?.missionsSolved < requirements.minimumMissionsCompleted) {
    return false;
  }
  
  return true;
};

// Get available missions for user
export const getAvailableMissions = (userProgress) => {
  const availableMissions = [];
  
  Object.keys(departments).forEach(departmentId => {
    if (isDepartmentUnlocked(userProgress, departmentId)) {
      const departmentMissions = getDepartmentMissions(departmentId);
      availableMissions.push(...departmentMissions);
    }
  });
  
  return availableMissions;
}; 


