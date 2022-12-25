const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signup = async (req, res)=>{
    const {name, email, password, isOwner=false} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 5)
        const newUser = await UserModel.create({ name, email, password: hashedPassword, isOwner })
        //res.send({ status: 'success', user: newUser })
        res.redirect('/login');
    }catch(err){
        res.status(500).send({ status: 'error', err: err })
    }
}

const login = async (req, res)=>{
    const { email, password } = req.body;
    try{
        const user = await UserModel.findOne({ email })

        if (!user) {
            res.status(401).send({ status: 'error', msg: "Invalid User" })
        } else {
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                res.status(401).send({ status: 'error', msg: "Invalid Password" })
            }
            const userPayload = { _id: user._id, email: user.email, name: user.name, isOwner: user.isOwner};
            const token = jwt.sign(userPayload, process.env.JWT_SECRET_KEY, { algorithm: 'HS384', expiresIn: '1d' })
            console.log(token);

            res.cookie('jwt', token)
            //res.send({ status: 'success', user, token });
            if(user.isOwner === "true"){
                res.redirect('/propertylisting');
            }else{
                res.redirect('/booking');
            }
            
        }
    }catch(err){
        res.status(500).send({ status: 'error', err: err })
    }
}

const logout = async (req, res) =>{
    res.clearCookie('jwt');
    //res.send({status:'success', msg:"Logged out successfully"});
    res.redirect('/sydney');
}

module.exports = {
    signup,login,logout
}