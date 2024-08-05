#!/bin/bash

# Navigate to the frontend directory, install dependencies, and start the frontend server
cd frontend
npm install --force
npm start &

# Navigate to the backend directory, install dependencies, and start the backend server
cd ../backend
npm install
node server.js