#fyi, i had to remove my api keys, we'd have to replace them with company ones and also it would invalidate if i post on github
'''
This is Ascend, your AI pocket Secetary that can handle all your mondane office secteray work while you are away
1. Make cold phone calls to clients and converse + get info on that
2. Receive phone calls whule you are away and get all the details you need so you dont miss out on golden opportunities for your company

'''
# outbound calls
'''
give a table list of phone numbers to call -> | name | number | context? |
verify number? -> security
eleven labs make call via twillio account
'''

# let us make one call from the client first 
import os
import requests
from dotenv import load_dotenv, find_dotenv

def start_voice_agent_call(to_number: str, start_message: str) -> dict:
    """
    Trigger an outbound call handled by your ElevenLabs Agent (already set up with Twilio).
    - to_number: E.164 phone number to call (e.g., +14155550101)
    - start_message: the opener your agent should use for this specific call

    Required environment variables:
      ELEVENLABS_API_KEY      -> your xi-api-key
      ELEVENLABS_AGENT_ID     -> the agent's ID
      ELEVENLABS_PHONE_ID     -> the Twilio-linked phone_number_id for that agent
      ELEVENLABS_BASE_URL     -> optional (defaults to https://api.elevenlabs.io)

    Returns: dict with keys like { success, message, conversation_id, callSid } on success,
             or { success: False, status_code, error } on failure.
    """
    # base_url = os.getenv("ELEVENLABS_BASE_URL", "https://api.elevenlabs.io")
    # api_key  = os.environ["ELEVENLABS_API_KEY"]
    # agent_id = os.environ["ELEVENLABS_AGENT_ID"]
    # phone_id = os.environ["ELEVENLABS_PHONE_ID"]

    url = "https://api.elevenlabs.io/v1/convai/twilio/outbound-call"
    headers = {
        "xi-api-key": sectret_key,
        "content-type": "application/json",
    }
    payload = {
        "agent_id": agen_id,
        "agent_phone_number_id": "+1 866 412 4315",
        "to_number": to_number,
        # This passes your per-call start message to the agent
        "conversation_initiation_client_data": {
            "start_message": start_message
        }
    }

    try:
        r = requests.post(url, headers=headers, json=payload, timeout=30)
        # Standard success body: {"success": true, "message": "...", "conversation_id": "...", "callSid": "..."}
        if r.ok:
            return r.json()
        return {"success": False, "status_code": r.status_code, "error": r.text}
    except requests.RequestException as e:
        return {"success": False, "error": str(e)}

def main():
    start_voice_agent_call("+1 669 350 8443", "Hello, this is Ascend")

if __name__ == "__main__":
    main()

# inbound calls
'''

'''
