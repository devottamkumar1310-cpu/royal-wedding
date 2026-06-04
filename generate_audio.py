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

# 1. Wax Crack (Short noise burst)
samples_crack = []
for i in range(44100 // 10): # 100ms
    env = math.exp(-i / (44100 // 40))
    samples_crack.append(random.uniform(-1, 1) * env)
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

# 3. Scratch Loop (Repeating noise bursts)
samples_scratch = []
for i in range(44100 // 2): # 500ms
    cycle = i % (44100 // 10)
    env = math.exp(-cycle / (44100 // 50))
    samples_scratch.append(random.uniform(-1, 1) * env * 0.3)
write_wav("public/audio/scratch-loop.wav", samples_scratch)

# 4. Chime (Two sine waves with long decay)
samples_chime = []
for i in range(44100 * 2): # 2 seconds
    env = math.exp(-i / (44100 // 2))
    s1 = math.sin(2 * math.pi * 1200 * i / 44100)
    s2 = math.sin(2 * math.pi * 1500 * i / 44100)
    samples_chime.append((s1 + s2) * 0.5 * env)
write_wav("public/audio/chime.wav", samples_chime)
