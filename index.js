const express = require('express')
const uuid = require('uuid').v4;
const app = express();
const cors = require('cors');
const session = require('express-session');

const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');


const userDB = require('./db/userqueries');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const port = 3000;

 // Enable Cross Origin Resource Sharing to all origins by default
app.use(cors());

// Configure local strategy to be use for local login
passport.use(new LocalStrategy(
  { usernameField: 'email' },
   async (email, password, done) => {
     try {
      console.log('inside passport');
       const user =  await userDB.authenticateUser({ email: email, password : password});
       console.log('Local strategy returned true');
       console.log(user);
       return done(null, user);
     } catch(err) {
      console.log('Local strategy returned false');
       return done(err);
     }
   }
 ));
  // Transforms raw string of req.body into JSON
  app.use(bodyParser.json());

// Creates a session
app.use(
  session({  
    genid: (req) => {
      console.log('Inside session middleware genid function')
      console.log(`Request object sessionID from client: ${req.sessionID}`)
      return uuid() // use UUIDs for session IDs
    },
    secret: "session_secret",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

 // Initialize passport
 app.use(passport.initialize());  
 app.use(passport.session());
 
 // Set method to serialize data to store in cookie
 passport.serializeUser((user, done) => {
  console.log('serializing');
  done(null, user.id);
 });
 
 // Set method to deserialize data stored in cookie and attach to req.user
 passport.deserializeUser((id, done) => {
  console.log('deserializing');
  done(null, id);
  // const user = users[0].id === id ? users[0] : false; 
 // done(null, user);
 });

 

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})



 
 /*  Login Endpoint*/
  app.post('/login', (req, res, next) => {
    console.log('Inside POST /login callback')
    passport.authenticate('local', (err, user, info) => {
      console.log('Inside passport.authenticate() callback');
      console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
      console.log(`req.user: ${JSON.stringify(req.user)}`)
      req.login(user, (err) => {
        console.log('Inside req.login() callback')
        console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
        console.log(`req.user: ${JSON.stringify(req.user)}`)
        return res.send('You were authenticated & logged in!\n');
      })
    })(req, res, next);
  })
  /*  Check auth*/
  app.get('/authrequired', (req, res) => {
    console.log('Inside GET /authrequired callback')
    console.log(`User authenticated? ${req.user}`);
    console.log(req.session);
    console.log(`User authenticated? ${(req.session)}`);
    if(req.isAuthenticated()) {
      res.send('you hit the authentication endpoint\n')
    } else {
      console.log('invalid');
      res.send('invalid');
    }
  })
const userRouter = require('./routes/user');
app.use('/users',userRouter);
    
const cartRouter = require('./routes/cart');
app.use('/cart',cartRouter);
const productRouter = require('./routes/product');
app.use('/products',productRouter);
const orderRouter = require('./routes/order');
app.use('/orders',orderRouter);

const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

// Loading via yml.safeLoad to avoid errors with special characters during processing
const swaggerDocument = yaml.load(fs.readFileSync(path.resolve(__dirname, './swagger.yml'), 'utf8'));


  // Serves Swagger API documentation to /docs url
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})