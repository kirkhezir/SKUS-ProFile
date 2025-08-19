#!/bin/bash
echo "Starting Vercel build for SKUS ProFile..."

echo "Installing dependencies..."
npm ci

echo "Setting permissions..."
chmod +x node_modules/.bin/vite
chmod +x node_modules/.bin/*

echo "Building application..."
node ./node_modules/vite/bin/vite.js build

echo "Build completed successfully!"
echo "Build output:"
ls -la dist/
