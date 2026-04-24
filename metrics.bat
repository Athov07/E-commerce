@echo off
echo ====================================================
echo STEP 1: CAPTURING BASELINE (IDLE STATE)
echo ====================================================
:: This captures the baseline and saves it
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" > baseline_metrics.txt

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not running! Please start Docker Desktop.
    pause
    exit /b
)

echo Baseline saved successfully to baseline_metrics.txt.
echo.
echo ----------------------------------------------------
echo ACTION: 
echo 1. Start your test (Add items to cart/Checkout).
echo 2. While the system is BUSY, come back here.
echo ----------------------------------------------------
pause

echo.
echo ====================================================
echo STEP 2: CAPTURING ACTIVE LOAD METRICS
echo ====================================================
:: This captures the load state
docker stats --no-stream > active_load_metrics.txt

echo Active metrics saved successfully to active_load_metrics.txt.
echo.
echo ====================================================
echo COLLECTION COMPLETE! You can now close this window.
echo ====================================================
pause