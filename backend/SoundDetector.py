import numpy as np
import pyaudio
import librosa
import time
from flask import Flask, jsonify
from flask_socketio import SocketIO

# Flask app setup
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Define the target beep frequencies (Hz)
beep_frequencies = {
    "LOW BEEP": 3000, 
    "MEDIUM BEEP": 3250, 
    "HIGH BEEP": 3550   
}

# Noise gate settings
NOISE_THRESHOLD_DB = -8  # Set threshold for detecting beeps

# Audio stream setup
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100  # Sample rate
CHUNK = 1024  # Buffer size

# Initialize PyAudio
audio = pyaudio.PyAudio()

def detect_pitch(audio_chunk, sr):
    pitches, magnitudes = librosa.piptrack(y=audio_chunk, sr=sr)
    pitch_list = []

    for frame in range(pitches.shape[1]):
        pitch = pitches[:, frame]
        max_idx = pitch.argmax()
        if magnitudes[max_idx, frame] > 0:
            pitch_list.append(pitches[max_idx, frame])

    return np.median(pitch_list) if pitch_list else 0

def classify_beep(detected_pitch, beep_frequencies, tolerance=50):
    for beep, freq in beep_frequencies.items():
        if abs(detected_pitch - freq) <= tolerance:
            return beep
    return None

def process_audio_data(in_data):
    y = np.frombuffer(in_data, dtype=np.int16).astype(np.float32)
    y /= np.max(np.abs(y))  # Normalize

    # Compute volume (RMS)
    rms = np.sqrt(np.mean(y**2))
    db_level = 20 * np.log10(rms) if rms > 0 else -100  # Convert to dB

    # Noise gate: Ignore audio below threshold
    if db_level < NOISE_THRESHOLD_DB:
        return

    # Detect pitch
    detected_pitch = detect_pitch(y, RATE)
    beep_type = classify_beep(detected_pitch, beep_frequencies)

    if beep_type:
        print(f"Detected {beep_type} at {detected_pitch:.2f} Hz, {db_level:.2f} dB")
        # Convert numpy.float32 to native float
        socketio.emit("beep_detected", {
            "pitch": float(detected_pitch),  # Convert to native float
            "type": beep_type,
            "volume": float(db_level)       # Convert to native float
        })


def callback(in_data, frame_count, time_info, status):
    process_audio_data(in_data)
    return (in_data, pyaudio.paContinue)

# Start listening
def start_listening():
    stream = audio.open(format=FORMAT, channels=CHANNELS, rate=RATE,
                        input=True, frames_per_buffer=CHUNK,
                        stream_callback=callback)
    stream.start_stream()
    while stream.is_active():
        time.sleep(0.1)

# Flask endpoint (optional)
@app.route('/')
def index():
    return jsonify({"message": "Listening for beeps..."})

# Run Flask and WebSocket server
if __name__ == '__main__':
    socketio.start_background_task(start_listening)
    socketio.run(app, debug=True, port=5000)
