import wave
import struct
import math
import random
import os

# Ensure audio directory exists
os.makedirs("public/audio", exist_ok=True)

SAMPLE_RATE = 44100

def write_wav(filename, samples):
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(SAMPLE_RATE)
        for s in samples:
            s = max(-32767, min(32767, int(s * 32767)))
            wav_file.writeframes(struct.pack('h', s))

# Frequencies of notes in a beautiful Raga (Yaman / Bilawal scale)
NOTES = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F#4': 369.99, 'G4': 392.00, 
    'A4': 440.00, 'B4': 493.88, 'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 
    'F#5': 739.99, 'G5': 783.99, 'A5': 880.00, 'REST': 0
}

# 1. Santoor Synthesizer (Bright, metallic plucked string using Karplus-Strong string synthesis + delay)
def generate_santoor():
    print("Synthesizing Santoor melody...")
    # Melody pattern: (Note, duration in seconds)
    melody = [
        ('C4', 0.4), ('E4', 0.4), ('G4', 0.4), ('B4', 0.4),
        ('C5', 0.8), ('B4', 0.4), ('A4', 0.4), ('G4', 0.8),
        ('F#4', 0.4), ('A4', 0.4), ('C5', 0.4), ('D5', 0.4),
        ('E5', 0.8), ('D5', 0.4), ('C5', 0.4), ('B4', 0.8),
        ('G4', 0.4), ('B4', 0.4), ('D5', 0.4), ('F#5', 0.4),
        ('G5', 1.2), ('REST', 0.4)
    ]
    
    total_seconds = sum(item[1] for item in melody)
    total_samples = int(SAMPLE_RATE * total_seconds)
    output = [0.0] * total_samples
    
    current_sample = 0
    for note, dur_sec in melody:
        dur_samples = int(SAMPLE_RATE * dur_sec)
        freq = NOTES[note]
        
        if freq > 0:
            # Karplus-Strong algorithm
            N = int(SAMPLE_RATE / freq)
            # Fill buffer with white noise for the pluck
            ring_buf = [random.uniform(-1, 1) for _ in range(N)]
            
            # Synthesize pluck
            pluck_samples = []
            prev_val = 0
            for i in range(dur_samples):
                val = ring_buf[i % N]
                next_idx = (i + 1) % N
                # Damping factor + average filter to simulate string decay
                new_val = 0.994 * 0.5 * (val + ring_buf[next_idx])
                ring_buf[i % N] = new_val
                
                # Add a sharp attack envelope
                env = math.exp(-i / (SAMPLE_RATE * 0.4))
                # Add brightness (metallic ring)
                ring = val * env
                pluck_samples.append(ring)
                
            # Paste into output buffer
            for i in range(dur_samples):
                if current_sample + i < total_samples:
                    output[current_sample + i] += pluck_samples[i] * 0.35
                    
        current_sample += dur_samples
        
    # Apply soft stereo-delay echo effect (mono-mix) to make it feel spacious and luxurious
    delay_samples = int(SAMPLE_RATE * 0.28) # 280ms delay
    decay = 0.4
    final_output = list(output)
    for i in range(delay_samples, total_samples):
        final_output[i] += output[i - delay_samples] * decay
        
    # Master volume normalization
    max_val = max(abs(x) for x in final_output) if final_output else 1
    if max_val > 0:
        final_output = [x / max_val * 0.7 for x in final_output]
        
    write_wav("public/audio/santoor.wav", final_output)
    print("Santoor written successfully!")

# 2. Flute Synthesizer (Pure sine wave, slow attack/decay, vibrato, and breathy wind noise)
def generate_flute():
    print("Synthesizing Flute melody...")
    # Romantic classical flute melody
    melody = [
        ('E4', 0.8), ('G4', 0.8), ('A4', 0.8), ('B4', 1.2),
        ('A4', 0.4), ('B4', 0.4), ('C5', 0.8), ('B4', 1.6),
        ('D5', 0.8), ('B4', 0.8), ('G4', 0.8), ('A4', 1.2),
        ('G4', 0.4), ('F#4', 0.4), ('E4', 0.8), ('D4', 1.6),
        ('G4', 0.8), ('A4', 0.8), ('B4', 0.8), ('D5', 1.2),
        ('E5', 1.6), ('REST', 0.8)
    ]
    
    total_seconds = sum(item[1] for item in melody)
    total_samples = int(SAMPLE_RATE * total_seconds)
    output = []
    
    current_time = 0.0
    for note, dur_sec in melody:
        dur_samples = int(SAMPLE_RATE * dur_sec)
        freq = NOTES[note]
        
        for i in range(dur_samples):
            t = i / SAMPLE_RATE
            if freq == 0:
                output.append(0.0)
                continue
                
            # Slow attack and decay envelope
            attack = SAMPLE_RATE * 0.15
            decay = SAMPLE_RATE * 0.2
            if i < attack:
                env = i / attack
            elif i > dur_samples - decay:
                env = (dur_samples - i) / decay
            else:
                env = 1.0
                
            # Add beautiful classical vibrato (FM synthesis at 5.5 Hz)
            vib_freq = 5.5
            vib_depth = 4.0 # Hz
            vibrato = math.sin(2 * math.pi * vib_freq * t) * vib_depth
            
            # Tone generation
            val = math.sin(2 * math.pi * (freq + vibrato) * t)
            # Add a second harmonic for warm woody tone
            val += 0.15 * math.sin(4 * math.pi * (freq + vibrato) * t)
            
            # Breath noise (high-pass noise)
            breath = random.uniform(-1, 1) * 0.015
            
            output.append((val + breath) * env * 0.28)
            
    # Apply reverb / delay trail
    delay_samples = int(SAMPLE_RATE * 0.35)
    final_output = list(output)
    for i in range(delay_samples, len(output)):
        final_output[i] += output[i - delay_samples] * 0.3
        
    max_val = max(abs(x) for x in final_output) if final_output else 1
    if max_val > 0:
        final_output = [x / max_val * 0.6 for x in final_output]
        
    write_wav("public/audio/flute.wav", final_output)
    print("Flute written successfully!")

