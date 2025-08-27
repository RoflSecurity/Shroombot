@echo off
where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo MariaDB non trouvé. Veuillez installer MariaDB manuellement.
) else (
    echo MariaDB est installé.
)
pause
