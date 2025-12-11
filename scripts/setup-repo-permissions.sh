#!/bin/bash

# Configure repository permissions and branch protection
# Usage: ./scripts/setup-repo-permissions.sh

REPO="oneadisa/stay-easy"
DEFAULT_BRANCH="main"

echo "🔧 Configuring repository permissions for $REPO"
echo ""

# Enable branch protection for main
echo "📌 Setting up branch protection for '$DEFAULT_BRANCH'..."
echo ""
echo "This will require PR reviews before merging to main."
echo ""

# Create branch protection rules
gh api repos/$REPO/branches/$DEFAULT_BRANCH/protection \
  --method PUT \
  -f required_status_checks='{"strict":true,"contexts":[]}' \
  -f enforce_admins=true \
  -f required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":false}' \
  -f restrictions=null \
  -f required_linear_history=false \
  -f allow_force_pushes=false \
  -f allow_deletions=false \
  2>&1 || echo "⚠️  Branch protection may already be set or needs manual configuration"

echo ""
echo "✅ Branch protection configured!"
echo ""
echo "📋 Current settings:"
echo "   - PR required before merging to main"
echo "   - 1 approval required"
echo "   - Force pushes disabled"
echo "   - Branch deletion disabled"
echo ""
echo "🔗 Manage settings at: https://github.com/$REPO/settings/branches"







