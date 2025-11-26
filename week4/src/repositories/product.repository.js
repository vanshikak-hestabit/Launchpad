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

  // Paginated products
  static async findPaginated(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const products = await Product.find().skip(skip).limit(limit);
    return products;
  }

  // Update product
  static async update(id, updateData) {
    return Product.findByIdAndUpdate(id, updateData, { new: true });
  }

  // Delete product
  static async delete(id) {
    return Product.findByIdAndDelete(id);
  }
}

module.exports = ProductRepository;
