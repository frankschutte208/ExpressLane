@echo off
setlocal EnableDelayedExpansion

echo ExpressLane - Git Backup Script
echo =============================
echo.

REM Check if we're in a git repository
if not exist ".git" (
    echo Error: Not a git repository. Please run this script from the root of your project.
    exit /b 1
)

REM Check for node_modules
if exist "node_modules" (
    echo Warning: node_modules directory detected
    echo This directory should be excluded from git (check .gitignore)
    echo.
)

REM Get current version
for /f "tokens=*" %%a in ('git describe --abbrev^=0 --tags 2^>^&1') do set CURRENT_VERSION=%%a
if "!CURRENT_VERSION!"=="" (
    echo No version tags found. This will be the first version.
) else (
    echo Current version: !CURRENT_VERSION!
)

REM Get current status
git status
echo.
echo Current Status ^(above^)
echo.

REM Ask for version number
set /p VERSION="Enter new version number (e.g., 1.0.0): "
if "!VERSION!"=="" (
    echo Error: Version number is required
    exit /b 1
)

REM Ask for description
set /p DESC="Enter description of changes: "
if "!DESC!"=="" (
    echo Error: Description is required
    exit /b 1
)

echo.
echo Preparing backup...
echo.

REM Add all files except node_modules
echo Adding files to git...
git add .

REM Create commit
git commit -m "v!VERSION! - !DESC!"

REM Create tag with description
git tag -a v!VERSION! -m "Version !VERSION! - !DESC!"

echo.
echo Backup complete:
echo - Previous version: !CURRENT_VERSION!
echo - New version: v!VERSION!
echo - Description: !DESC!
echo.

REM Ask if user wants to push to remote
set /p PUSH="Push to remote repository? (y/n): "
if /i "!PUSH!"=="y" (
    echo.
    echo Pushing to remote...
    git push
    git push --tags
    echo.
    echo Push complete
) else (
    echo.
    echo Changes are committed locally but not pushed to remote
)

echo.
echo Backup process finished
pause 