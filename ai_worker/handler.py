import runpod
from model import AudioEngine
import os

# Initialize globally for Warm Starts (Caches model in VRAM)
engine = AudioEngine()

def handler(job):
    """
    RunPod Handler
    Input Payload: {"input": {"prompt": "lofi beat", "duration": 15}}
    """
    job_input = job["input"]
    
    prompt = job_input.get("prompt", "lofi hip hop beat")
    duration = job_input.get("duration", 10)
    
    # Cap duration to save credits/time during tests
    duration = min(duration, 30) 

    try:
        result = engine.generate(prompt, duration)
        return result
    except Exception as e:
        return {"error": str(e)}

# Start the Serverless Worker
runpod.serverless.start({"handler": handler})
