#!/bin/bash
echo "Updating dependencies..."
find . -maxdepth 1 -type d \( ! -name . \) -exec bash \
-c "cd '{}' && echo \"Updating '{}'...\" && ncu -u" \;
