#!/bin/bash
if ! command -v mariadb >/dev/null 2>&1; then
  echo "MariaDB non trouvé. Installez-le avec:"
  echo "sudo apt update && sudo apt install mariadb-server -y"
else
  echo "MariaDB est installé."
fi
