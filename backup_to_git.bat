@echo off
setlocal EnableDelayedExpansion

echo ================================================
echo             ExpressLane Backup Tool
echo ================================================.\
echo.

REM Check if we're in a git repository
if not exist ".git" (
    echo Error: Not a git repository. Please run this script from the root of your project.
    exit /b 1
)

REM Get last commit date and message
for /f "tokens=*" %%a in ('git log -1 --format^="%%cd" --date^=format:"%%Y-%%m-%%d %%H:%%M:%%S"') do set LAST_BACKUP=%%a
for /f "tokens=*" %%a in ('git log -1 --format^="%%s"') do set LAST_MESSAGE=%%a

REM Get current version
for /f "tokens=*" %%a in ('git describe --abbrev^=0 --tags 2^>^&1') do set CURRENT_VERSION=%%a
if "!CURRENT_VERSION!"=="" (
    set CURRENT_VERSION=No version tags yet
)

echo Last Backup Information:
echo -----------------------
echo Date: !LAST_BACKUP!
echo Message: !LAST_MESSAGE!
echo Current Version: !CURRENT_VERSION!
echo.

REM Show changed files
echo Changed Files:
echo -------------
git status -s
echo.

REM Ask if user wants to proceed with backup
set /p PROCEED="Do you want to backup these changes? (y/n): "
if /i not "!PROCEED!"=="y" (
    echo Backup cancelled.
    exit /b 0
)

REM Ask for version number with suggestion
set "SUGGESTED_VERSION=1.0.0"
if not "!CURRENT_VERSION!"=="No version tags yet" (
    for /f "tokens=1,2,3 delims=." %%a in ("!CURRENT_VERSION:v=!") do (
        set /a PATCH=%%c+1
        set "SUGGESTED_VERSION=%%a.%%b.!PATCH!"
    )
)
echo.
echo Suggested version: !SUGGESTED_VERSION!
set /p VERSION="Enter new version number [!SUGGESTED_VERSION!]: "
if "!VERSION!"=="" set "VERSION=!SUGGESTED_VERSION!"

REM Ask for description
echo.
echo Enter a brief description of your changes
echo Example: "Updated QuestionsView and fixed layout issues"
set /p DESC="Description: "
if "!DESC!"=="" (
    echo Error: Description is required
    exit /b 1
)

echo.
echo Summary of Backup:
echo -----------------
echo Version: v!VERSION!
echo Description: !DESC!
echo.
set /p CONFIRM="Proceed with backup? (y/n): "
if /i not "!CONFIRM!"=="y" (
    echo Backup cancelled.
    exit /b 0
)

echo.
echo Processing backup...
echo.

REM Add and commit changes
git add .
git commit -m "v!VERSION! - !DESC!"
git tag -a v!VERSION! -m "Version !VERSION! - !DESC!"

REM Push changes
echo.
git push origin main
git push --tags

echo.
echo ================================================
echo Backup completed successfully!
echo - New version: v!VERSION!
echo - Description: !DESC!
echo ================================================
echo.
pause 