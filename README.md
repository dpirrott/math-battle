# **Math-Battle**

A competitive math app created just for fun (for my brother and me at least). The main reason why
I've been developing this app is so I can get familiar with WebSockets via SocketIO and also gain
experience with sending/receiving data to/from a MongoDB database.

The main premise of the app is simple, two players answer a set of math questions and try to out
score their opponent in a timed match.

## **Stack**

Frontend: _React_

Backend: _Node/Express_

Database: _MongoDB_

## **Current State**

I'd consider the app to be in very early development. There will be a live demo deployed soon that
will showcase the main concept of the app, which is having two players race against the clock
answering questions and trying to achieve a higher score. Some basic features of the app include:

- Simple user registration and login
- 5 pre-loaded battle rooms, so 10 players will be supported in the demo
- A few match settings include: game time, difficulty, and total questions
- Questions are currently only multiplication
- Both users must ready up before the game countdown will begin
- Games can be paused/resumed by either user
- Games can be ended manually if someone had to leave
- Results pop up after the match ends
- Currently only feasible to play on a mobile browser

## **Upcoming features**

The following features will slowly be added to the live demo.

- Highscores
- Single player practice
- Friends list (Online status, game invites)
- More types of math questions (Division, exponents, square roots, algebra... etc)
- Email verification on sign-up
- Make app usable on desktop (use number keys rather than clicking)

## **Screenshots**

# **Getting Started**

You will need to have two separate terminals running, one for the frontend client and the other for
the backend server.

## **Client side**

```sh
cd client
```

### Setup

Install dependencies with

```sh
npm install
```

### Running Webpack Development Server

```sh
npm start
```

Server should be hosted on `http://localhost:3000/`

### Testing

The following command will run all test files. If you plan on refactoring any code I've written,
please run the test command after to ensure basic functionality and edge cases are still handled
properly.

```sh
npm test
```

**Please note -** _Test files are still in development and will continue being developed to increase
testing coverage._

## Client Dependencies

- @emotion/react: ^11.9.0
- @emotion/styled: ^11.8.1
- @mui/icons-material: ^5.8.0
- @mui/material: ^5.8.0
- @testing-library/jest-dom: ^5.16.4
- @testing-library/react: ^13.1.1
- @testing-library/user-event: ^13.5.0
- @types/jest: ^28.1.4
- axios: ^0.27.2
- bootstrap: ^5.1.3
- moment: ^2.29.4
- react: ^18.1.0
- react-bootstrap: ^2.3.1
- react-bootstrap-range-slider: ^3.0.4
- react-cookie: ^4.1.1
- react-dom: ^18.1.0
- react-scripts: 5.0.1
- socket.io-client: ^4.5.0
- web-vitals: ^2.1.4

## **Server side**

---

```sh
cd server
```

### Server setup

Install dependencies with

```sh
npm install
```

Copy the .env.example into a new .env file and update add your personal MongoDB password to DB_PASS
environment variable.

```env
DB_PASS=*YOUR_DB_PASSWORD*
```

### Run express server

```sh
npm start
```

## Server Dependencies

---

- bcrypt: ^5.0.1
- body-parser: ^1.20.0
- bootstrap: ^5.1.3
- connect-mongo: ^4.6.0
- cookie-parser: ~1.4.4
- debug: ~2.6.9
- dotenv: ^16.0.1
- express: ~4.16.1
- express-session: ^1.17.3
- http-errors: ~1.6.3
- jade: ~1.11.0
- mongodb: ^4.6.0
- morgan: ~1.9.1
- react-bootstrap: ^2.3.1
- socket.io: ^4.5.0
- uuid: ^8.3.2

## DevDependencies

- nodemon: ^2.0.16
