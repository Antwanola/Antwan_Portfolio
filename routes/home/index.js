const express = require('express');
const router = express.Router();
const Users = require('../../models/users');
const bcrypt = require('bcryptjs');
const Projects = require('../../models/Project')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const mailer = require('nodemailer')
const { currentUri } = require('../../helpers/handlebar-helper');
require('dotenv').config();




router.all('/*', (res, req, next)=>{

req.app.locals.layout='main'
next()
})

//Home
router.get('/', (req, res)=>{
// console.log(req.route.path)
    Projects.find({}).lean().then(projects=>{
       let filteredProject =  projects.splice(0,6);
        req.flash('home_message', 'Welcome to my portfolio !')
     let antwan =  currentUri(req.originalUrl)
     res.locals.antwan = antwan
        res.render('./home/home', {filteredProject})
    }) 
})

//Project Lists
router.get('/projects', (req, res)=>{
    Projects.find({}).lean().then(projects=>{
        console.log(req.originalUrl)
res.render('home/projects', {projects})
    })
    
})


//Project detail:id
router.get('/project-detail/:id', (req, res)=>{
    Projects.findOne({_id:req.params.id}).lean().populate({path:'comment', populate:{path:'user', model:"users"}}).then(project=>{
        
    //     let filteredComment
    //   project.comment.forEach(comment=>{
    //     filteredComment = comment.comment
    //   })
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

//Mail Form
router.post('/contact-form', (req, res)=>{
  const transporter = mailer.createTransport({
    host:'smtp.mail.yahoo.com',
    port: 587,
    secure: false,
    service: 'yahoo',
    auth: {
      user: 'olayiwolaolatunjisodiq@yahoo.com',
      pass: 'zzuabfzyaubdqpgs'
    },
    debug: false,
    logger: true
  });

    
     const mailOptions = {
       from: 'olayiwolaolatunjisodiq@yahoo.com',
       to: req.body.email,
        subject:req.body.subject,
        html:
         `<p><h1>Email from: <Strong>${req.body.email}</Strong></h1>
           <br><h2>Name:${req.body.name}</h2>  <br> <p>${req.body.message} </p> </p>`
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          req.flash('message',`Message sent! ${info}. Thank you`)
        }
      });
      res.redirect('/', ) 
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
            
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
              }
              
              bcrypt.compare(password, user.password,(err, matched)=>{
                  if(err) return err
                  if(matched){
                    
                      return done(null, user, {message:"The password is incorrect"})
                     
                  }
                  else{
                        return done(null, false, {message:"The password is incorrect"})
                  }
              })
        })
    }
  ))

  passport.serializeUser(function(user, done) {
   
    done(null, user._id);
    
  });
  
  passport.deserializeUser(function(id, done) {
    Users.findById(id, function(err, user) {
      done(err, user);
    });
  })
  
//login
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', { 
        
    successRedirect: '/admin',
    failureRedirect: '/',
    failureFlash: true 
})(req, res , next)

})
//Logout
router.get('/logout',  (req, res)=>{
    req.logOut()
    res.redirect('/')
})

module.exports = router