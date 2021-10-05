#!/bin/bash

# Check if node is running
# -x flag only match processes whose name (or command line if -f is
# specified) exactly match the pattern. 

# param1: profile that you want to run
# param2: how frequent do you want to run

if pgrep -x "node" > /dev/null
then
    echo "Application is still running.."
else
    echo "Application is stopped. Restarting..."
    npm start -- changes --forever $2 $1 >> scrapy_logs.txt &
fi