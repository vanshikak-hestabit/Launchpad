# Project Architecture

## Folder Structure
- config/ → Environment loader
- loaders/ → App and DB loader
- routes/ → All API routes
- controllers/ → Handles request logic
- services/ → Business logic
- repositories/ → Database interactions
- utils/ → Logger and helpers
- middlewares/ → Custom middlewares
- jobs/ → Scheduled tasks
- logs/ → Log files

## Loaders
- App loader loads middlewares, DB, and routes in order
- DB loader connects to MongoDB
- Logger logs startup, requests, errors

## Startup Logs
- Environment loaded
- Database connected
- Middlewares loaded
- Routes mounted
- Server started on port X
