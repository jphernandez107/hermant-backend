const express = require('express');
const router = express.Router();
const sparePartController = require('../controllers/sparePartController');

// get list of all spare part
router.get('/list', sparePartController.getSparePartList);

// get a specific spare part by id
router.get('/details', sparePartController.getSparePartByIdOrCode);

// create a new spare part
router.post('/new', sparePartController.createNewSparePart);

// delete a specific spare part
router.delete('/delete', sparePartController.deleteSparePart);

// update a specific spare part
router.put('/edit', sparePartController.updateSparePart);

module.exports = router;