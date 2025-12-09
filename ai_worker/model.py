import torch
import torchaudio
from transformers import AutoProcessor, MusicgenForConditionalGeneration
import numpy as np
import base64
import io
import scipy.io.wavfile

class AudioEngine:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"🎵 Initializing Audio Engine on {self.device}...")
        
        # Load Model (MusicGen Small - Faster, fits on cheaper GPUs)
        # Use 'facebook/musicgen-medium' or 'large' for better quality if you have >16GB VRAM
        self.model_id = "facebook/musicgen-small"
        
        self.processor = AutoProcessor.from_pretrained(self.model_id)
        self.model = MusicgenForConditionalGeneration.from_pretrained(self.model_id).to(self.device)
        print("✅ Model Loaded Successfully")

    def generate(self, prompt, duration):
        print(f"🎹 Generating: '{prompt}' ({duration}s)")
        
        # Prepare inputs
        inputs = self.processor(
            text=[prompt],
            padding=True,
            return_tensors="pt",
        ).to(self.device)

        # Generate Audio
        # 256 tokens ~ 5 seconds. Logic: 50 tokens per sec roughly (approximate)
        # MusicGen logic: 1500 tokens is roughly 30s. 
        max_new_tokens = int(duration * 50) 

        audio_values = self.model.generate(
            **inputs, 
            max_new_tokens=max_new_tokens
        )

        # Convert to WAV bytes
        sampling_rate = self.model.config.audio_encoder.sampling_rate
        audio_data = audio_values[0, 0].cpu().numpy()
        
        # Create in-memory file
        byte_io = io.BytesIO()
        scipy.io.wavfile.write(byte_io, rate=sampling_rate, data=audio_data)
        wav_bytes = byte_io.getvalue()

        # Encode to Base64 to send back over API
        audio_base64 = base64.b64encode(wav_bytes).decode('utf-8')
        
        return {
            "status": "success",
            "audio_base64": audio_base64,
            "duration": duration
        }
