# For local deployment
Use node v20.12 or higher. For successful use, you need to:
1. Create a copy of `.env.example` file, rename it to `.env` and change (if you need it). 
2. Run `npm install` command.
3. Run `npx prisma migrate deploy` command.
4. Run `npm run start:dev` command.

You may need to use some variables inside `.env` file: 
* PORT - application that listening to.
* DATABASE_URL - path to the database (with credentials).

For local use, DATABASE_USER, DATABASE_PASSWORD, and DATABASE_NAME are not required

# For docker deployment
For successful use, you need to:
1. Create a copy of `.env.example` file and rename it to `.env`. 
2. Run `docker-compose up` command

You may need to use some variables inside `.env` file: 
* DATABASE_USER - username that will be used for authorisation.
* DATABASE_PASSWORD - password that will be used for authorisation.
* DATABASE_NAME - the name of the database to be worked with.

# OpenAPI
You can use [OpenAPI(online)](https://editor.swagger.io/) to make requests to the server. Just copy content from the `swagger.yaml` file and paste it to the Swagger editor. Please note, if you change PORT and HOST in the `.env` file, you need to change host/port it in the `swagger.yaml` too.

# Ways to improve
1. Creating indexes for the database when the system load increases.
2. Stronger separation of the structure of some files to improve code readability.
3. Changes to environments to improve code maintainability (file storage folder, etc.)