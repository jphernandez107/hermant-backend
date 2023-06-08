const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { UserRole, verifyRole } = require('../middleware/jwtMiddleware');

// Only engineers can access to these routes
const role = UserRole.MECHANIC

// // get list of all spare part
// router.get('/list', maintenanceController.get);

// // get a specific spare part by id
// router.get('/details', maintenanceController.);

// create a new spare part
router.post('/new', verifyRole(role), maintenanceController.createMaintenance);

// // delete a specific spare part
// router.delete('/delete', maintenanceController.deleteMaintenance);

// // update a specific spare part
// router.put('/edit', maintenanceController.updateMaintenance);

module.exports = router;