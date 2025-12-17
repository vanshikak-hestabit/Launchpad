
echo "Building docker images"
docker compose  -f docker-compose.yml build

echo "Stopping old containers"
docker compose -f docker-compose.yml down

echo "Starting containers"
docker compose -f docker-compose.yml up -d

echo "Deployment complete"