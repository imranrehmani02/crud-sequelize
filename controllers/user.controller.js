
//init code
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const {User} = require('./../models/user.model');


//signup user
signup = async (req, res) => {
    try {
        //check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: 'Form Validation error',
                data: errors.array()
            });
        }
        //hash password code
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);

        //create new user model
        var temp = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: hashedPassword
            }

        //await User.createuser(temp)
        await User.create(temp)
            .then((result) => {
                // if everyyhing ok..
                return res.status(200).json({
                    staus: true,
                    message: 'DB insert successful',
                    data: result
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    status: false,
                    message: 'DB insert failed',
                    data: error
                });
            })
    }
    catch (error) {
        return res.status(400).json({
            staus: false,
            message: 'DB insert error',
            data: error
        });
    }
}


//login router for user 
login = async (req, res) => {
    try {
        //check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: 'Form Validation error',
                data: errors.array()
            });
        }

        //check email exist or not
        await User.findOne(
            {where:{ email: req.body.email }}
        )
            .then((result) => {

                //when result variable contains document
                //match password
                const isMatch = bcrypt.compareSync(req.body.password, result.password);

                //check password is match
                if(isMatch) {
                   //password matched
                   req.session.email = result.email;
                   console.log('session email : ', req.session.email);
                   res.redirect('/user/userhome')
                }
                else {
                     //password not match
                     return res.status(500).json({
                        status: false,
                        message: 'password not match',
                        data:error
                    });
                }
            })
            .catch((error) => {
                //user mail dont exist
                return res.status(500).json(
                    {
                        status: false,
                        message: 'user don\'t exist',
                        data:error
                    }
                );
            })

    }
    catch (error) {
        return res.status(400).json({
            staus: false,
            message: 'User login error',
            data:error
        });
    }
}

//show user
userhome = async (req, res) => {
    try {
        if (req.session.email) {
            await User.findAll()
                .then((result) => {
                    res.render('userhome', { result: result, email: req.session.email })
                })

                .catch((error) => {
                    res.render('userhome', { result: [], email: req.session.email })
                })
        }
        else {
            res.redirect('/user/login')
        }
    }
    catch (error) {
        return res.status(400).json({
            staus: false,
            message: 'DB show data error',
            data: error
        });
    }
}

//delete user
remove = async (req, res) => {
    try {
        await User.destroy(
            {where:{ email: req.query.email }}
        )
            .then((result) => {
                res.redirect('/user/userhome')
            })
    }
    catch (error) {
        return res.status(400).json({
            staus: false,
            message: 'delete query error',
            data: error
        });
    }
}

//update user
update = async (req, res) => {
    try {
        await User.update(
            {
                name: req.body.name,
                phone: req.body.phone
            },
            {
                where: {
                    email: req.body.email 
                }
            }
        )
            .then((result) => {
                res.redirect('/user/userhome')
            })
            .catch((error) => {
                return res.status(400).json({
                    staus: false,
                    message: 'update query failed',
                    data: error
                });
              })
    }
    catch (error) {
        return res.status(400).json({
            staus: false,
            message: 'update query error',
            data: error
        });
    }
}


//module.exports
module.exports = {
    signup,
    login,
    userhome,
    remove,
    update
}