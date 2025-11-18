#!/bin/sh
 
UP_DOWN_RESTART="$1"

if [ ${UP_DOWN_RESTART} == 'up' ] ; then
	echo "Starting xinobi backend containers"
	docker compose up -d
elif [ ${UP_DOWN_RESTART} == 'start' ] ; then
	echo "Starting xinobi backend containers"
	docker compose up -d
elif [ ${UP_DOWN_RESTART} == 'down' ] ; then
  echo "Stopping docker containers"
	docker compose down
	echo "Cleaning docker volumes"
	docker volume rm $(docker volume ls -q)
elif [ ${UP_DOWN_RESTART} == 'stop' ] ; then
  echo "Stopping docker containers"
	docker compose down
	echo "Cleaning docker volumes"
	docker volume rm $(docker volume ls -q)
elif [ ${UP_DOWN_RESTART} == 'restart' ] ; then
  echo "Stopping docker containers"
	docker compose down
	echo "Cleaning docker volumes"
	docker volume rm $(docker volume ls -q)
	echo "Starting xinobi backend containers"
	docker compose up -d
else
	echo "\nUsage:  sh backend.sh up|start|down|stop|restart\n\n"
fi
