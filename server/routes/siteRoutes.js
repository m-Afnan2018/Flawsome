const express = require('express');
const router = express.Router();


const { getSiteData, addSiteData, updateSiteData, updateSiteArrangements } = require('../controllers/siteController');
const { authN } = require('../middlewares/authN');

const { adminCheck } = require('../middlewares/authZ');


//  Get all site data
router.get('/getSiteData', getSiteData);
//  Add site data
router.post('/addSiteData', authN, adminCheck, addSiteData);
//  Update site data
router.put('/updateSiteData', authN, adminCheck, updateSiteData);
//  Update site arrangements
router.put('/updateSiteArrangements', authN, adminCheck, updateSiteArrangements);


module.exports = router;