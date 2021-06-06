const config = require('../config');
const Pool = require('pg').Pool
const pool = new Pool(config.db);
const moment = require('moment');
  
  const getCartById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM carts WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  const getCartByUserId = (request,response) => {
    const userid = request.user;
  
    pool.query('SELECT * FROM carts WHERE userid = $1', [userid], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }) 
  }
  const createCart = (request, response) => {
    const { total,status } = request.body
    const userid = request.user;
    pool.query('INSERT INTO carts (userid,created,modified) VALUES ($1, $2, $3) RETURNING *', [userid,moment.utc().toISOString(),moment.utc().toISOString()], (error, result) => {
      if (error) {
        throw error
      }
      response.status(201).send(result.rows[0])
    })
  }
  
 
  
  
  module.exports = {
    
    getCartById,
    getCartByUserId,
    createCart
  }