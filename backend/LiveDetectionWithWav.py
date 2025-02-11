import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav
import os
import time

# Constants
DURATION = 6  # Recording duration in seconds
SAMPLE_RATE = 44100  # Standard audio sample rate
THRESHOLD_DB = 0  # Noise gate threshold (in dB)
FILENAME = "temp_recording.wav"

def record_audio():
    """Records audio from the microphone and saves it as a WAV file."""
    print("🎤 Recording...")
    audio_data = sd.rec(int(DURATION * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=1, dtype=np.float32)
    sd.wait()  # Wait until recording is finished
    wav.write(FILENAME, SAMPLE_RATE, audio_data)
    print("✅ Recording saved.")

def analyze_audio():
    """Extracts the highest pitch from the recorded audio while filtering background noise."""
    sample_rate, data = wav.read(FILENAME)

    # Convert stereo to mono if needed
    if len(data.shape) > 1:
        data = data[:, 0]

    # Apply FFT to get frequency components
    fft_spectrum = np.fft.rfft(data)
    frequencies = np.fft.rfftfreq(len(data), d=1/sample_rate)
    
    # Convert amplitude to decibels and apply a noise gate
    magnitude = np.abs(fft_spectrum)
    magnitude_db = 20 * np.log10(magnitude + 1e-10)  # Avoid log(0) issues
    magnitude[magnitude_db < THRESHOLD_DB] = 0  # Remove background noise

    # Find the highest frequency with significant energy
    max_index = np.argmax(magnitude)
    highest_pitch = frequencies[max_index]

    print(f"🎵 Highest Pitch Detected: {highest_pitch:.2f} Hz")

def cleanup():
    """Deletes the temporary audio file."""
    if os.path.exists(FILENAME):
        os.remove(FILENAME)
        print("🗑️ Deleted old recording.")

# Run continuously
while True:
    record_audio()
    analyze_audio()
    cleanup()
    time.sleep(1)  # Small delay before the next recording
