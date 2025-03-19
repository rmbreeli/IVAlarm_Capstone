import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav
import os
import time
from flask import Flask
from flask import send_file
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

# Constants
DURATION = 6  # Recording duration in seconds
SAMPLE_RATE = 44100  # Standard audio sample rate
THRESHOLD_DB = 0  # Noise gate threshold (in dB)
TOLERANCE = 25  # Frequency tolerance for classification
FILENAME = "temp_recording.wav"

# Beep Frequency Mapping
BEEP_FREQUENCIES = {
    "LOW BEEP": 2000,
    "MEDIUM BEEP": 2100,
    "HIGH BEEP": 2200
}

# Create a new report file with timestamp
# report_filename = f"beep_report_{time.strftime('%Y%m%d_%H%M%S')}.txt"
report_filename = "daily_beep_report.txt"

@app.route('/get_report', methods=['GET'])
def get_report():
    try:
        # Use the current directory (where livedetection.py is located)
        report_path = os.path.join(os.getcwd(), report_filename)
        
        if not os.path.exists(report_path):
            return "Report file not found", 404
        
        return send_file(report_path, as_attachment=True)
    except Exception as e:
        return str(e), 500


def write_to_report(data):
    """Writes beep data to the report file in the backend folder."""
    report_path = os.path.join(os.getcwd(), report_filename)  # Get the full path for the report file
    
    try:
        with open(report_path, "a") as file:  # Open the file in append mode
            file.write(data + "\n")  # Append data to the file
        print("Report entry saved.")
    except Exception as e:
        print(f"Error writing to report: {e}")


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

    # Determine beep type
    beep_type = "Unknown"
    for label, freq in BEEP_FREQUENCIES.items():
        if abs(highest_pitch - freq) <= TOLERANCE:
            beep_type = label
            break

    # Calculate volume (normalized amplitude)
    volume = np.max(np.abs(data))

    print(f"🎵 Highest Pitch Detected: {highest_pitch:.2f} Hz")

    if beep_type != "Unknown":
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        report_entry = f"[{timestamp}] Pitch: {highest_pitch:.2f} Hz, Type: {beep_type}, Volume: {volume:.2f}"
        write_to_report(report_entry)

    # Emit data to frontend
    socketio.emit("beep_detected", {
        "pitch": float(highest_pitch),
        "type": beep_type,
        "volume": float(volume)
    })

def cleanup():
    """Deletes the temporary audio file."""
    if os.path.exists(FILENAME):
        os.remove(FILENAME)
        print("🗑️ Deleted old recording.")

def run_detection():
    """Continuously records, analyzes, and cleans up audio."""
    while True:
        record_audio()
        analyze_audio()
        cleanup()
        time.sleep(1)  # Small delay before the next recording


# Start the Flask server
if __name__ == "__main__":
    # Clear the report file at startup
    if os.path.exists(report_filename):
        os.remove(report_filename)
        print(f"🗑️ Deleted old report file: {report_filename}")
    print("🚀 Starting Flask backend...")
    socketio.start_background_task(run_detection)
    socketio.run(app, debug=False, port=5000)