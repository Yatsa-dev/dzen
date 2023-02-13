# Getting Started with the "dzen-server" server

## Step 1

In the project directory run:

### `npm install`

This command will install all the needed dependencies to the server.

## Step 2

This project uses postgresql database to store data.\
Now you need to tell the server the database data that points to your own database.

Database configuration is stored inside `src/config/configuration.ts`
You can override configuration parameters by passing them via ENV variables or by locally modifind default variables
Default config parameters:

```javascript
DB_TYPE = 'mysql';
DB_HOST = 'localhost';
DB_USERNAME = 'admin';
DB_PASSWORD = 'admin';
DB_DATABASE = 'dzencode';
DB_PORT = 3306;
JWT_SECRET = 'secret';
JWT_EXPIRES_IN = 3600;
```

## Step 3

First, make sure you have mysql on your local machine.\

### Run in order to create `dzencode` database it it doesn't exist,

For create new data base I using utils MySQL Workbench

`"CREATE DATABASE dzencode"`

## Step 4

Now your server is good to go.

Run this command in the project directory to start:

### `npm start`

You server runs on [http://localhost:3000](http://localhost:3000)

## Also "dzen-server" hosted on Google Cloud Platform [https://dzen-server-fk6pcl23iq-uc.a.run.app](https://dzen-server-fk6pcl23iq-uc.a.run.app)

## Database schema

![DB_diagram](./docs/schema.dzen-server.png)
