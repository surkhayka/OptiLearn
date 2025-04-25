import cv2
import numpy as np
import warnings
import face_recognition
from scipy.spatial import distance
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

warnings.filterwarnings("ignore")

concentration = []

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

def eye_aspect_ratio(eye):
    A = distance.euclidean(eye[1], eye[5])
    B = distance.euclidean(eye[2], eye[4])
    C = distance.euclidean(eye[0], eye[3])
    ear = (A + B) / (2.0 * C)
    return ear

def mouth_aspect_ratio(mouth):
    A = distance.euclidean(mouth[2], mouth[10])
    B = distance.euclidean(mouth[4], mouth[8])
    C = distance.euclidean(mouth[0], mouth[6])
    mar = (A + B) / (2.0 * C)
    return mar

def process_image(frame):
    EYE_AR_THRESH = 0.15
    MOUTH_AR_THRESH = 0.2
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    face_locations = face_recognition.face_locations(rgb_frame)
    eye_flag = False
    mouth_flag = False
    for face_location in face_locations:
        landmarks = face_recognition.face_landmarks(rgb_frame, [face_location])[0]
        left_eye = np.array(landmarks["left_eye"])
        right_eye = np.array(landmarks["right_eye"])
        mouth = np.array(landmarks["bottom_lip"])

        left_ear = eye_aspect_ratio(left_eye)
        right_ear = eye_aspect_ratio(right_eye)
        ear = (left_ear + right_ear) / 2.0
        mar = mouth_aspect_ratio(mouth)

        if ear < EYE_AR_THRESH:
            eye_flag = True

        if mar > MOUTH_AR_THRESH:
            mouth_flag = True
    return eye_flag, mouth_flag

video_cap = cv2.VideoCapture(0)

@app.get("/rate")
def get_concentration_rate():
    _, frame = video_cap.read()
    eye_flag, mouth_flag = process_image(frame)
    if eye_flag or mouth_flag:
        concentration.append(0)
    else:
        concentration.append(1)
    rate = (sum(concentration) * 100.0) / len(concentration) if concentration else 0
    return {"concentrationRate": rate}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("concentrationrate:app", host="0.0.0.0", port=5000)