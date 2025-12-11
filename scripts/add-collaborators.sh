#!/bin/bash

# Add collaborators to StayEasy repository
# Usage: ./scripts/add-collaborators.sh

REPO="oneadisa/stay-easy"

echo "🔧 Setting up collaborators for $REPO"
echo ""

# Add collaborators here - replace with actual teammate usernames
# Format: gh api repos/$REPO/collaborators/{username} -X PUT -f permission=push
# Permissions: pull (read-only), push (write), admin (full access)

echo "📝 Add your teammate usernames to this script, then run:"
echo ""
echo "Example commands:"
echo "  gh api repos/$REPO/collaborators/TEAMMATE_USERNAME -X PUT -f permission=push"
echo ""
echo "Available permissions:"
echo "  - pull: Read-only access"
echo "  - push: Write access (can push to branches, create PRs)"
echo "  - admin: Full repository access"
echo ""

# Uncomment and add your teammates:
# gh api repos/$REPO/collaborators/TEAMMATE1_USERNAME -X PUT -f permission=push
# gh api repos/$REPO/collaborators/TEAMMATE2_USERNAME -X PUT -f permission=push

echo "✅ To add collaborators manually via GitHub CLI:"
echo "   gh api repos/$REPO/collaborators/{username} -X PUT -f permission=push"
echo ""
echo "✅ Or via GitHub web:"
echo "   1. Go to: https://github.com/$REPO/settings/access"
echo "   2. Click 'Add people'"
echo "   3. Enter username and select 'Write' permission"
echo "   4. Click 'Add [username] to this repository'"







