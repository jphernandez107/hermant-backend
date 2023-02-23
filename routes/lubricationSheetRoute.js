const express = require('express');
const router = express.Router();
const lubricationSheetController = require('../controllers/lubricationSheetController');

// get list of all lubrication sheet
router.get('/list', lubricationSheetController.getLubricationSheetList);

// get a specific lubrication sheet by id
router.get('/details', lubricationSheetController.getLubricationSheetById);

// get a specific lubrication sheet by id
router.get('/equipment', lubricationSheetController.getLubricationSheetByEquipmentCode);

// create a new lubrication sheet
router.post('/new', lubricationSheetController.createNewLubricationSheet);

// delete a specific lubrication sheet
router.delete('/delete', lubricationSheetController.deleteLubricationSheetById);

// find or create a lubrication sheet and add spare parts to it
router.post('/sparepart/add', lubricationSheetController.addSparePartToLubricationSheet);

module.exports = router;