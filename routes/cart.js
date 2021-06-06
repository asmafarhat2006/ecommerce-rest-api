const express = require('express');
const router = express.Router();
const cartDB = require('../db/cartqueries');
const cartItemDB = require('../db/cartitemqueries');



 
  router.get('/mine', cartDB.getCartByUserId)
  router.get('/mine/create', cartDB.createCart)
  router.get('/:id',cartDB.getCartById)
  router.get('/mine/items', cartItemDB.getCartItemsByCartId)
  router.post('/mine/items', cartItemDB.createCartItem)
  router.put('/:id', cartItemDB.updateCartItem)
  router.delete('/:id',cartItemDB.deleteCartItem)

module.exports = router;