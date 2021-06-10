const config = require('../config');
const Pool = require('pg').Pool
const pool = new Pool(config);
const moment = require('moment');
const getOrders = (request, response) => {
    response.status(200).json(request.user);
    pool.query('SELECT * FROM orders ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const getOrderById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM orders WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  const getOrderByUserId = (request,response) => {
    const userid = request.user;
  
    pool.query('SELECT * FROM orders WHERE userid = $1', [userid], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }) 
  }
  const createOrder = (request, response) => {
    const { total,status } = request.body
    const userid = request.user;
    pool.query('INSERT INTO orders (total,status,userid,created,modified) VALUES ($1, $2, $3,$4,$5) RETURNING *', [total,status,userid,moment.utc().toISOString(),moment.utc().toISOString()], (error, result) => {
      if (error) {
        throw error
      }
      response.status(201).send(result.rows[0])
    })
  }
  
  const updateOrder = (request, response) => {
    const id = parseInt(request.params.id)
    const { total,status } = request.body
    pool.query(
      'UPDATE orders SET total = $1, status = $2  WHERE id = $3',
      [total,status,id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`Order modified with ID: ${id}`)
      }
    )
  }
  
  const deleteOrder = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM orders WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Order deleted with ID: ${id}`)
    })
  }
  
  
  module.exports = {
    getOrders,
    getOrderById,
    getOrderByUserId,
    createOrder,
    updateOrder,
    deleteOrder,
  }