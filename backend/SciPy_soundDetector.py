import numpy as np
import scipy.io.wavfile as wav
import scipy.signal
import scipy.fftpack
import matplotlib.pyplot as plt
from pydub import AudioSegment
import os


# Convert MP3 to WAV
def convert_mp3_to_wav(mp3_path):
    audio = AudioSegment.from_mp3(mp3_path)
    wav_path = mp3_path.replace(".mp3", ".wav")
    audio.export(wav_path, format="wav")
    return wav_path

def analyze_audio(file_path):
    # Read audio file
    RATE, data = wav.read(file_path)
    
    # If stereo, convert to mono
    if len(data.shape) > 1:
        data = np.mean(data, axis=1)
    
    # Compute FFT to find max pitch
    fft_spectrum = np.abs(scipy.fftpack.fft(data))
    freqs = np.fft.fftfreq(len(data), 1.0 / RATE)
    
    # Only consider positive frequencies
    positive_freqs = freqs[:len(freqs) // 2]
    positive_spectrum = fft_spectrum[:len(fft_spectrum) // 2]
    
    max_idx = np.argmax(positive_spectrum)
    max_pitch = positive_freqs[max_idx]
    
    # Detect rhythm using envelope and peaks
    envelope = np.abs(scipy.signal.hilbert(data))
    peaks, _ = scipy.signal.find_peaks(envelope, height=np.max(envelope) * 0.5, distance=RATE * 0.2)
    
    # Convert peak locations to time in seconds
    peak_times = peaks / RATE
    
    # Output results
    print(f"Max Pitch: {max_pitch:.2f} Hz")
    print("Detected Rhythm (Peak times in seconds):", peak_times)
    
    # Plot waveform and detected peaks
    plt.figure(figsize=(10, 4))
    plt.plot(np.arange(len(data)) / RATE, data, label='Waveform')
    plt.plot(peak_times, envelope[peaks], 'ro', label='Peaks')
    plt.xlabel("Time (s)")
    plt.ylabel("Amplitude")
    plt.legend()
    plt.title("Audio Rhythm Analysis")
    plt.show()

    


if __name__ == "__main__":
    mp3_file_path = mp3_file_path = "C:\\Users\\jwork\\IVAlarm_Capstone\\alarm_sounds\\low_alarm.mp3"
    wav_file_path = convert_mp3_to_wav(mp3_file_path)
    analyze_audio(wav_file_path)
