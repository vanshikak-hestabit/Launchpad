const express = require('express');
const ProductRepository = require('../repositories/product.repository');

const router = express.Router();

// POST /api/products → create a new product
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const product = await ProductRepository.create(data);
    res.json({
      message: 'Product created successfully!',
      product
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
