const express = require('express');
const router = express.Router();
// const bcrypt = require('bcryptjs');
const Users = require('../../models/users');
const bcrypt = require('bcryptjs');
const Projects = require('../../models/Project')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const users = require('../../models/users');



router.all('/*', (res, req, next)=>{

req.app.locals.layout='main'
next()
})

//Home
router.get('/', (req, res)=>{
    Projects.find({}).lean().then(projects=>{
        // console.log(project)
        req.flash('home_message', 'Welcome to my portfolio !')
        
        res.render('./home/home', {projects,})
    }) 
})

//Project Lists
router.get('/projects', (req, res)=>{
    Projects.find({}).lean().then(projects=>{

res.render('home/projects', {projects})
    })
    
})


//Project detail:id
router.get('/project-detail/:id', (req, res)=>{
    Projects.findOne({_id:req.params.id}).lean().then(project=>{
        console.log(project)
        res. render('home/project-detail', {project})
    })
   
})

//Blog Lists
router.get('/blog', (req, res)=>{
    res.render('home/blogs')
})

//Blog detail
router.get('/blog-detail', (req, res)=>{
    res. render('home/blog-detail')
})


//Register
router.post('/register', (req, res)=>{
    
    const user = new Users({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        password:req.body.password
    })
   
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(user.password, salt,( err, hash)=>{
            user.password = hash
           
            user.save().then(saved=>{
                 
              
              })    
        })
    })
    
    
    req.flash('home_message',`You are sucessfully registered as ${user.email}. Please Login`)
    res.redirect('/')   
})

//Login with passport middlewear
passport.use(new LocalStrategy({usernameField: 'email'},
    (email, password, done)=> {
        Users.findOne({email:email}).lean().then(user=>{
            console.log(user)
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
              }
              
              bcrypt.compare(password, user.password,(err, matched)=>{
                  if(err) return err
                  if(matched){
                      return done(null, user)
                  }
                  else{
                        return done(null, false, {message:"the password is incorrect"})
                  }
              })
        })
    }
  ))

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    Users.findById(id, function(err, user) {
      done(err, user);
    });
  })
  
 


//login
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/blog',
    failureFlash: true 
})(req, res , next)

})






module.exports = router