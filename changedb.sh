#!/bin/bash

restartDb()
{
  printenv
  docker container restart
}

echo "Connection to database suddenly failed. Choose available action:";
echo "1. restart current db;";
echo "2. connect to another database";
echo "Type 1 or 2";

while read -n 4 -t 15 input
do
printf "\n"
case $input in
1* )     restartDb; break ;;
2* )     echo "2"; break ;;
* )     echo "Wrong. Try again!";;
esac
done