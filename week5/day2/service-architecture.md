## OVERVIEW::
This project uses a 3-service Architecture
 -> Client
 -> Server
 -> MongoDB

 All services run using Docker and communicate inside a shared Docker network.

 ## SERVICES::
 -> Client
    - Built using React
    - Runs on Port 3000
    - Converse to the Server through http://server:5000
    - Dockerfile builds and serves the React app

 -> Server
    - Built using Node/Express
    - Runs on Port 5000
    - Connects to Mongo using mongodb://mongo:27017/mydb
    - Handles routes and DB operations

 -> MongoDB
    - Used official MOngo image
    - Exposed on Port 27017
    - Stores data
    - Data persists using Docker volume mondo-data

## DOCKER COMPOSE ARCHITECTURE::
docker-compose.yml controls all 3 services:
 - mongo service starts first
 - server waits for mongo
 - client waits for server

 ALso manages volumes and environment variables

## FLOW REQUEST::
-> User opens frontend - http://localhost:3000 (Client container)
-> Client calls backend API - Get http://server:5000 (opens server container)
-> Server reads/writes data in DB 
-> Server sends response - client shows it to the user

## WHY THIS ARCHITECTURE IS GOOD::
-> Separation of frontend, backend and DB
-> Easier to maintain and deploy
-> Reusable Docker setup
    
   