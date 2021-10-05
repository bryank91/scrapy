#!/bin/bash

# Update the apt updater
sudo apt update

# Install node
sudo apt install nodejs npm

# Install chromium depedencies
sudo apt-get install -yq --no-install-recommends libasound2 libatk1.0-0 libc6 libcairo2 \
libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 \
libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 \
libx11-xcb1 libxcb1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 \
libxrender1 libxss1 libxtst6 libnss3 libgbm-dev

# Install chromium
sudo apt install chromium-browser

# Install all required npm depedencies
npm install

### Update node to the latest version
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node

### Allow process_monitor to be run in crontab
chmod +x ./scripts/process_monitor.sh
