const session = require('express-session');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const expresejslayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const path = require('path');
const app = express();
const port  = 5000;

app.set('view engine', 'ejs');
app.use(expresejslayout);
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.urlencoded({ extended: false }));
//app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));

app.listen(port, () => {
    console.log(`now listening on port ${port}`);
    console.log(`http://127.0.0.1:5000`);
});
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
    })

    
app.use('/', require('./routes/index'));
app.use('/t', require('./routes/users'));