# 3. Shehnai Synthesizer (Triangle wave with high odd harmonics, pitch-bending, and nasal resonance filter)
def generate_shehnai():
    print("Synthesizing Shehnai melody...")
    # Festive, soulful shehnai wedding melody (slides between notes)
    melody = [
        ('D4', 0.8), ('G4', 0.8), ('A4', 0.8), ('B4', 1.2),
        ('C5', 0.4), ('B4', 0.8), ('A4', 0.8), ('G4', 1.6),
        ('B4', 0.8), ('D5', 0.8), ('E5', 0.8), ('D5', 1.2),
        ('C5', 0.4), ('B4', 0.8), ('A4', 0.8), ('G4', 1.6),
        ('REST', 0.8)
    ]
    
    total_seconds = sum(item[1] for item in melody)
    total_samples = int(SAMPLE_RATE * total_seconds)
    output = []
    
    # Track current frequency for pitch sliding (portamento)
    prev_freq = NOTES[melody[0][0]]
    
    for note_idx, (note, dur_sec) in enumerate(melody):
        dur_samples = int(SAMPLE_RATE * dur_sec)
        target_freq = NOTES[note]
        
        phase = 0.0
        for i in range(dur_samples):
            t = i / SAMPLE_RATE
            
            if target_freq == 0:
                output.append(0.0)
                continue
                
            # Slide (meend) from previous note to new note during the first 120ms
            slide_time = SAMPLE_RATE * 0.12
            if i < slide_time and prev_freq > 0:
                pct = i / slide_time
                freq = prev_freq + (target_freq - prev_freq) * pct
            else:
                freq = target_freq
                
            # Soulful pitch tremolo / vibrato (shehnai player lip modulation at 6 Hz)
            vib = 1.0 + 0.012 * math.sin(2 * math.pi * 6.0 * t)
            inst_freq = freq * vib
            
            # Triangle / Reed wave (nasal buzzer)
            # Summing odd harmonics to get a reed instrument timbre
            tone = math.sin(phase)
            tone += 0.6 * math.sin(3 * phase)
            tone += 0.3 * math.sin(5 * phase)
            tone += 0.15 * math.sin(7 * phase)
            
            # Advance phase
            phase += 2 * math.pi * inst_freq / SAMPLE_RATE
            
            # Envelope (sudden reed attack, slow decay)
            attack = SAMPLE_RATE * 0.08
            decay = SAMPLE_RATE * 0.15
            if i < attack:
                env = i / attack
            elif i > dur_samples - decay:
                env = (dur_samples - i) / decay
            else:
                env = 1.0
                
            output.append(tone * env * 0.12)
            
        if target_freq > 0:
            prev_freq = target_freq
            
    # Apply resonance / bandpass-like filter using simple lowpass/highpass mix
    # to simulate the shehnai wooden horn resonance
    filtered_output = []
    prev_lp = 0.0
    for x in output:
        # Simple low-pass filter to smooth harsh high harmonics
        lp = prev_lp * 0.8 + x * 0.2
        prev_lp = lp
        filtered_output.append(lp)
        
    max_val = max(abs(x) for x in filtered_output) if filtered_output else 1
    if max_val > 0:
        filtered_output = [x / max_val * 0.55 for x in filtered_output]
        
    write_wav("public/audio/shehnai.wav", filtered_output)
    print("Shehnai written successfully!")

if __name__ == "__main__":
    generate_santoor()
    generate_flute()
    generate_shehnai()
    print("All melodies generated successfully!")
