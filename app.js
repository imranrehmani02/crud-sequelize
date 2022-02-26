
//init code
//require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const userRouter = require('./routers/user.router');
const {db,sequelize} = require('./database');

const app = express();
const port = 2021 || process.env.PORT;

const init = async()=>
{
    await db.sequelize.sync({force:false});
    console.log('Tables have synced');
}
init();

app.set('view engine','ejs')
app.set(express.static(path.join(__dirname,'views')))

//middleware setup
app.use(morgan('dev'));
app.use(cors());
app.use('/user',userRouter);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

//default router
app.all('/',
function(req,res)
{
    res.render('home')
});

// start server
app.listen(port,()=>console.log(port+' running...'));