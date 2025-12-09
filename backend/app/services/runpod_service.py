import os
import requests
import time

# --- Load secrets from environment ---
# This safely gets the key from your local .env file or RunPod's secrets
RUNPOD_API_KEY = os.environ.get("RUNPOD_API_KEY") 
ENDPOINT_ID = "bi4ab0vshzvosz"
API_URL = f"https://api.runpod.ai/v2/{ENDPOINT_ID}"

def start_generation(prompt: str, duration: int) -> str:
    """Submits a job to the RunPod endpoint and returns the job ID."""
    if not RUNPOD_API_KEY:
        raise ValueError("RUNPOD_API_KEY not found in environment.")
    
    headers = { "Authorization": f"Bearer {RUNPOD_API_KEY}" }
    payload = { "input": { "prompt": prompt, "duration": duration } }
    
    response = requests.post(f"{API_URL}/run", headers=headers, json=payload)
    response.raise_for_status()
    
    return response.json()['id']

def check_generation_status(job_id: str) -> dict:
    """Checks the status of a job and returns the output if complete."""
    if not RUNPOD_API_KEY:
        raise ValueError("RUNPOD_API_KEY not found in environment.")
        
    headers = { "Authorization": f"Bearer {RUNPOD_API_KEY}" }
    response = requests.get(f"{API_URL}/status/{job_id}", headers=headers)
    response.raise_for_status()
    
    return response.json()
