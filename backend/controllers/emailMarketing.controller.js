const mongoose = require('mongoose');
const EmailTemplate = require('../models/EmailTemplate');
const EmailDraft = require('../models/EmailDraft');
const createError = require('http-errors');

// Default templates for new professionals
const DEFAULT_TEMPLATES = [
  {
    name: 'Nouvelle Exposition',
    description: 'Annoncez vos nouvelles expositions',
    category: 'exhibition',
    isDefault: true,
    isPublic: true,
    content: {
      blocks: [
        { id: 'hero1', type: 'hero', content: { title: 'Nouvelle Exposition', subtitle: 'Venez découvrir nos nouvelles œuvres' }, styles: {} },
        { id: 'text1', type: 'text', content: { html: '<p>Chers collectionneurs,</p><p>Nous avons le plaisir de vous annoncer notre nouvelle exposition...</p>' } },
        { id: 'btn1', type: 'button', content: { text: 'Voir l\'exposition', url: '#' } },
        { id: 'footer1', type: 'footer', content: { text: '© 2024 Votre Galerie' } }
      ],
      theme: { primaryColor: '#4F46E5', backgroundColor: '#FFFFFF', textColor: '#1F2937' }
    },
    mergeTags: ['FirstName', 'LastName', 'Email']
  },
  {
    name: 'Newsletter Mensuelle',
    description: 'Mise à jour mensuelle de la galerie',
    category: 'newsletter',
    isDefault: true,
    isPublic: true,
    content: {
      blocks: [
        { id: 'header1', type: 'header', content: { logo: '', text: 'Newsletter Mensuelle' } },
        { id: 'text1', type: 'text', content: { html: '<h2>Bonjour {FirstName},</h2><p>Voici les nouvelles de ce mois...</p>' } },
        { id: 'divider1', type: 'divider', content: {} },
        { id: 'footer1', type: 'footer', content: { text: 'Se désabonner | Mettre à jour mes préférences' } }
      ],
      theme: { primaryColor: '#059669', backgroundColor: '#F9FAFB', textColor: '#374151' }
    },
    mergeTags: ['FirstName', 'LastName']
  }
];

// ✅ Get all templates for professional
exports.getTemplates = async (req, res, next) => {
  try {
    const professionalId = req.user._id;
    const { category, search } = req.query;

    let query = {
      $or: [
        { professionalId },
        { isPublic: true }
      ]
    };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const templates = await EmailTemplate.find(query)
      .sort({ isDefault: -1, createdAt: -1 })
      .limit(50);

    res.status(200).json(templates);
  } catch (error) {
    next(createError.internal(error.message));
  }
};

// ✅ Get single template
exports.getTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const template = await EmailTemplate.findById(id);

    if (!template) {
      return next(createError.notFound('Template not found'));
    }

    if (template.professionalId.toString() !== req.user._id.toString() && !template.isPublic) {
      return next(createError.forbidden('Access denied'));
    }

    res.status(200).json(template);
  } catch (error) {
    next(createError.internal(error.message));
  }
};

