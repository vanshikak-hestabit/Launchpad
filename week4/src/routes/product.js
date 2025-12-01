const express = require('express');
const router = express.Router();
const validate = require("../middlewares/validate");
const productSchema = require("../validators/product.validation");
const ProductController = require('../controllers/product.controller');

// GET all products (with filters, pagination, sorting)
router.get('/', ProductController.getAll);

// GET single product by ID
router.get('/:id', ProductController.getById);

// POST - create a new product
// router.post('/', ProductController.create);
router.post("/", validate(productSchema), ProductController.create);


// PUT - update product by ID
router.put('/:id', ProductController.update);

// DELETE - soft delete product by ID
router.delete('/:id', ProductController.remove);

module.exports = router;

 //This file (product.js) tells your server which URLs (endpoints) are
 //  available for products and what should happen when someone tries to access those URLs.