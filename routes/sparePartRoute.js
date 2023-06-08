const express = require('express');
const router = express.Router();
const sparePartController = require('../controllers/sparePartController');
const { UserRole, verifyRole } = require('../middleware/jwtMiddleware');

// Only engineers can access to these routes
const role = UserRole.MECHANIC

// get list of all spare part
router.get('/list', verifyRole(role), sparePartController.getSparePartList);

// get a specific spare part by id
router.get('/details', verifyRole(role), sparePartController.getSparePartByIdOrCode);

// create a new spare part
router.post('/new', verifyRole(UserRole.ENGINEER), sparePartController.createNewSparePart);

// delete a specific spare part
router.delete('/delete', verifyRole(UserRole.ADMIN), sparePartController.deleteSparePart);

// update a specific spare part
router.put('/edit', verifyRole(UserRole.ENGINEER), sparePartController.updateSparePart);

module.exports = router;