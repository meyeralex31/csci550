This is a nodejs package.

To use, download npm. ( I am using version 6.14.9)

You will also need node(I am using version v14.15.3)

# commands:

`npm install` download packages used

`npm run start` will run the ui - this will start on http://localhost:3000

`npm run start-local` will start the admin server on http://localhost:8080

`npm run start-collectors` will start the collectors on http://localhost:3001 - http://localhost:3004

# Connecting to the Mongo db

#TODO

# file structure

[public](/public) - public files for client
[src](/src) - client code
[src/App.js](src/App.js) - contains the code to for the React Router

[server](/server) - contains the code for both servers
[server/data](/server/data/)- contains the data model
[server/db](/server/db/)- contains the connection to the db
[server/router](/server/router/)- contains the code for the nodejs routes
[server/utilities](/server/utilities/)- contains the code for any utlities used
