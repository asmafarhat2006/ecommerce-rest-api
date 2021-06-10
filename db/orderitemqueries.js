const config = require('../config');
const Pool = require('pg').Pool
const pool = new Pool(config);
const moment = require('moment');

const getOrderItemsByOrderId = (request, response) => {
    const orderid = parseInt(request.params.orderid)
  
         // Generate SQL statement
      const statement = 'SELECT oi.qty,oi.id AS cartItemId, p.* FROM orderItems oi INNER JOIN products p ON p.id = oi.productid WHERE orderId = $1';
     pool.query(statement, [orderid], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const createOrderItem = (request, response) => {
    
    const created = moment.utc().toISOString();
    const description = request.body.description;
    const  modified = moment.utc().toISOString();
    const  name = request.body.name;
    const price = request.body.price || 0;
    const productId = request.body.productid;
    const qty = request.body.qty || 1;
    const orderId = request.body.orderId || null;
    
    pool.query('INSERT INTO orderitem (created,description,modified,name,price,productid,qty,orderid) VALUES ($1, $2, $3,$4,$5,$6,$7,$8) RETURNING *', [created,description,modified,name,price,productid,qty,orderid], (error, result) => {
      if (error) {
        throw error
      }
      response.status(201).send(result.rows[0])
    })
  }
  
  
  
  module.exports = {
 createOrderItem,
 getOrderItemsByOrderId
  }