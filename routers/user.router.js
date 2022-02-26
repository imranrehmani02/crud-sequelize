const router = require('express').Router()
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const {signup, login, userhome, remove, update} = require('../controllers/user.controller');


//middleware setup

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended:true}));
router.use(cookieParser());
router.use(session({secret:'secret123'}))

router.get('/signup',(req,res)=>
{
    res.render('usersignup')
})


router.get('/login',(req,res)=>
{
    res.render('userlogin')
})

router.post('/signup',
[
    check('name').not().isEmpty().trim().escape(),
    check('email').normalizeEmail().isEmail(),
    check('phone').not().isEmpty().trim().escape(),
    check('password').not().isEmpty().trim().escape()
],
signup);

router.post('/login',
[
    check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty().trim().escape()
],
login);

router.get('/userhome',userhome)

router.get('/remove',remove)

router.get('/update',(req,res)=>
{
    res.render('update',{
        name:req.query.name,
        email : req.query.email,
        phone : req.query.phone
    })
})

router.post('/update',update)


//logout
router.get('/logout',(req,res)=>
{
    req.session.destroy(function()
    {
        console.log('user logged out');
    })
    res.redirect('/user/login')
})

module.exports = router