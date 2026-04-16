#!/bin/bash

# setup-dev.sh - Secure development environment setup

echo "🔐 KRONOS AI: Secure Developer Setup"

# 1. Create local config if it doesn't exist
if [ ! -f "firebase-applet-config.local.json" ]; then
    echo "Creating firebase-applet-config.local.json from template..."
    cp firebase-applet-config.json firebase-applet-config.local.json
    echo "Done. Please update firebase-applet-config.local.json with your secrets."
else
    echo "firebase-applet-config.local.json already exists."
fi

# 2. Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "Done. Please update .env with your secrets."
else
    echo " .env already exists."
fi

echo "✅ Setup complete. Remember NEVER to commit your .local.json or .env files!"
