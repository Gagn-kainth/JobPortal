const User = require('../models/User')

const handleRegister = async (req,res)=> {
    try{
        const data = req.body;
        const newUser = new User(data);
        await newUser.save();

       res
            .status(201)
            .json({
                message : 'User has registered',
                User : newUser,
            })
    }catch(error){
        console.error("Error adding User :", error);
      
        res
          .status(500)
          .json({ error: "An error occurred while adding the user ." });
    }
}




module.exports ={
    handleRegister
}