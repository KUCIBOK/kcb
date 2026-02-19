const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  failTransaction
} = require('../controllers/transaction.controller');
const {auth} = require('../middleware/auth')

router.post('/', auth, createTransaction);

router.get("/:id", getTransactionById);

router.delete('/:id', deleteTransaction);

router.get('/fail/:id', auth, failTransaction) 

module.exports = router;
