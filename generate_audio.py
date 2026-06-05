import wave
import struct
import math
import random
import os

os.makedirs("public/audio", exist_ok=True)

def write_wav(filename, samples, sample_rate=44100):
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        for s in samples:
            # clip
            s = max(-32767, min(32767, int(s * 32767)))
            wav_file.writeframes(struct.pack('h', s))

# 1. Wax Crack / Premium Key/Seal Click (crisp physical click with subtle high-frequency resonance)
samples_crack = []
duration_crack = int(44100 * 0.045) # 45ms click
for i in range(duration_crack):
    t = i / 44100
    # Shorter exponential decay envelope
    env = math.exp(-i / (44100 * 0.008))
    # Crisp high frequency noise
    noise = random.uniform(-1, 1) * 0.25
    # High-frequency metallic/seal tap resonance tones
    tone = (math.sin(2 * math.pi * 3500 * t) * 0.6 + 
            math.sin(2 * math.pi * 5000 * t) * 0.4)
    samples_crack.append((noise + tone) * env)
write_wav("public/audio/wax-crack.wav", samples_crack)

# 2. Paper Unfold (Slower noise with some lowpass feel)
samples_paper = []
prev = 0
for i in range(44100 // 2): # 500ms
    env = math.sin(i / (44100 // 2) * math.pi)
    noise = random.uniform(-1, 1)
    val = prev * 0.8 + noise * 0.2
    prev = val
    samples_paper.append(val * env * 0.5)
write_wav("public/audio/paper-unfold.wav", samples_paper)

# 3. Scratch Loop (Refined continuous foil/card scratching friction)
samples_scratch = []
duration_scratch = 44100 # 1.0 second loop
prev_lp = 0
prev_hp = 0
for i in range(duration_scratch):
    t = i / 44100
    # Gentle organic pressure modulation using low frequency sines
    mod = 0.75 + 0.25 * math.sin(2 * math.pi * 6 * t) * math.cos(2 * math.pi * 11 * t)
    
    # White noise source
    noise = random.uniform(-1, 1)
    
    # Low-pass filter for card body scraping friction
    lp = prev_lp * 0.85 + noise * 0.15
    prev_lp = lp
    
    # High-pass filter for foil crispness
    hp_raw = noise - (prev_hp * 0.95 + noise * 0.05)
    prev_hp = prev_hp * 0.95 + noise * 0.05
    
    # Combine low-pass and high-pass friction, modulate, and scale down to be subtle
    val = (lp * 0.3 + hp_raw * 0.7) * mod * 0.12
    samples_scratch.append(val)
write_wav("public/audio/scratch-loop.wav", samples_scratch)

# 4. Chime (Two sine waves with long decay)
samples_chime = []
for i in range(44100 * 2): # 2 seconds
    env = math.exp(-i / (44100 // 2))
    s1 = math.sin(2 * math.pi * 1200 * i / 44100)
    s2 = math.sin(2 * math.pi * 1500 * i / 44100)
    samples_chime.append((s1 + s2) * 0.5 * env)
write_wav("public/audio/chime.wav", samples_chime)