// ✅ Create template
exports.createTemplate = async (req, res, next) => {
  try {
    const professionalId = req.user._id;
    const { name, description, category, content, mergeTags, isPublic } = req.body;

    const template = new EmailTemplate({
      name,
      description,
      category: category || 'custom',
      professionalId,
      content,
      mergeTags: mergeTags || ['FirstName', 'LastName'],
      isPublic: isPublic || false,
      isDefault: false
    });

    await template.save();
    res.status(201).json(template);
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Update template
exports.updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const template = await EmailTemplate.findById(id);

    if (!template) {
      return next(createError.notFound('Template not found'));
    }

    if (template.professionalId.toString() !== req.user._id.toString()) {
      return next(createError.forbidden('Access denied'));
    }

    if (template.isDefault) {
      return next(createError.badRequest('Cannot edit default templates'));
    }

    Object.assign(template, updates);
    template.updatedAt = new Date();
    await template.save();

    res.status(200).json(template);
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Delete template
exports.deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const template = await EmailTemplate.findById(id);

    if (!template) {
      return next(createError.notFound('Template not found'));
    }

    if (template.professionalId.toString() !== req.user._id.toString()) {
      return next(createError.forbidden('Access denied'));
    }

    if (template.isDefault) {
      return next(createError.badRequest('Cannot delete default templates'));
    }

    await EmailTemplate.deleteOne({ _id: id });
    res.status(200).json({ message: 'Template deleted' });
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Get all drafts
exports.getDrafts = async (req, res, next) => {
  try {
    const professionalId = req.user._id;
    const { status } = req.query;

    let query = { professionalId };
    if (status) {
      query.status = status;
    }

    const drafts = await EmailDraft.find(query)
      .populate('templateId', 'name')
      .sort({ updatedAt: -1 })
      .limit(50);

    res.status(200).json(drafts);
  } catch (error) {
    next(createError.internal(error.message));
  }
};

// ✅ Get single draft
exports.getDraft = async (req, res, next) => {
  try {
    const { id } = req.params;
    const draft = await EmailDraft.findById(id).populate('templateId');

    if (!draft) {
      return next(createError.notFound('Draft not found'));
    }

    if (draft.professionalId.toString() !== req.user._id.toString()) {
      return next(createError.forbidden('Access denied'));
    }

    res.status(200).json(draft);
  } catch (error) {
    next(createError.internal(error.message));
  }
};

// ✅ Create draft
exports.createDraft = async (req, res, next) => {
  try {
    const professionalId = req.user._id;
    const { name, subject, preheader, templateId, content } = req.body;

    let finalContent = content;
    if (templateId) {
      const template = await EmailTemplate.findById(templateId);
      if (template) {
        finalContent = template.content;
        template.usageCount = (template.usageCount || 0) + 1;
        await template.save();
      }
    }

    const draft = new EmailDraft({
      name,
      subject,
      preheader,
      templateId,
      professionalId,
      content: finalContent || {
        blocks: [],
        theme: { primaryColor: '#4F46E5', backgroundColor: '#FFFFFF', textColor: '#1F2937' }
      },
      status: 'draft'
    });

    await draft.save();
    res.status(201).json(draft);
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Update draft
exports.updateDraft = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const draft = await EmailDraft.findById(id);

    if (!draft) {
      return next(createError.notFound('Draft not found'));
    }

    if (draft.professionalId.toString() !== req.user._id.toString()) {
      return next(createError.forbidden('Access denied'));
    }

    if (draft.status === 'sent') {
      return next(createError.badRequest('Cannot edit sent email'));
    }

    Object.assign(draft, updates);
    draft.updatedAt = new Date();
    await draft.save();

    res.status(200).json(draft);
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Delete draft
exports.deleteDraft = async (req, res, next) => {
  try {
    const { id } = req.params;
    const draft = await EmailDraft.findById(id);

    if (!draft) {
      return next(createError.notFound('Draft not found'));
    }

    if (draft.professionalId.toString() !== req.user._id.toString()) {
      return next(createError.forbidden('Access denied'));
    }

    if (draft.status === 'sent') {
      return next(createError.badRequest('Cannot delete sent email'));
    }

    await EmailDraft.deleteOne({ _id: id });
    res.status(200).json({ message: 'Draft deleted' });
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Duplicate draft
exports.duplicateDraft = async (req, res, next) => {
  try {
    const { id } = req.params;
    const original = await EmailDraft.findById(id);

    if (!original) {
      return next(createError.notFound('Draft not found'));
    }

    if (original.professionalId.toString() !== req.user._id.toString()) {
      return next(createError.forbidden('Access denied'));
    }

    const duplicate = new EmailDraft({
      name: `${original.name} (Copy)`,
      subject: original.subject,
      preheader: original.preheader,
      professionalId: original.professionalId,
      content: original.content,
      status: 'draft'
    });

    await duplicate.save();
    res.status(201).json(duplicate);
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Get merge tags available
exports.getMergeTags = async (req, res, next) => {
  try {
    const mergeTags = [
      { tag: '{FirstName}', description: 'Prénom du destinataire' },
      { tag: '{LastName}', description: 'Nom du destinataire' },
      { tag: '{Email}', description: 'Email du destinataire' },
      { tag: '{Company}', description: 'Entreprise' },
      { tag: '{EventName}', description: "Nom de l'événement" },
      { tag: '{EventDate}', description: "Date de l'événement" },
      { tag: '{DiscountCode}', description: 'Code promo' },
      { tag: '{GalleryName}', description: 'Nom de la galerie' },
      { tag: '{ArtistName}', description: "Nom de l'artiste" },
      { tag: '{ArtworkTitle}', description: "Titre de l'œuvre" },
      { tag: '{PurchaseDate}', description: "Date d'achat" },
      { tag: '{UnsubscribeLink}', description: 'Lien de désabonnement' }
    ];

    res.status(200).json(mergeTags);
  } catch (error) {
    next(createError.internal(error.message));
  }
};
