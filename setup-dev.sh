#!/bin/bash

# setup-dev.sh - Secure development environment setup

echo "🔐 KRONOS AI: Secure Developer Setup"

# 1. Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "Done. Please update .env with your secrets."
else
    echo ".env already exists."
fi

echo "✅ Setup complete. Remember NEVER to commit your .env files!"
