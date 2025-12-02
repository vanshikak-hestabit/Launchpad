// /controllers/product.controller.js
const ProductService = require('../services/product.service');

// GET /products
async function getAll(req, res, next) {
  try {
    // read query params and pass to service (service will parse/validate)
    const query = { ...req.query };
    const result = await ProductService.findAll(query);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err); // pass to centralized error middleware
  }
}

// GET /products/:id
async function getById(req, res, next) {
  try {
    const id = req.params.id;
    const product = await ProductService.findById(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

// POST /products
async function create(req, res, next) {
  try {
    const payload = req.body;
    const created = await ProductService.create(payload);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

// PUT /products/:id
async function update(req, res, next) {
  try {
    const id = req.params.id;
    const payload = req.body;
    const updated = await ProductService.update(id, payload);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

// DELETE /products/:id  (soft delete)
async function remove(req, res, next) {
  try {
    const id = req.params.id;
    await ProductService.softDelete(id);
    res.json({ success: true, message: 'Product soft-deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};

//it handles the HTTP req from clients(postman, browser)
// it calls the service layer to perform actions and then sends the 
//response back to client
// it takes the request-> do logic-> return response
// uses repository to get data from DB