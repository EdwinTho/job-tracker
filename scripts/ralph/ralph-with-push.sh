#!/bin/bash

# Run original Ralph script
./scripts/ralph/ralph.sh "$@"

# After Ralph finishes, push everything to GitHub
echo "Pushing all commits to GitHub..."
git push origin main

echo "✅ All changes pushed to GitHub!"
echo "View at: $(git remote get-url origin | sed 's/\.git$//')"
