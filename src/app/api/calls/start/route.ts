import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumbers, startMessage } = await request.json();
    
    if (!phoneNumbers || !startMessage) {
      return NextResponse.json(
        { error: 'Phone numbers and start message are required' },
        { status: 400 }
      );
    }

    // Parse phone numbers from the textarea input
    const numbers = phoneNumbers
      .split('\n')
      .map((num: string) => num.trim())
      .filter((num: string) => num.length > 0);

    if (numbers.length === 0) {
      return NextResponse.json(
        { error: 'At least one phone number is required' },
        { status: 400 }
      );
    }

    // Create a temporary script that calls your Python script with the parameters
    const pythonScript = `
import sys
import json
import os
import time
import requests
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

XI_API_KEY = "sk_386fa603c3974b4a0c087c34189a4259e2f931fa295be782"
AGENT_ID = "agent_1501k6j0msvzf9583gyrr43s75eb"
PHONE_ID = "phnum_4601k7p4xvxkf4csxyd2n59a7bf2"
BASE_URL = "https://api.elevenlabs.io"
HEADERS = {"xi-api-key": XI_API_KEY, "content-type": "application/json"}

def start_voice_agent_call(to_number, start_message):
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

def get_conversation_details(conversation_id):
    url = f"{BASE_URL}/v1/convai/conversations/{conversation_id}"
    r = requests.get(url, headers=HEADERS, timeout=20)
    r.raise_for_status()
    return r.json()

def wait_until_done(conversation_id, max_wait=300, interval=5):
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

def call_multiple_numbers(numbers, start_message):
    results = []
    for i, num in enumerate(numbers, start=1):
        print(f"\\n=== [{i}/{len(numbers)}] Calling {num} ===")
        try:
            conv_id = start_voice_agent_call(num, start_message)
            print(f"Conversation ID: {conv_id}")
            
            # Wait for call completion
            result = wait_until_done(conv_id, max_wait=600, interval=5)
            
            # Extract key information
            call_result = {
                "number": num,
                "conversation_id": conv_id,
                "status": result.get("status"),
                "duration": result.get("metadata", {}).get("call_duration_secs"),
                "transcript": result.get("transcript", []),
                "summary": result.get("transcript_summary") or result.get("analysis", {}),
                "success": result.get("status") == "done"
            }
            results.append(call_result)
            
        except Exception as e:
            print(f"Error calling {num}: {e}")
            results.append({
                "number": num,
                "status": "failed",
                "error": str(e),
                "success": False
            })
        
        # Wait 1 minute between calls
        if i < len(numbers):
            print("\\nWaiting 1 minute before next call...\\n")
            time.sleep(15)
    
    return results

# Get parameters from command line
data = json.loads(sys.argv[1])
phone_numbers = data['phoneNumbers']
start_message = data['startMessage']

# Start calling
results = call_multiple_numbers(phone_numbers, start_message)
print(json.dumps(results))
`;

    // Write the script to a temporary file
    const scriptPath = path.join(process.cwd(), 'temp_call_script.py');
    require('fs').writeFileSync(scriptPath, pythonScript);

    return new Promise<NextResponse>((resolve) => {
      const pythonProcess = spawn('python', [scriptPath, JSON.stringify({ phoneNumbers: numbers, startMessage })]);
      
      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', (code) => {
        // Clean up the temporary file
        try {
          require('fs').unlinkSync(scriptPath);
        } catch (e) {
          console.error('Failed to delete temporary script:', e);
        }

        if (code === 0) {
          try {
            // Parse the JSON output from Python
            const lines = output.split('\n');
            const jsonLine = lines.find(line => line.trim().startsWith('[') || line.trim().startsWith('{'));
            const results = jsonLine ? JSON.parse(jsonLine) : [];
            
            resolve(NextResponse.json({ 
              success: true, 
              results,
              message: `Successfully processed ${numbers.length} calls`
            }));
          } catch (parseError) {
            resolve(NextResponse.json({ 
              success: false, 
              error: 'Failed to parse results',
              output: output,
              errorOutput: errorOutput
            }, { status: 500 }));
          }
        } else {
          resolve(NextResponse.json({ 
            success: false, 
            error: 'Call process failed',
            output: output,
            errorOutput: errorOutput
          }, { status: 500 }));
        }
      });

      pythonProcess.on('error', (error) => {
        resolve(NextResponse.json({ 
          success: false, 
          error: `Failed to start Python process: ${error.message}` 
        }, { status: 500 }));
      });
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
