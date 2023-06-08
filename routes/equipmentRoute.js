const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { UserRole, verifyRole } = require('../middleware/jwtMiddleware');

// Only engineers can access to these routes
const role = UserRole.ENGINEER

// get list of all equipment
router.get('/list', verifyRole(UserRole.MECHANIC), equipmentController.getEquipmentsList);

// get a specific equipment by id or code
router.get('/details', verifyRole(UserRole.MECHANIC), equipmentController.getEquipmentByIdOrCode);

// create a new equipment
router.post('/new', verifyRole(role), equipmentController.postNewEquipment);

// delete a specific equipment
router.delete('/delete', verifyRole(UserRole.ADMIN), equipmentController.deleteEquipment);

// update a specific equipment
router.put('/edit', verifyRole(role), equipmentController.updateEquipment);

// add use hours to equipment
router.post('/hours', verifyRole(role), equipmentController.addUseHours)

// // add lubrication sheet to a specific equipment
// router.put('/lubricationsheet/add', equipmentController.addLubricationSheetToEquipment);

module.exports = router;