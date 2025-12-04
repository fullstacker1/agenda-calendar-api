## AGENDA CALENDAR 

### files to create 
+ .env
+ docker-compose.yml

### .env 

~~~
PORT= your port
MONGO_URL=mongodb://mongouser:password@localhost:port
MONGO_DB_NAME=DB name
JWT_SEED= your seed name custom

~~~
### docker-compose.yml
~~~
version: '3.8'
services:

  mongo-db:
    image: mongo:6.0.6
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: mongoUsername
      MONGO_INITDB_ROOT_PASSWORD: mongoPW
    volumes:
      - ./mongo:/data/db
    ports:
      - 27017:27017
~~~



