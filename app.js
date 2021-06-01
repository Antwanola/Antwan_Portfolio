const Express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const hsbr = require('express-handlebars')
const fileUpload = require('express-fileupload')
const methodOverride = require('method-override')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const { mongoDbUrl } = require('./config/dev-db')
const app = Express()
const {select, timeFormater, pathDetector} = require('./helpers/handlebar-helper')



//Passport config
// require('./config/passport')(passport)





var Handlebars = require("handlebars");
var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);


mongoose.Promise = global.Promise
mongoose.connect(mongoDbUrl, { useNewUrlParser: true }).then(db=>{
    console.log(' Server Connected')
})
.catch(err=>{
    console.log(err)
})





// serving files as static
app.use(Express.static(path.join(__dirname, 'public')))


// Set view engine
app.engine('handlebars', hsbr({defaultLayout: 'main', helpers:{select, timeFormater, pathDetector}}));
app.set('view engine', 'handlebars');



//Upload
app.use(fileUpload())


//Body

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());


//Method
app.use(methodOverride('_method'));



//Session
app.use(cookieParser());
app.use(session({

    secret: 'itsasecrete',
    resave: true,
    saveUninitialized: true

}));
// PASSPORT

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());




//Local flash
app.use((req, res, next)=>{
res.locals.url = req.originalUrl,
res.locals.host = req.get('host')
res.locals.user = req.user || null,
res.locals.message = req.flash('message')
res.locals.home_message = req.flash('home_message')
res.locals.error= req.flash('error')

next()
})




const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
app.use('/', home)
app.use('/admin', admin)




const port = process.env.PORT || 4600;

app.listen(port, ()=>{

console.log(`listening on port 4600`);

});