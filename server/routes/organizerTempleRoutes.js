const express = require("express");

const router = express.Router();


const organizerOnly = require("../middleware/organizerMiddleware");

const upload = require("../middleware/uploadMiddleware");


const {

addTemple,

myTemples,

updateTemple,

deleteTemple

}=require("../controllers/organizerTempleController");





// ======================
// Add Temple
// ======================

router.post(

"/",

organizerOnly,

upload.single("image"),

addTemple

);






// ======================
// My Temples
// ======================

router.get(

"/my",

organizerOnly,

myTemples

);






// ======================
// Update Temple
// ======================

router.put(

"/:id",

organizerOnly,

upload.single("image"),

updateTemple

);






// ======================
// Delete Temple
// ======================

router.delete(

"/:id",

organizerOnly,

deleteTemple

);





module.exports = router;






// ======================
// Delete Temple
// ======================

router.delete(

"/:id",

organizerOnly,

deleteTemple

);





module.exports = router;