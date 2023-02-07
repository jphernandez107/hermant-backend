const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

// // get list of all spare part
// router.get('/list', maintenanceController.get);

// // get a specific spare part by id
// router.get('/details', maintenanceController.);

// create a new spare part
router.post('/new', maintenanceController.createMaintenance);

// // delete a specific spare part
// router.delete('/delete', maintenanceController.deleteMaintenance);

// // update a specific spare part
// router.put('/edit', maintenanceController.updateMaintenance);

module.exports = router;