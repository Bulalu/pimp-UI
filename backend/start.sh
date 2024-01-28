#!/bin/bash

# Install Python packages
pip install --ignore-installed blinker
pip install flask flask-cors
pip install firebase_admin
pip install -U git+https://github.com/huggingface/diffusers.git
pip install -U controlnet_aux==0.0.7
pip install transformers accelerate safetensors
pip install gunicorn
pip install flask_limiter

# Start the gunicorn server
gunicorn --bind 0.0.0.0:5000 wsgi:app --workers 1 --timeout 10000 --threads 1000 --backlog 1024
