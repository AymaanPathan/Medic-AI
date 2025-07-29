import resend

def generateEmailParams(email:str):

    params: resend.Emails.SendParams = {
        "from": "Acme <onboarding@resend.dev>",
        "to": [email],    
        "subject": otp,
        "html": "<strong>it works!</strong>",
    }
    return params