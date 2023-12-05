const express = require('express');
const router = express.Router();
const handler = require('./handler');

router.get('/users', handler.getUsers);
router.post('/users', handler.createUser);

module.exports = router;
