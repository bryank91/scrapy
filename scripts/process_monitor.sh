#!/bin/bash

# Check if node is running
# -x flag only match processes whose name (or command line if -f is
# specified) exactly match the pattern. 

# param1: root directory of scrapy
# eg. /home/bryan/scrapy/
# param2: command to run
# eg. changes --forever 60 testing


if pgrep -x "node" > /dev/null
then
    echo "Application is still running.."
else
    echo "Application is stopped. Restarting..."
    cd $1 && $(which npm) start -- $2 >> scrapy_logs.txt &
fi
