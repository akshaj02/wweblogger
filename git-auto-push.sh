#!/bin/bash

# Change to project directory
cd <Your local file location>

# add all changes to git
git add .

# commit messages with date stamp on each commit message
git commit -m "$(date +%Y-%m-%d) update"

# push changes
git push -u origin master
