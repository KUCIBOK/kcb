const express = require('express');
const router = express.Router();
const nRC = require('../controllers/numerisation.controller');
const {auth, admin} = require('../middleware/auth');

router.post('/', auth, nRC.createNumerisationRequest)
router.get('/', auth, admin, nRC.getNumerisationRequests)
router.get('/my', auth, nRC.getMyNumerisationRequests)
router.put('/:id/status', auth, admin, nRC.updateNumerisationRequestStatus)
router.put('/:id', auth, nRC.updateNumerisationRequest)
router.delete('/:id', auth, admin, nRC.deleteNumerisationRequest)


module.exports = router