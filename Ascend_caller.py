import os
import time
import requests
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

XI_API_KEY  = # xi-...
AGENT_ID    = # agent_...
PHONE_ID    = # pn_... (NOT a phone number)
BASE_URL    = "https://api.elevenlabs.io"

HEADERS = {"xi-api-key": XI_API_KEY, "content-type": "application/json"}

def start_voice_agent_call(to_number: str, start_message: str) -> str:
    """
    Start an outbound call via ElevenLabs Twilio integration.
    Returns conversation_id (string) on success, or raises on error.
    """
    url = f"{BASE_URL}/v1/convai/twilio/outbound-call"
    payload = {
        "agent_id": AGENT_ID,
        "agent_phone_number_id": PHONE_ID,
        "to_number": to_number,
        "conversation_initiation_client_data": {"start_message": start_message}
    }
    r = requests.post(url, headers=HEADERS, json=payload, timeout=30)
    r.raise_for_status()
    data = r.json()
    if not data.get("success"):
        raise RuntimeError(f"Outbound call failed: {data}")
    return data.get("conversation_id")

def get_conversation_details(conversation_id: str) -> dict:
    """
    Fetch conversation status/details.
    status ∈ {'initiated','in-progress','processing','done','failed'}
    """
    url = f"{BASE_URL}/v1/convai/conversations/{conversation_id}"
    r = requests.get(url, headers=HEADERS, timeout=20)
    r.raise_for_status()
    return r.json()

def wait_until_done(conversation_id: str, max_wait=300, interval=5) -> dict:
    """
    Poll every `interval` seconds until status is 'done' or 'failed',
    or until `max_wait` seconds elapse. Returns the final conversation JSON.
    """
    elapsed = 0
    while elapsed < max_wait:
        conv = get_conversation_details(conversation_id)
        status = conv.get("status")
        print(f"[{conversation_id}] status: {status}")
        if status in ("done", "failed"):
            return conv
        time.sleep(interval)
        elapsed += interval
    raise TimeoutError(f"Timed out waiting for conversation {conversation_id}")

def print_final_info(conv: dict):
    """
    Print a brief summary once the call is done.
    """
    status = conv.get("status")
    meta   = conv.get("metadata", {}) or {}
    dur    = meta.get("call_duration_secs")
    started= meta.get("start_time_unix_secs")
    summary= conv.get("transcript_summary") or conv.get("analysis", {}) or {}

    print("\n=== CALL RESULT ===")
    print("Status:", status)
    if dur is not None: print("Duration (secs):", dur)
    if started is not None: print("Start (unix):", started)

    # Show last few transcript turns
    transcript = conv.get("transcript", []) or []
    tail = transcript[-6:]  # last few lines
    if tail:
        print("\nTranscript tail:")
        for turn in tail:
            role = turn.get("role")
            msg  = turn.get("message")
            tsec = turn.get("time_in_call_secs")
            print(f"  [{tsec:>4}s] {role}: {msg}")

    # If API provides a summary/analysis field, print it
    if summary:
        print("\nSummary/Analysis:")
        print(summary)

def main():
    # 1) start a call
    to_number = "+15593289806"      # must be E.164
    opener    = "Hello, this is Ascend. Do you have 30 seconds for a quick intro?"
    conv_id   = start_voice_agent_call(to_number, opener)

    # 2) wait for completion
    final_conv = wait_until_done(conv_id, max_wait=600, interval=5)

    # 3) print details
    print_final_info(final_conv)

if __name__ == "__main__":
    if not XI_API_KEY or not AGENT_ID or not PHONE_ID:
        raise SystemExit("Missing env vars. Check ELEVENLABS_API_KEY / ELEVENLABS_AGENT_ID / ELEVENLABS_PHONE_ID")
    main()
