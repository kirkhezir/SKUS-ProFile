#!/bin/bash
echo "Starting Vercel build for SKUS ProFile..."
echo "Installing dependencies..."
npm ci

echo "Building application..."
npm run build

echo "Build completed successfully!"
echo "Build output:"
ls -la dist/
