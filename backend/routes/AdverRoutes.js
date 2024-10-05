const  express  = require('express');
const router = express.Router();

const {createAdver, getAdver, updateAdver, getAdverById, getAdvertiser} = require("../controllers/AdverCONT");

router.get("/", (req, res) => {
    res.status(200).send("You have everything installed!");
})

router.post("/createadver", createAdver);
router.get("/getadver/:id", getAdver);
router.put("/updateadver/:id", updateAdver);
router.get("/getTourist/:id" , getAdverById);
router.get("/get", getAdvertiser);

module.exports = router;