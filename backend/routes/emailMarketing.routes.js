const express = require('express');
const router = express.Router();
const emailMarketingController = require('../controllers/emailMarketing.controller');
const { auth } = require('../middleware/auth');

// Templates routes
router.get('/templates', auth, emailMarketingController.getTemplates);
router.get('/templates/:id', auth, emailMarketingController.getTemplate);
router.post('/templates', auth, emailMarketingController.createTemplate);
router.put('/templates/:id', auth, emailMarketingController.updateTemplate);
router.delete('/templates/:id', auth, emailMarketingController.deleteTemplate);

// Drafts routes
router.get('/drafts', auth, emailMarketingController.getDrafts);
router.get('/drafts/:id', auth, emailMarketingController.getDraft);
router.post('/drafts', auth, emailMarketingController.createDraft);
router.put('/drafts/:id', auth, emailMarketingController.updateDraft);
router.delete('/drafts/:id', auth, emailMarketingController.deleteDraft);
router.post('/drafts/:id/duplicate', auth, emailMarketingController.duplicateDraft);

// Merge tags
router.get('/merge-tags', auth, emailMarketingController.getMergeTags);

module.exports = router;