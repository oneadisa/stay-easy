# Collaboration Setup Guide

## Adding Collaborators

### Method 1: GitHub CLI (Recommended)
```bash
# Add a collaborator with write access (can push and create PRs)
gh api repos/oneadisa/stay-easy/collaborators/USERNAME -X PUT -f permission=push

# Add with admin access (full control)
gh api repos/oneadisa/stay-easy/collaborators/USERNAME -X PUT -f permission=admin
```

### Method 2: GitHub Web Interface
1. Go to: https://github.com/oneadisa/stay-easy/settings/access
2. Click **"Add people"** button
3. Enter teammate's GitHub username
4. Select permission level:
   - **Write**: Can push, create branches, create PRs (recommended)
   - **Admin**: Full repository access
5. Click **"Add [username] to this repository"**

## Permission Levels

- **Read (pull)**: Can view and clone, but cannot push
- **Write (push)**: Can push to branches, create PRs, merge PRs (if allowed)
- **Admin**: Full access including settings and deletion

## Branch Protection (Already Configured)

The `main` branch has protection rules:
- ✅ PR required before merging
- ✅ 1 approval required
- ✅ Force pushes disabled
- ✅ Branch deletion disabled

## Workflow for Teammates

1. **Clone the repository:**
   ```bash
   git clone https://github.com/oneadisa/stay-easy.git
   cd stay-easy
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feature/their-feature-name
   ```

3. **Make changes and commit:**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

4. **Push to remote:**
   ```bash
   git push origin feature/their-feature-name
   ```

5. **Create Pull Request:**
   - Go to: https://github.com/oneadisa/stay-easy/pulls
   - Click "New Pull Request"
   - Select their branch → `main`
   - Add description and request review
   - Submit PR

6. **After approval, merge:**
   - PR can be merged by anyone with write access
   - Or set to require your approval as owner

## Quick Add Commands

Replace `USERNAME` with actual teammate usernames:

```bash
# Add teammate 1
gh api repos/oneadisa/stay-easy/collaborators/TEAMMATE1_USERNAME -X PUT -f permission=push

# Add teammate 2
gh api repos/oneadisa/stay-easy/collaborators/TEAMMATE2_USERNAME -X PUT -f permission=push

# Add yourself (Goketech) if needed
gh api repos/oneadisa/stay-easy/collaborators/Goketech -X PUT -f permission=push
```

## Current Branch Structure

- `main` - Production-ready code (protected)
- `dev/collaboration` - Active development branch
- `backup/completed-work` - Your completed work (preserved)

## Need Help?

- Repository Settings: https://github.com/oneadisa/stay-easy/settings
- Access Management: https://github.com/oneadisa/stay-easy/settings/access
- Branch Protection: https://github.com/oneadisa/stay-easy/settings/branches







