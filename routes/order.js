const express = require('express');
const router = express.Router();
const orderDB = require('../db/orderqueries');
const orderItemDB = require('../db/orderitemqueries');



 
  router.get('/', orderDB.getOrders)
  router.get('/:id', orderDB.getOrderById)
  router.get('/mine', orderDB.getOrderByUserId)
  router.post('/mine/create', orderDB.createOrder)
  router.put('/:id', orderDB.updateOrder)
  router.delete('/:id', orderDB.deleteOrder)

module.exports = router;