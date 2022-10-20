const expresejslayout = require('express-ejs-layouts');
const session = require('express-session');
const { Server } = require('socket.io');
const flash = require('connect-flash');
const passport = require('passport');
const express = require('express');
const http = require('http');
const path = require('path');
const { Socket } = require('dgram');
const app = express();
const port  = 5000;


const server = http.createServer(app);
const router = express.Router();
const io = new Server(server);

app.set('view engine', 'ejs');
app.use(expresejslayout);
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
app.use(express.urlencoded({ extended: false }));
//app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));

server.listen(port, () => {
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
    req.io = io;
    next();
    })
 
app.use('/', require('./routes/index'));
app.use('/t', require('./routes/users'));

//server.listen(port, () => console.log('server started'));





