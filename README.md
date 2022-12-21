This is a JavaScript toDoList now working with a local MongoDB database. I used Expressjs and mongoose to make it.
You can run it using 'nodemon app.js' on yout terminal (must be on the directory of the folder), but you also need to have MongoDB installed and running.
At localhost:3000 you can find a start page with a main to do list, but you can also create as many lists as you want using localhost:3000/'listName', like localhost:3000/home or localhost:3000/work, for example. Each of the lists will have their own database.
