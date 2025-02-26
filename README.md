# Capstone Project: IV Alarm System

This project is part of our **Senior Capstone Project** at the **University of Arkansas** (UARK) for the Fall 2024 - Spring 2025 academic year. The goal of this project is to assist nurses in identifying IV alarm signals in hospitals. By analyzing the pitch of IV alarms, we aim to automate the alerting process and enable faster responses to critical situations, improving patient care and hospital effciency.

Our system detects alarm sounds in real-time, categorizes them by pitch, and sends notifications to the nursing staff. The frontend web interface provides a user-friendly dashboard for nurses to monitor alarms and receive instant alerts, enhancing their ability to respond quickly.

## Technologies Used
This project is built using a combination of different languages and technologies:
- **Python**: Backend processing, alarm detection, and real-time audio analysis using libraries such as Librosa, SoundDevice, and Pydub.
- **JavaScript**: Frontend logic, including dynamic upadtes, interactions, and communications with the backend via Socket.IO.
- **React**: Building the user interface for easy interaction and notification display.
- **CSS**: Styling the frontend to ensure a clean and responsive design
- **HTML**: Structing the frontend content.

## Required Installations
Before running the project, ensure you have the following libraries and tools installed:

### Backend Dependencies (Python)
To install the required pythons libraries for the backend:
1. Navigate to the `backend` folder:
   

Languages Used:
Python (backend)
React? (frontend)

Required Installations:

SoundDevice, Librosa, Numpy, Soundfile, Scipy, Pydub, Flask
    pip install sounddevice librosa numpy soundfile scipy pydub flask
    pip install flask-socketio
    npm install socket.io-client web-vitals
    npm install jspdf - pdf download (frontend)


Instructions:
    Run/python LiveDetectionWithWav.py on a single terminal in backend folder
    Run frontend using "npm start" in frontend folder
    Login
    Play alarms!
