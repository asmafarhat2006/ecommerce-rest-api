const express = require('express');
const router = express.Router();
const userDB  = require('../db/userqueries')



  router.get('/', userDB.getUsers)
  router.get('/:id', userDB.getUserById)
  router.post('/register', userDB.createUser)
  router.put('/:id', userDB.updateUser)
  router.delete('/:id', userDB.deleteUser)

module.exports = router;