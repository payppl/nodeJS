const express = require('express');
const router  = express.Router();
const {ensureAuth} = require('../config/auth');

router.get('/', (req,res) =>{
    if(req.session.isAuthenticated) { 
        res.render('index', {
            user: req.session.username
        }); 
    } else {
        res.render('index', {
            user: null
        });
    }
});

router.get('/login', (req,res)=> {
    res.render('login');
});
router.get('/register', (req,res)=> {
    res.render('register');
});
router.get('/chat', ensureAuth,(req,res)=> {
    res.render('chat');
});

router.get('/dashboard', ensureAuth,(req,res)=> {
    res.render('dashboard', {
        user: req.session.username,
        email: req.session.email,
        password: req.session.password
    });
});

module.exports = router;