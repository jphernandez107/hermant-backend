const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');

// get list of all equipment
router.get('/list', equipmentController.getEquipmentsList);

// get a specific equipment by id or code
router.get('/details', equipmentController.getEquipmentByIdOrCode);

// create a new equipment
router.post('/new', equipmentController.postNewEquipment);

// delete a specific equipment
router.delete('/delete', equipmentController.deleteEquipment);

// update a specific equipment
router.put('/edit', equipmentController.updateEquipment);

// add use hours to equipment
router.post('/hours', equipmentController.addUseHours)

// // add lubrication sheet to a specific equipment
// router.put('/lubricationsheet/add', equipmentController.addLubricationSheetToEquipment);

module.exports = router;