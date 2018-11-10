## Northcoders News
This project serves data from a MongoDB database containing fake news articles, topics, users and article comments. 

### Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

This project uses MongoDB for its database. The database is seeded using mLab, and hosted on Heroku at https://jc-northcoders-news.herokuapp.com/api. 

You will need to have MongoDB installed, and ensure that it is running in the background. You can find instructions on how to install MongoDB via the following documentation: https://www.mongodb.com/download-center?jmp=nav

Once installed, you can run it in the background using the following terminal command: 

```http
mongod
```

## Installing

A step by step series of examples that tell you how to get a development env running.

Fork this project on GitHub by clicking "Fork" in the top right of the GitHub page. This will fork it to your GitHub profile, creating a copy of the repository.
Clone the project from GitHub by clicking the green "Clone or download" button and copying the provided URL.

Navigate on your local machine's command line to the directory you want to clone the project into, and type:

```http
git clone clonedurl
```

Open the project.

Within the project, you will need to install the following [npm](https://www.npmjs.com/) packages:
  * nodemon
  * express
  * mongoose
  * chai
  * chai asserttype
  * mocha
  * supertest

This can be done by opening a terminal and typing:

```http
npm i nodemon express mongoose chai chai-asserttype mocha supertest
```

Once these steps are completed, you can run the tests, as described below, or open the project in a developer environment using the terminal command:

```http
npm run dev
```
If you would like to seed the database in addition to running in developer mode, replace the above with the command:

```http
npm run seed:dev
```

## Running the tests
To run the automated tests for this system, type:

```http
npm test
```
into the command line.

To view the tests, view the index.spec.js file inside the spec directory. 

The tests test each endpoint (see https://jc-northcoders-news.herokuapp.com/api for a list of the project's endpoints), in addition to some common errors. 

## Built With
* [Express](https://expressjs.com/) - web framework
* [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/docs/) - database
* [mLab](https://mlab.com/) - database seeding service
* [Heroku](https://heroku.com/) - hosting service

## Author
Joanna Cholewa

## Acknowledgments
Northcoders tutors

Purple Booth provided a README template: https://gist.github.com/PurpleBooth/109311bb0361f32d87a2 