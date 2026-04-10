#!/usr/bin/env bash

set -e

echo "📦 Installing system dependencies..."
sudo apt update
#sudo apt install -y sqlite3

echo "📁 Preparing folders..."
mkdir -p database

echo "🐍 Setting up Python environment..."
python -m venv .venv

.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r requirements.txt

echo "✅ Dev container setup complete"