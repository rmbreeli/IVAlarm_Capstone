import numpy as np
import sounddevice as sd


#Simple program to create frequencies if we need them for testing


fs = 44100  # Sample rate
duration = 2  
frequency = 2200  

t = np.linspace(0, duration, int(fs * duration), endpoint=False)
wave = 0.5 * np.sin(2 * np.pi * frequency * t)

print("Playing 2000 Hz tone...")
sd.play(wave, samplerate=fs)
sd.wait()
print("Done.")
