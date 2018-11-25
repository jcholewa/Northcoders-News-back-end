## Northcoders News
This project serves data from a MongoDB database containing fake news articles, topics, users and article comments. 

### Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

This project uses MongoDB for its database. The database is seeded using mLab, and hosted on Heroku at https://jc-northcoders-news.herokuapp.com/api. 

You will need to have MongoDB installed, and ensure that it is running in the background. You can find instructions on how to install MongoDB via the following documentation: https://www.mongodb.com/download-center?jmp=nav

Once installed, you can run it in the background using the following terminal command: 

```
mongod
```


## Installing

Fork this project on GitHub by clicking "Fork" in the top right of this GitHub page. This will fork it to your GitHub profile, creating a copy of the repository.

Clone the project from GitHub by clicking the green "Clone or download" button and copying the provided URL.

Navigate on your local machine's command line to the directory you want to clone the project into, and type:

```
git clone clonedurl
```

Open the project in a text editor.

Within the project, the following [npm](https://www.npmjs.com/) packages are required:
  * nodemon
  * express
  * mongoose
  * chai
  * chai asserttype
  * mocha
  * supertest

This can be done by opening an integrated terminal and typing:

```
npm i
```


Once these steps are complete, you can open the project in a developer environment using the terminal command:

```
npm run dev
```

If you would like to seed the database prior to running the project in developer mode, replace the above with the command:

```
npm run seed:dev
```

## Running the tests
To run the automated tests for this system, type:

```
npm test
```

into the command line.

To view the tests, view the index.spec.js file inside the project's spec directory. 

The tests test each endpoint, in addition to some common errors. See https://jc-northcoders-news.herokuapp.com/api for a list of the project's endpoints.

The test file reseeds the database after each test to ensure the test data is accurate.

## Built With
* [Express](https://expressjs.com/) - web framework
* [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/docs/) - database
* [mLab](https://mlab.com/) - database seeding service
* [Heroku](https://heroku.com/) - hosting service

## Author
Joanna Cholewa

## Acknowledgments
[Northcoders](https://northcoders.com/) tutors

[Purple Booth](https://purplebooth.co.uk/) provided a [README template](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2) 