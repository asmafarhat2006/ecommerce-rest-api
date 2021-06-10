const config = require('../config');
const Pool = require('pg').Pool
const pool = new Pool(config.db);

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if(!results.rows){
      response.status(200).json('No Rows Found')  
    }
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
const loginUser = (request, response) => {
  const {email,password} = request.body;

  pool.query('SELECT id,email,password FROM users WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows[0])
  })
}
async function authenticateUser(data) {
  try {
    const {email,password} = data;
    const res = await pool.query(
      'SELECT id,email,password FROM users WHERE email = $1', [email]
    );
    return (res.rows[0]);
  } catch (err) {
    return err.stack;
  }
}


const createUser = (request, response) => {
  const { email,firstname,lastname } = request.body

  pool.query('INSERT INTO users (email,firstname,lastname) VALUES ($1, $2, $3) RETURNING email,firstname,lastname', [email,firstname,lastname], (error, result) => {
    if (error) {
      throw error
    }
    response.status(201).send(result.rows[0])
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET firstname = $1,lastname = $2, email = $3 WHERE id = $4',
    [firstname, lastname, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}


module.exports = {
  getUsers,
  getUserById,
  loginUser,
  authenticateUser,
  createUser,
  updateUser,
  deleteUser,
}