FROM python:3.12-slim

WORKDIR /app

# Copy and install dependencies
COPY ./deployment/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all code including deployment folder
COPY deployment/ deployment/
COPY models/ models/

# Expose FastAPI port
EXPOSE 8000

# Run the FastAPI server
CMD ["uvicorn", "deployment.api:app", "--host", "0.0.0.0", "--port", "8000"]
