const express = require('express');
const router = express.Router();

//  Import controllers
const { createProduct, getAllProduct, updateProduct, getProduct, getCategory, createCategory, updateCategory, deleteCategory, getGraphData } = require('../controllers/productController');

//  Import middlewares
const { authN } = require('../middlewares/authN');
const { adminCheck } = require('../middlewares/authZ');

router.post('/createProduct', authN, adminCheck, createProduct);
router.get('/getAllProduct', getAllProduct);
router.post('/updateProduct', authN, adminCheck, updateProduct);
router.post('/getProduct', getProduct);

router.get('/category', getCategory);
router.post('/category', authN, adminCheck, createCategory);
router.put('/category', authN, adminCheck, updateCategory);
router.delete('/category', authN, adminCheck, deleteCategory);


router.post('/getGraphData', authN, adminCheck, getGraphData);
module.exports = router;