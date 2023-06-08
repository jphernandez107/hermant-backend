const express = require('express');
const router = express.Router();
const lubricationSheetController = require('../controllers/lubricationSheetController');
const { UserRole, verifyRole } = require('../middleware/jwtMiddleware');

// Only engineers can access to these routes
const role = UserRole.MECHANIC

// get list of all lubrication sheet
router.get('/list', verifyRole(role), lubricationSheetController.getLubricationSheetList);

// get a specific lubrication sheet by id
router.get('/details', verifyRole(role), lubricationSheetController.getLubricationSheetById);

// get a specific lubrication sheet by id
router.get('/equipment', verifyRole(role), lubricationSheetController.getLubricationSheetByEquipmentCode);

// create a new lubrication sheet
router.post('/new', verifyRole(UserRole.ENGINEER), lubricationSheetController.createNewLubricationSheet);

// delete a specific lubrication sheet
router.delete('/delete', verifyRole(UserRole.ADMIN), lubricationSheetController.deleteLubricationSheetById);

// find or create a lubrication sheet and add spare parts to it
router.post('/sparepart/add', verifyRole(UserRole.ENGINEER), lubricationSheetController.addSparePartToLubricationSheet);

module.exports = router;