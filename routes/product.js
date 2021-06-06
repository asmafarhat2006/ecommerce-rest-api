const express = require('express');
const router = express.Router();
const productDB = require('../db/productqueries');



  
  router.get('/', productDB.getProducts)
  router.get('/:id', productDB.getProductById)
  router.post('/', productDB.createProduct)
  router.put('/:id', productDB.updateProduct)
  router.delete('/:id', productDB.deleteProduct)

module.exports = router;