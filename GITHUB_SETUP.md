# GitHub Setup Guide

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - **Repository name**: `social-media-platform` (or your preferred name)
   - **Description**: "Social Media Platform V1.0 - A secure web-based social media platform"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see a page with setup instructions. Use one of these methods:

### Option A: Using HTTPS (Recommended)
```bash
cd "C:\Users\prane\Desktop\Projects\Social Media Platform"
git remote add origin https://github.com/YOUR_USERNAME/social-media-platform.git
git branch -M main
git push -u origin main
```

### Option B: Using SSH
```bash
cd "C:\Users\prane\Desktop\Projects\Social Media Platform"
git remote add origin git@github.com:YOUR_USERNAME/social-media-platform.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

## Step 3: Push Your Code

After adding the remote, push your code:

```bash
git push -u origin main
```

## Important Notes

- Make sure your `.env` files are NOT committed (they're in `.gitignore`)
- The repository is ready to push with all your code
- If you get authentication errors, you may need to:
  - Use a Personal Access Token (PAT) instead of password for HTTPS
  - Set up SSH keys for SSH authentication

## Future Updates

After making changes, use these commands:

```bash
git add .
git commit -m "Your commit message"
git push
```

