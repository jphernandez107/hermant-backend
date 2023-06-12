const express = require('express');
const router = express.Router();
const constructionSiteController = require('../controllers/constructionSiteController');
const { UserRole, verifyRole } = require('../middleware/jwtMiddleware');

// Only engineers can access to these routes
const role = UserRole.ENGINEER

// get list of all site
router.get('/list', verifyRole(UserRole.MECHANIC), constructionSiteController.getSitesList);

// get a specific site by id or code
router.get('/details', verifyRole(UserRole.MECHANIC), constructionSiteController.getSiteByIdOrCode);

// create a new site
router.post('/new', verifyRole(role), constructionSiteController.postNewSite);

// delete a specific site
router.delete('/delete', verifyRole(UserRole.ADMIN), constructionSiteController.deleteSite);

// update a specific site
router.put('/edit', verifyRole(role), constructionSiteController.updateSite);

module.exports = router;