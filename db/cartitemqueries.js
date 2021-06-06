const config = require('../config');
const Pool = require('pg').Pool
const pool = new Pool(config.db);

const getCartItemsByCartId = (request, response) => {
    const cartid = parseInt(request.params.cartid)
  
         // Generate SQL statement
      const statement = 'SELECT ci.qty,ci.id AS cartItemId, p.* FROM cartItems ci '+
                        'INNER JOIN products p ON p.id = ci.productId '+
                        'WHERE cartId = $1';
     pool.query(statement, [cartid], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const createCartItem = (request, response) => {
    
    const productId = request.body.productid;
    const qty = request.body.qty || 1;
    const cartid = request.body.cartid || null;
    
    pool.query('INSERT INTO cartitems (cartid,productid,qty) VALUES ($1, $2, $3) RETURNING *', [cartid,productid,qty], (error, result) => {
      if (error) {
        throw error
      }
      response.status(201).send(result.rows[0])
    })
  }
  const updateCartItem = (request, response) => {
    const id = parseInt(request.params.id)
    const { qty } = request.body
    pool.query(
      'UPDATE cartitems SET qty = $1  WHERE id = $2',
      [qty,id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`Cart Item modified with ID: ${id}`)
      }
    )
  }
  
  const deleteCartItem = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM cartitems WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Cart Item deleted with ID: ${id}`)
    })
  }
  
  
  
  module.exports = {
 createCartItem,
 getCartItemsByCartId,
 updateCartItem,
 deleteCartItem
  }