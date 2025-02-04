import librosa
import numpy as np
import os
from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Define the target beep frequencies (in Hz)
beep_frequencies = {
    "LOW BEEP": 3000, 
    "MEDIUM BEEP": 3250, 
    "HIGH BEEP": 3550   
}

# Load the MP3 file
def load_audio(file_path):
    y, sr = librosa.load(file_path, sr=None)  # y: audio time series, sr: sample rate
    return y, sr

# Detect the predominant frequency
def detect_pitch(y, sr):
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    pitch_list = []
    
    for frame in range(pitches.shape[1]):
        pitch = pitches[:, frame]
        max_idx = pitch.argmax()  # Find the strongest pitch in the frame
        if magnitudes[max_idx, frame] > 0:  # Only consider non-zero magnitudes
            pitch_list.append(pitches[max_idx, frame])
    
    # Compute the median pitch to reduce noise
    median_pitch = np.median(pitch_list)
    return median_pitch

# Classify the beep
def classify_beep(detected_pitch, beep_frequencies, tolerance=50):
    for beep, freq in beep_frequencies.items():
        if abs(detected_pitch - freq) <= tolerance:
            return beep
    return "Unknown beep"



# API Endpoint: Process MP3 files in the "alarm_sounds" folder
@app.route('/api/get-alarms', methods=['GET'])
def get_alarms():
    folder_path = "IVAlarm_Capstone/alarm_sounds"
    if not os.path.exists(folder_path):
        return jsonify({"error": "Alarm sounds folder not found!"}), 404

    alarm_data = []
    for file_name in os.listdir(folder_path):
        if file_name.endswith(".mp3"):
            file_path = os.path.join(folder_path, file_name)
            y, sr = load_audio(file_path)
            detected_pitch = detect_pitch(y, sr)
            beep_class = classify_beep(detected_pitch, beep_frequencies)

            alarm_data.append({
                "file_name": file_name,
                "detected_pitch": float(detected_pitch),  # Convert to standard float
                "beep_class": beep_class
            })

    print("Sending Data to Frontend:", alarm_data)  # Print data in terminal

    return jsonify(alarm_data)



# Run the app
if __name__ == '__main__':
    app.run(debug=True)



# # Main function
# def main(file_path):
#     print("Loading audio...")
#     y, sr = load_audio(file_path)
    
#     print("Detecting pitch...")
#     detected_pitch = detect_pitch(y, sr)
#     print(f"Detected pitch: {detected_pitch:.2f} Hz")
    
#     print("Classifying beep...")
#     beep_class = classify_beep(detected_pitch, beep_frequencies)
#     print(f"Beep classified as: {beep_class}")

# # Example usage
# filePathLowAlarm = r"IVAlarm_Capstone\alarm_sounds\low_priority_alarm_cleaned.mp3"
# filePathHighAlarm = r"IVAlarm_Capstone\alarm_sounds\high_priority_alarm_cleaned.mp3"

# if not os.path.exists(filePathLowAlarm):
#     print("File not found:", filePathLowAlarm)
# else:
#     print("File found:", filePathLowAlarm)
#     main(filePathLowAlarm)

# if not os.path.exists(filePathHighAlarm):
#     print("File not found:", filePathHighAlarm)
# else:
#     print("File found:", filePathHighAlarm)
#     main(filePathHighAlarm)