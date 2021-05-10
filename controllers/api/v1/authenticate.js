const User = require("../../../models/Users");
const passport = require("../../../passport/passport");

const postsignup = async (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    const user = new User({username: username});
    await user.setPassword(password);
    await user.save().then(result =>{
        res.json({
            "status": "success"
        })
    }).catch(error => {
        console.log(error);
        res.json({
            "status": "error"
        })
    });
}

module.exports.postsignup = postsignup; 