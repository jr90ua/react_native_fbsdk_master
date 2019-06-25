# Instagram Direct Message Bot.

1. How to excute this application?
    1) follow this steps at development method.
        - install the node modules.
            `````````
            npm install
            `````````

        - migrate database.
            `````````
            sequelize db:migrate
            `````````

        - start your application with standard method.

            ````````
            npm start
            ````````
2. UI desing assets..
    1) bootstrap 4 material
        https://fezvrasta.github.io/bootstrap-material-design/
        https://fezvrasta.github.io/bootstrap-material-design/docs/4.0/getting-started/introduction/

    2) Font-Awesome url
        https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons
        https://use.fontawesome.com/releases/v5.0.6/css/all.css
        https://material.io/tools/icons/?icon=insert_comment&style=outline

3. core modules
    - child_process
    - instagram-privat-api ^0.10.1
    - sequelize
    - pg, pg-hstore

4. issues
    - solved
        --- make the reply => don't use the random (important)
        --- delay.
        --- change the product mode
        ---- edit bot:
            - replies, comments, delay time, set commit per day, bot name.

        -- type error : getting data form api: commit fixed
        -- database connection error: sequelize read econnection. : setting up at developmode