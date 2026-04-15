#!/bin/bash

# Deploy script for TraderPulse Frontend to Vercel

set -e

echo "Deploying TraderPulse Frontend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "Checking Vercel login..."
vercel login --check || vercel login

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment completed!"
echo "Check your Vercel dashboard for the deployment URL."