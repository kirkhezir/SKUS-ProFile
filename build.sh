#!/bin/bash
# Vercel build script for SKUS ProFile

echo "Installing frontend dependencies..."
cd frontend
npm ci

echo "Building frontend application..."
npm run build

echo "Build completed successfully!"
ls -la dist/
