#!/bin/bash

# Clean up node_modules
echo "Cleaning up node_modules..."
rm -rf node_modules

# Install dependencies
echo "Installing dependencies..."
npm install

# Start the application in development mode
echo "Starting the application..."
npm run dev
