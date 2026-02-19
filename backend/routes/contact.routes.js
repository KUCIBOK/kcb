const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { auth } = require('../middleware/auth');

// Contacts routes
router.get('/contacts', auth, contactController.getContacts);
router.get('/contacts/stats', auth, contactController.getContactStats);
router.get('/contacts/:id', auth, contactController.getContact);
router.post('/contacts', auth, contactController.createContact);
router.put('/contacts/:id', auth, contactController.updateContact);
router.delete('/contacts/:id', auth, contactController.deleteContact);
router.post('/contacts/import', auth, contactController.importContacts);
router.post('/contacts/:id/unsubscribe', auth, contactController.unsubscribeContact);

// Lists routes
router.get('/lists', auth, contactController.getLists);
router.get('/lists/:id', auth, contactController.getList);
router.post('/lists', auth, contactController.createList);
router.put('/lists/:id', auth, contactController.updateList);
router.delete('/lists/:id', auth, contactController.deleteList);
router.post('/lists/:id/rsvp', auth, contactController.updateRSVP);

// CRM Sync routes
router.post('/sync/crm', auth, contactController.syncFromCRM);
router.post('/sync/crm/bulk', auth, contactController.bulkSyncFromCRM);
router.get('/sync/crm/:crmContactId/check', auth, contactController.checkCRMSync);

module.exports = router;
