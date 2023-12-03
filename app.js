const express = require('express');
const session = require('express-session')

// express app
const app = express();
// listen for requestes



//setup session meddile wear

app.set('view engine','ejs');
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public', { 
    setHeaders: (res, path, stat) => {
        res.set('Cache-Control', 'no-store');
    }
}));

// moddle wear console log the request detaild
const logRequest = (req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    console.log(`Request Method: ${req.method}`);
    console.log(`Request Time: ${new Date()}`);
    console.log(`Request header: ${req.header}`);
    next();
  };
  app.use(logRequest);
  const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login');
    } else {
        next();
    }
};


  //set up session middle weare
  app.use(session({
    secret: 'mySecretKey', // Replace with a random string used to sign the session ID cookie
  resave: false,
  saveUninitialized: true
  }));
  //mock user data
  const users = [
    { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
  ]
  

// login rout
 app.get("/login",(req,res) => {
     res.render('login')
 })
app.post('/login',(req,res) => {
  console.log(`request header:${req.header}`)
    const {username ,password} = req.body;
    const user = users.find(u =>u.username == username && u.password == password);
    if(user){
        //store user id in the session up on sucessfull log in
        req.session.userId = user.id;
        res.redirect('/home')
    } else {
        res.send('invalid user name or password')
    }
});
//home page route
app.get('/home',(req,res) =>{
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    if(req.session.userId){
        //render home page if user is logged in
        res.render('home')
    } else {
        res.redirect('/login');
    }
    
});
// log out rout
app.get('/logout', (req, res) => {
    // Destroy the session on logout
    req.session.destroy(err => {
      if (err) {
        return res.send('Error logging out');
      }
      res.redirect('/login');
    });
  });
  
  app.listen(8000,(req,res) => {
    console.log(`listing to port :${8000}`)
})