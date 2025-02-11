# import librosa
# import numpy as np
# import os
# from flask import Flask, jsonify
# from flask_cors import CORS


# app = Flask(__name__)
# CORS(app)

# # Define the target beep frequencies (in Hz)
# beep_frequencies = {
#     "LOW BEEP": 3000, 
#     "MEDIUM BEEP": 3250, 
#     "HIGH BEEP": 3550   
# }

# # Load the MP3 file
# def load_audio(file_path):
#     y, sr = librosa.load(file_path, sr=None)  # y: audio time series, sr: sample rate
#     return y, sr

# # Detect the predominant frequency
# def detect_pitch(y, sr):
#     pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
#     pitch_list = []
    
#     for frame in range(pitches.shape[1]):
#         pitch = pitches[:, frame]
#         max_idx = pitch.argmax()  # Find the strongest pitch in the frame
#         if magnitudes[max_idx, frame] > 0:  # Only consider non-zero magnitudes
#             pitch_list.append(pitches[max_idx, frame])
    
#     # Compute the median pitch to reduce noise
#     median_pitch = np.median(pitch_list)
#     return median_pitch

# # Classify the beep
# def classify_beep(detected_pitch, beep_frequencies, tolerance=50):
#     for beep, freq in beep_frequencies.items():
#         if abs(detected_pitch - freq) <= tolerance:
#             return beep
#     return "Unknown beep"



# # API Endpoint: Process MP3 files in the "alarm_sounds" folder
# @app.route('/api/get-alarms', methods=['GET'])
# def get_alarms():
#     folder_path = "IVAlarm_Capstone/alarm_sounds"
#     if not os.path.exists(folder_path):
#         return jsonify({"error": "Alarm sounds folder not found!"}), 404

#     alarm_data = []
#     for file_name in os.listdir(folder_path):
#         if file_name.endswith(".mp3"):
#             file_path = os.path.join(folder_path, file_name)
#             y, sr = load_audio(file_path)
#             detected_pitch = detect_pitch(y, sr)
#             beep_class = classify_beep(detected_pitch, beep_frequencies)

#             alarm_data.append({
#                 "file_name": file_name,
#                 "detected_pitch": float(detected_pitch),  # Convert to standard float
#                 "beep_class": beep_class
#             })

#     print("Sending Data to Frontend:", alarm_data)  # Print data in terminal

#     return jsonify(alarm_data)



# # Run the app
# if __name__ == '__main__':
#     app.run(debug=True)



# # # Main function
# # def main(file_path):
# #     print("Loading audio...")
# #     y, sr = load_audio(file_path)
    
# #     print("Detecting pitch...")
# #     detected_pitch = detect_pitch(y, sr)
# #     print(f"Detected pitch: {detected_pitch:.2f} Hz")
    
# #     print("Classifying beep...")
# #     beep_class = classify_beep(detected_pitch, beep_frequencies)
# #     print(f"Beep classified as: {beep_class}")

# # # Example usage
# # filePathLowAlarm = r"IVAlarm_Capstone\alarm_sounds\low_priority_alarm_cleaned.mp3"
# # filePathHighAlarm = r"IVAlarm_Capstone\alarm_sounds\high_priority_alarm_cleaned.mp3"

# # if not os.path.exists(filePathLowAlarm):
# #     print("File not found:", filePathLowAlarm)
# # else:
# #     print("File found:", filePathLowAlarm)
# #     main(filePathLowAlarm)

# # if not os.path.exists(filePathHighAlarm):
# #     print("File not found:", filePathHighAlarm)
# # else:
# #     print("File found:", filePathHighAlarm)
# #     main(filePathHighAlarm)



##################################
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
