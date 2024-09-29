const tourismGovernerTag = require('../models/tourismGovernerTags');

// CRUD operations
const createTags= async(req,res) => {
   //add a new user to the database with 
   //Name, Email and Age
   const { name, type, historicalPeriod, description, tags } = req.body;
   try{
       const user =await tourismGovernerTag.create({ name,type,historicalPeriod,description,tags,});
       return res.status(200).json(user);

  }

   catch(error)
   {
      console.log(error);
      return res.status(500).json({message:'server error'}); 
   }
   
}
const readGuide =async (req, res) => {
    try{
       
        const schemas = await tourismGovernerTag.find();
        res.status(200).json(schemas)

    }catch(err){
        res.status(500).json({ message: err.message });
    }
};


module.exports= {
    createTags,
    readGuide
};