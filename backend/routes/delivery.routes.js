const express = require('express')
const router = express.Router()
const {auth, admin} = require('../middleware/auth')
const {createDeliveryRequest, deleteDeliveryRequest, failDeliveryPayment, payForDelivery, getAllDeliveryRequest, getDeliveryRequestById, getDeliveryRequestByUser, changeDeliveryStatus} = require('../controllers/delivery.controller')

router.post('/', auth, createDeliveryRequest)

router.get('/', auth, admin, getAllDeliveryRequest)

router.get('/my', auth, getDeliveryRequestByUser)

router.get('/:id', auth, getDeliveryRequestById)

router.get('/pay/:id', auth, payForDelivery)
router.get('/fail/:id', auth, failDeliveryPayment)

//Admin actions
router.patch('/:id', admin, changeDeliveryStatus)
router.delete('/:id', admin, deleteDeliveryRequest)

module.exports = router