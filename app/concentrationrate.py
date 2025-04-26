import cv2
import mediapipe as mp
import numpy as np
import time
import cvzone
import warnings
from cvzone.FaceMeshModule import FaceMeshDetector
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from tiredness import process_image as process_tired, tiredness as tiredness_list

warnings.filterwarnings("ignore")

# Global state
concentration = [1]
tiredness_list: list[int] = []

# Initialize detectors and camera
detector = FaceMeshDetector(maxFaces=1)
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils
drawing_spec = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)
cap = cv2.VideoCapture(0)

# FastAPI app
app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/rate")
def get_concentration_rate():
  # Capture frame
  success, frame = cap.read()
  if not success:
    return {"concentrationRate": None}
  # Preprocess
  image = cv2.cvtColor(cv2.flip(frame, 1), cv2.COLOR_BGR2RGB)
  # Face mesh detection
  img, faces = detector.findFaceMesh(image, draw=False)
  val = 1
  if faces:
    # Distance between eyes
    face = faces[0]
    pointLeft = face[145]
    pointRight = face[374]
    cv2.line(img, pointLeft, pointRight, (0, 255, 0), 2)  # line between eyes
    cv2.circle(img, pointLeft, 5, (255, 0, 255), cv2.FILLED)  # point the left eye
    cv2.circle(img, pointRight, 5, (255, 0, 255), cv2.FILLED)  # point the right eye

    w, _ = detector.findDistance(pointLeft, pointRight)  # find distance between two eyes

    W = 6.3  # average distance between eyes for adult person
    f = 1180  # focal length of Macbook Camera
    d = (W * f) / w
    if d > 70:
      val = -1
    else:
      val = 1

    cvzone.putTextRect(img, f"Distance: {int(d)}cm", (face[10][0] - 200, face[10][1] - 50))

    image.flags.writeable = False
    # Get the result
    results = face_mesh.process(image)
    # To improve performance
    image.flags.writeable = True
    # Convert the color space from RGB to BGR
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    img_h, img_w, img_c = image.shape
    face_3d = []
    face_2d = []

    if results.multi_face_landmarks:
      for face_landmarks in results.multi_face_landmarks:
        for idx, lm in enumerate(face_landmarks.landmark):
          if idx == 33 or idx == 263 or idx == 1 or idx == 61 or idx == 291 or idx == 199:
            if idx == 1:
              nose_2d = (lm.x * img_w, lm.y * img_h)
              nose_3d = (lm.x * img_w, lm.y * img_h, lm.z * 3000)

            x, y = int(lm.x * img_w), int(lm.y * img_h)

            face_2d.append([x, y])
            # Get the 3D Coordinates
            face_3d.append([x, y, lm.z])
            # Convert it to the NumPy array
        face_2d = np.array(face_2d, dtype=np.float64)
        # Convert it to the Numpy array
        face_3d = np.array(face_3d, dtype=np.float64)
        # The camera matrix
        focal_length = 1 * img_w
        cam_matrix = np.array([ [focal_length, 0, img_h / 2],
                                    [0, focal_length, img_w / 2],
                                    [0, 0, 1]])

        dist_matrix = np.zeros((4, 1), dtype=np.float64)
        # Solve PnP
        success, rot_vec, trans_vec = cv2.solvePnP(face_3d, face_2d, cam_matrix, dist_matrix)
        # Get rotational matrix
        rmat, jac = cv2.Rodrigues(rot_vec)
        # Get angles
        angles, mtxR, mtxQ, ex, ly, Qz = cv2.RQDecomp3x3(rmat)

        x = angles[0] * 360
        y = angles[1] * 360
        z = angles[2] * 360

        if y < -2 and y > -3:
          text = "Looking Left"
          val = 1

        elif y < -3:
          text = "Looking Left(Distracted)"
          val = 0

        elif y > 2 and y < 3:
          text = "Looking Right"
          val = 1

        elif y > 3:
          text = "Looking Right(Distracted)"
          val = 0

        elif x < 1 and x > 0:
          text = "Looking Down"
          val = 1

        elif x < 0:
          text = "Looking Down(Distracted)"
          val = 0


        elif x > 2.5 and x < 4:
          text = "Looking Up"
          val = 1

        elif x > 4:
          text = "Looking Up(Distracted)"
          val = 0

        else:
          text = "Forward"
          val = 1

        nose_3d_projection, jacobian = cv2.projectPoints(nose_3d, rot_vec, trans_vec, cam_matrix, dist_matrix)
        p1 = (int(nose_2d[0]), int(nose_2d[1]))
        p2 = (int(nose_2d[0] + y * 10), int(nose_2d[1] - x * 10))
        cv2.line(image, p1, p2, (255, 0, 0), 3)

        cv2.putText(image, text, (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 2)
        cv2.putText(image, "x:" + str(np.round(x, 2)), (500, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255))
        cv2.putText(image, "y:" + str(np. round(y, 2)), (500, 100), cv2. FONT_HERSHEY_SIMPLEX, 1, (0, 0,255))
        cv2.putText(image, "z:" + str(np.round (z, 2)), (500, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255))

  concentration.append(val)
  rate = (sum(concentration) * 100.0) / len(concentration) if concentration else 0
  return {"concentrationRate": rate}

@app.get("/tiredness")
def get_tiredness_rate():
  success, frame = cap.read()
  if not success:
    return {"tirednessRate": None}
  eye_flag, mouth_flag = process_tired(frame)
  if eye_flag:
    val = 1
  else:
    val = 0
  tiredness_list.append(val)
  rate = (sum(tiredness_list) * 100.0) / len(tiredness_list) if tiredness_list else 0
  return {"tirednessRate": rate}

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
  return Response(status_code=204)

if __name__ == "__main__":
  import uvicorn
  uvicorn.run("concentrationrate:app", host="0.0.0.0", port=8000, reload=True)