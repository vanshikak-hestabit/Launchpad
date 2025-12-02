const ProductRepository = require('../repositories/product.repository');

class ProductService {
  
  // Create a new product
  static async create(data) {
    return ProductRepository.create(data);
  }

  // Get product by ID
  static async findById(id) {
    return ProductRepository.findById(id);
  }

  // Dynamic search + filter + sort + pagination
  static async findAll(query) {
    let { page = 1, limit = 10, search, minPrice, maxPrice, sort, includeDeleted , tags} = query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filters = {};

    const includeDeletedBool = includeDeleted === 'true';
    if (!includeDeletedBool) {
    filters.deletedAt = { $exists: false }; // only non-deleted products
    }
    // Filter by price
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    // Search by name using regex (case-insensitive) with OR
    if (search) {
    const terms = search.split(',').map(term => term.trim());
    filters.$or = terms.map(term => ({ name: { $regex: term, $options: 'i' } }));
    }

    // // Search by name using regex (case-insensitive) with AND
    // if (search) {
    // const terms = search.split(',').map(term => term.trim());
    // filters.$or = terms.map(term => ({ name: { $regex: term, $options: 'i' } }));
    // }

    // Build sort object
    let sortObj = {};
    if (sort) {
      // Example: sort=price:desc,name:asc
      sort.split(',').forEach(field => {
        const [key, order] = field.split(':');
        sortObj[key] = order === 'desc' ? -1 : 1;
      });
    }

    let tagsArray = [];
    if(tags){
        tagsArray = tags.split(',').map(tag => tag.trim());
    }

    const skip = (page - 1) * limit;
    return ProductRepository.findWithQuery(filters, sortObj, skip, limit, tagsArray);
  }

  // Update product
  static async update(id, data) {
    return ProductRepository.update(id, data);
  }

  // Soft delete
  static async softDelete(id) {
    return ProductRepository.softDelete(id);
  }
}

module.exports = ProductService;
