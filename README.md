# Capstone Project: IV Alarm System

This project is part of our **Senior Capstone Project** at the **University of Arkansas** (UARK) for the Fall 2024 - Spring 2025 academic year. The goal of this project is to assist nurses in identifying IV alarm signals in hospitals. By analyzing the pitch of IV alarms, we aim to automate the alerting process and enable faster responses to critical situations, improving patient care and hospital effciency.

Our system detects alarm sounds in real-time, categorizes them by pitch, and sends notifications to the nursing staff. The frontend web interface provides a user-friendly dashboard for nurses to monitor alarms and receive instant alerts, enhancing their ability to respond quickly.

## Technologies Used
This project is built using a combination of different languages and technologies:
- **Python**: Backend processing, alarm detection, and real-time audio analysis using libraries such as Librosa, SoundDevice, and Pydub.
- **JavaScript**: Frontend logic, including dynamic updates, interactions, and communications with the backend via Socket.IO.
- **React**: Building the user interface for easy interaction and notification display.
- **CSS**: Styling the frontend to ensure a clean and responsive design
- **HTML**: Structing the frontend content.

## Prerequisites
Ensure you have the following installed before setting up the project:
- Node.js (LTS version recommended)
- Python (3.x version recommended)
- Git

## Downloading the Project
To get started with the IV Alarm System, you'll need to download the project repository. You can do this by cloning the GitHub repository or downloading the ZIP file.

### **Clone the Repository:**
If you have Git installed, you can clone the repository using the following command:
```
git clone https://github.com/rmbreeli/IVAlarm_Capstone.git
```

### Download as ZIP:

Alternatively, you can download the project as a ZIP file by visiting the GitHub repository and clicking on the "Download ZIP" button. Once downloaded, unzip the file to your desired location.

After downloading the project, open two terminal windows and navigate to the project directory in both:
```
cd IVAlarm_Capstone
```

## Required Installations
Make sure to install the following libraries and tools before running the project:

### Backend Dependencies (Python)
To install the required pythons libraries for the backend:
1. Navigate to the `backend` folder:
```
cd backend
```
2. Install dependencies:
```
pip install sounddevice librosa numpy soundfile scipy pydub flask flask-socketio
```

### Frontend Dependencies
Follow these steps to set up and run frontend locally:
1. Navigate to the `frontend` foldere:
```
cd frontend
```
2. Install dependencies:
```
npm install
npm install react-router-dom socket.io-client web-vitals jspdf
```

## Supabase Setup
We use Supabase for authentication and database services. To configure Supabase:
1. Create a .env.local file inside the frontend directory
2. Add the following keys to you .env file:
```
REACT_APP_SUPABASE_URL='your_supabase-url'
REACT_APP_SUPABASE_ANON_KEY='your_supabase_anon_key'
```
Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supbase project credentials. These can be found under Settings > API.

## Running the Project
Follow these steps to run the project:

### Running the Backend
1. Ensure you are in the `backend` folder:
```
cd backend
```
2. Run the backend script:
```
python LiveDetectionWithWav.py
```

### Running the Frontend
1. Open a new terminal and ensure you are in `frontend` folder
```
cd frontend
```
2. Start the frontend server:
```
npm start
```
### Using the System
1. Open the frontend in your browser
2. Log in to the system
3. Play alarm sounds to test detection and notifications

### Contributors
| Name             | Role                  | GitHub Username    |
|------------------|-----------------------|--------------------|
| Rafael Balassiano | Frontend Development  | Rafaelbala223     |
| Kristen Babbitt  | Frontend Development  |  KristenBabbitt    |
| Cali Brewer      | Frontend Development  |  crb054            |
| Reese Breeling   | Backend Development   |  rmbreeli          |
| Joshua Workman   | Backend Development   |  josh-workman2     |

