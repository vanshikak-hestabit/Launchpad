# ML Model API

This project deploys a machine learning model as a REST API using FastAPI and Docker.

---

## Project Structure

- ![structure](folder_st.png) 
 
---

## Features

- `/predict` endpoint for model predictions
- Input validation using Pydantic
- Prediction logging with Request ID
- Model loading using joblib
- Basic data drift monitoring
- Dockerized for easy deployment

---

## Requirements

- Python 3.12
- Docker
- Dependencies listed in `requirements.txt`

---

## Running Locally

1. Activate your virtual environment:
```bash
source venv/bin/activate
```
2. Install dependencies:
```bash
pip install -r requirements.txt
```
3. Start the API server:
```bash
uvicorn deployment.api:app --reload
```
4. Open API documentation:
```bash
http://127.0.0.1:8000/docs
```
5. API Usage
```bash
Endpoint: POST /predict
```
6. Request body format:
```bash
{
  "features": [f1, f2, f3, ..., f27]
}
```
7. Response:
```bash
{
  "prediction": 0
}
```
## Docker Usage

1. Build the Docker image:
```bash
docker build -t ml-api .
```
2. Run the container:
```bash
docker run -p 8000:8000 ml-api
```
3. Access the API:
```bash
http://localhost:8000/docs
```
