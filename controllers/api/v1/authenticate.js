const User = require("../../../models/Users");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

const emailauth = (req, res, next) => {
    let emaildb = req.body.email;
    let number;

    User.find({email: emaildb}, (err, docs) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(docs);
            number = docs.length;
            // return number;
            
            console.log(number);

            if(number !== 0){
                res.json({
                    "status": "error"
                })
            }
            else{
                res.json({
                    "status": "sucess"
                })
            }
        }
    });
    
}

const postsignup = async (req, res, next) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let password = req.body.password;

    const user = new User({firstname: firstname, lastname: lastname, email: email}); 
    await user.setPassword(password);
    await user.save().then(result =>{
        // console.log(result._id);
        console.log(result.email);

        let token = jwt.sign({
            // uid: result._id,
            email: result.email
        }, "Gardensecret");

        res.json({
            "status": "success",
            "data": {
                "token": token
            }
        })
    }).catch(error => {
        res.json({
            "status": "error",
            "message": error
        })
        console.log(error);
    });
}

const postlogin = async (req, res, next) => {
    console.log(req.body.email, req.body.password);

    const user = await User.authenticate()(req.body.email, req.body.password).then(result => {

        if(!result.user){
            return res.json({
                "status": "failed",
                "message": "Login failed"
            })
        }
        let token = jwt.sign({
            uid: result.user._id,
            email: result.user.email
        }, "Gardensecret");
        
        return res.json({
            "status": "success",
            "data": {
                "token": token
            }
        });
    }).catch(error => {
        res.json({
            "status": "error",
            "message": error
        })
    });
} 

module.exports.postsignup = postsignup; 
module.exports.postlogin = postlogin;
module.exports.emailauth = emailauth;