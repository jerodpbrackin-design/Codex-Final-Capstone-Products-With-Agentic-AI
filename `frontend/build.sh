#!/bin/bash

# Navigate to the frontend directory
cd frontend

# Build the React app
npm run build

# Move the build output to a directory accessible by the Flask backend
mv build /var/www/html/
