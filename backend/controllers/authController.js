const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const otherModel = require('../models/Other'); 
const Tourist = require('../models/Tourist'); 

const JWT_SECRET = "123@abc$in"; 

const createUser = async (req, res) => {
    const { UserName, Email, Password, AccountType, MobileNumber, Nationality, DateOfBirth, Job } = req.body;

    if (!UserName || !Email || !Password || !AccountType) {
        return res.status(400).json({ error: "All fields are required." });
    }

    let userData = {
        UserName,
        Email,
        Password,
        AccountType,
    };

    if (AccountType === 'Tourist') {
        if (!MobileNumber || !Nationality || !DateOfBirth || !Job) {
            return res.status(400).json({ error: "All tourist-specific fields are required." });
        }

        userData.MobileNumber = MobileNumber;
        userData.Nationality = Nationality;
        userData.DateOfBirth = DateOfBirth;
        userData.Job = Job;
        userData.Wallet = 0; 
    } else {
      
        if (!req.files || !req.files.IDDocument) {
            return res.status(400).json({ error: "IDDocument is required for Other account types." });
        }

        const IDDocument = req.files.IDDocument[0].path; 
        const Certificates = req.files.Certificates ? req.files.Certificates[0].path : null; 
        const TaxationRegistryCard = req.files.TaxationRegistryCard ? req.files.TaxationRegistryCard[0].path : null; 

        userData.IDDocument = IDDocument;
        userData.Certificates = Certificates;
        userData.TaxationRegistryCard = TaxationRegistryCard;
    }

    try {
       
        const salt = await bcrypt.genSalt(10);
        userData.Password = await bcrypt.hash(Password, salt);

    
        let user;
        if (AccountType === 'Tourist') {
            user = await Tourist.create(userData);
        } else {
            user = await otherModel.create(userData);
        }

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(400).json({ error: error.message });
    }
};


const loginHandler = async (req, res) => {
    const { Email, Password } = req.body;

    try {
        console.log("Login attempt for email:", Email);
       
        let user = await Tourist.findOne({ Email });

        if (!user) {
            user = await otherModel.findOne({ Email });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, userType: user.AccountType }, JWT_SECRET);
        res.status(200).json({ token, userType: user.AccountType });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createUser, loginHandler };
