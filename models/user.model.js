const Sequelize = require('sequelize');
const {sequelize} = require('../database');

const User = sequelize.define('users',
{
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false,
        primaryKey:true
    },
    phone:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = {
    User
};

// User.createnew = function(data)
// {
//     return new Promise((resolve,reject)=>
//     {
//         console.log('usermodel createnew');
//         User.create(data,(error,result)=>
//         {
//             if(error)
//             {
//                 reject(error)
//             }
//             else
//             {
//                 resolve(result)
//             }
//         })
//     }) 
// }