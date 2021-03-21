#!/bin/zsh

export PGPASSWORD = "fe57f03140e709bb12814ccd5d2c4ac67ec0690f75324cd885e605f72f56c5b4`

database="dergfjmqqot3k9"

echo "Configuring database: $database"

heroku pg:psql postgresql-opaque-83017 <./bin/sql/photos.sql  --app photo-share-api

echo "$database configured"