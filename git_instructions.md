# Git Operations in Windows PowerShell

## Basic Commands for Backing Up Code

### 1. Check Repository Status
```powershell
git status
```

### 2. Stage Changes
```powershell
# Stage specific file
git add filename.ext

# Stage all changes
git add .
```

### 3. Commit Changes
```powershell
git commit -m "Your commit message"
```

### 4. Push to Remote
```powershell
git push origin main
```

## Repository Setup (If Needed)
```powershell
# Initialize new repository
git init

# Set remote origin
git remote add origin https://github.com/username/repository.git

# Rename branch to main
git branch -M main
```

## Important Notes
1. Always use PowerShell commands, NOT Unix commands
2. Never use:
   - `rm -rf` (Use `Remove-Item` instead)
   - Unix-style pipes `|` (Use PowerShell pipes `|` only when needed)
   - Unix-style path separators (Use Windows-style `\` or PowerShell's path handling)

## Common PowerShell-Specific Commands
- Remove directory: `Remove-Item -Recurse -Force directory_name`
- Create directory: `New-Item -ItemType Directory -Path directory_name`
- List directory contents: `Get-ChildItem` or `dir`

## Best Practices
1. Always check status before operations
2. Use descriptive commit messages
3. Pull before pushing if working with others
4. Use `.gitignore` for excluding files/folders
5. Verify remote URL before pushing: `git remote -v` 