#!/bin/zsh

export PGPASSWORD='duongtuanh3796'

database="photosdb"

echo "Configuring database: $database"

dropdb -U duong_tu_anh photosdb
createdb -U duong_tu_anh photosdb

psql -U duong_tu_anh photosdb < ./bin/sql/photos.sql

echo "$database configured"