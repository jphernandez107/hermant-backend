const express = require('express');
const router = express.Router();
const constructionSiteController = require('../controllers/constructionSiteController');

// get list of all site
router.get('/list', constructionSiteController.getSitesList);

// get a specific site by id or code
router.get('/details', constructionSiteController.getSiteByIdOrCode);

// create a new site
router.post('/new', constructionSiteController.postNewSite);

// delete a specific site
router.delete('/delete', constructionSiteController.deleteSite);

// update a specific site
router.put('/edit', constructionSiteController.updateSite);

// add equipment to site
router.put('/equipment/add', constructionSiteController.addEquipmentToSite)

// remove equipment from site
router.put('/equipment/remove', constructionSiteController.removeEquipmentFromSite)

module.exports = router;