const Product = require('../models/Product');

class ProductRepository {
  // Create new product
  static async create(productData) {
    const product = new Product(productData);
    return product.save();
  }

  // Find product by ID
  static async findById(id) {
    return Product.findById(id);
  }

  // Dynamic query with filters, sort, pagination
  static async findWithQuery(filters = {}, sortObj = {}, skip = 0, limit = 10, tags = []) {
    const query = {...filters};

    if (tags.length > 0){
      query.tags = { $in: tags};
    }
    return Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);
  }

  // Update product
  static async update(id, updateData) {
    return Product.findByIdAndUpdate(id, updateData, { new: true });
  }

  // Soft delete: mark deletedAt timestamp
  static async softDelete(id) {
    return Product.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
  }
}

module.exports = ProductRepository;

// controller asks to perform operation on DB -> this file interacts with DB -> returns to controller
// middle layer between controller and DB