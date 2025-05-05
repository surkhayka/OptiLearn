# OptiLearn README

## Overview

This repository contains a web-based Study Dashboard application that includes:

* A front‐end development server (using npm)
* A Python-based attention tracking service (using FastAPI)
* A Node.js deep-seek analyzer script

Follow the instructions below to set up and run the application on your local machine.

---

## Prerequisites

* **Node.js** (v14+)
* **npm** (v6+)
* **Python** (3.8+)
* **pip** (for Python package management)

---

## 1. Front-End Setup (Study Dashboard)

1. Open a terminal and navigate to the root folder:

   ```bash
   cd OptiLearn
   ```

2. Install JavaScript dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

This will launch the front-end at `http://localhost:3000` by default.

---

## 2. Attention Tracking Service (FastAPI)

1. Open a new terminal and navigate to the Python service folder:

   ```bash
   cd OptiLearn/app
   ```

2. (Optional) Create and activate a virtual environment:
   
   ```bash
   python3 -m venv venv
   source venv/bin/activate   # macOS/Linux
   venv\Scripts\activate    # Windows
   ```

4. Install Python dependencies:

   ```bash
   pip install opencv-python mediapipe numpy cvzone fastapi uvicorn openai
   ```

5. Run the FastAPI server on port 8000 with live reload:

   ```bash
   uvicorn concentrationrate:app --reload --port 8000
   ```

You should see Uvicorn start and listen at `http://127.0.0.1:8000`.

---

## 3. Deep-Seek Analyzer (Node.js)

1. From the root folder (`OptiLearn`), run:

   ```bash
   node analyzer.js
   ```

This script will connect to the attention tracking service and process focus/distraction events for deeper analysis.

---

## 4. Directory Structure

```
OptiLearn/
├── app/                 # Python FastAPI attention tracker
│   ├── concentrationrate.py  # FastAPI app instance
│   ├── tiredness.py          # Image processing modules
│   └── ...                   # Other Python modules
├── analyzer.js         # Node.js script for deep-seek analysis
├── package.json        # Front-end dependencies & scripts
├── public/             # Static assets for front-end
└── src/                # Front-end source files
```

---

## 5. Notes

* If you change Python code, Uvicorn's `--reload` flag will automatically restart the server.
* Ensure your webcam permissions are enabled for focus monitoring features.
* Customize `analyzer.js` connection URL if your FastAPI server runs on a different host or port.

---

## Troubleshooting

* **Port conflicts**: If port 3000 or 8000 is in use, change the port in your `npm run dev` configuration or Uvicorn command.
* **Module import errors**: Verify that `concentrationrate.py` defines an `app = FastAPI()` instance.
* **Webcam access issues**: Confirm your browser or OS settings allow camera access.

---

That's it! You should now have the Study Dashboard fully operational on your machine.
Happy studying!
