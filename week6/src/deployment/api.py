import uuid
from datetime import datetime
import csv
import os

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="ML Model API")

# load model
model = joblib.load("models/best_model.pkl")

EXPECTED_FEATURES = 27
LOG_FILE = "prediction_logs.csv"

class PredictionInput(BaseModel):
    features: list[float]

@app.get("/")
def home():
    return {"message": "API is running"}

@app.post("/predict")
def predict(input_data: PredictionInput):

    if len(input_data.features) != EXPECTED_FEATURES:
        raise HTTPException(
            status_code=400,
            detail=f"Expected {EXPECTED_FEATURES} features, got {len(input_data.features)}"
        )

    data = np.array(input_data.features).reshape(1, -1)
    prediction = int(model.predict(data)[0])

    # -------- logging --------
    request_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat()

    file_exists = os.path.isfile(LOG_FILE)

    with open(LOG_FILE, "a", newline="") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(
                ["request_id", "features", "prediction", "timestamp"]
            )
        writer.writerow(
            [request_id, input_data.features, prediction, timestamp]
        )

    return {
        "request_id": request_id,
        "prediction": prediction
    }
