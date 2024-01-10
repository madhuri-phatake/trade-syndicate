const express = require('express');
const router = express.Router();
const CareerController = require("../controllers/career.controller");


//Popup API's
router.post('/create_career_data', CareerController.create_career_data);
router.post('/update_career_data', CareerController.update_career_data);
router.get('/get_career_data', CareerController.get_career_data);
// router.get('/get_all_career', CareerController.get_all_career);
router.delete('/delete_career_data/:career_id', CareerController.delete_career_data);



module.exports = router;