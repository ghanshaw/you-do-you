# you-do-you

YouDoYou is a simple todo app that I built to practice my skills on the MEAN stack. I designed the frontend, set up a database and implemented a RESTful API to retrieve, create and update users and todos.

The app is built with AngularJS, Bootstrap and Sass on the frontend, and Node, Express and MongoDB on the backend. I used Passport and JSON Web Tokens to implement the authentication/session management and Mongoose for database management. The app is depoyed on Heroku. You can view the live app [here][1].

The app has many standard todo featuers: you can add and remove tasks, assign due dates, and view your progress with a glance. The app is also fully responsive. It serves as a good starting point for a more robust todo project sometime in the future.

Note that to use this package, you will have to create your own config.json file. The config file, which should be placed in the config folder, stores sensitive information, such as the username and password of your MongoDB instance, as well as your secret for JSON Web Token and Express session management.

[1]: http://www.ydy.life