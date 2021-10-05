#!/bin/bash

# Check if node is running
# -x flag only match processes whose name (or command line if -f is
# specified) exactly match the pattern. 

# param1: frequency in seconds
# param2: profile name

if pgrep -x "node" > /dev/null
then
    echo "Application is still running.."
else
    echo "Application is stopped. Restarting..."
    cd /home/bryan/scrapy/ && npm start -- changes --forever $1 $2 >> scrapy_logs.txt &
fi