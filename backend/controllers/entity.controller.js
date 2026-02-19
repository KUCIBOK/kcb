const Entity = require("../models/Entity");
const { createError } = require("../middleware/errorHandler");

// ✅ Create a new entity
exports.createEntity = async (req, res, next) => {
  try {
    const { name, type, description, email, phone, address, website } = req.body;
    const ownerId = req.user._id;

    const entity = new Entity({
      name,
      type,
      description,
      email,
      phone,
      address,
      website,
      owner: ownerId,
      members: [
        {
          userId: ownerId,
          role: "owner",
        },
      ],
    });

    await entity.save();
    res.status(201).json(entity);
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Get all entities for current user
exports.getEntities = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get entities where user is owner
    const ownedEntities = await Entity.find({ owner: userId }).sort({
      createdAt: -1,
    });

    // Get entities where user is a member
    const memberEntities = await Entity.find({
      "members.userId": userId,
      owner: { $ne: userId },
    }).sort({ createdAt: -1 });

    const entities = [
      ...ownedEntities.map((e) => ({
        ...e.toObject(),
        role: "owner",
      })),
      ...memberEntities.map((e) => {
        const member = e.members.find((m) => m.userId.toString() === userId.toString());
        return {
          ...e.toObject(),
          role: member?.role || "viewer",
        };
      }),
    ];

    res.status(200).json(entities);
  } catch (error) {
    next(createError.internal(error.message));
  }
};

// ✅ Get entity by ID
exports.getEntityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entity = await Entity.findById(id).populate("members.userId", "name email");

    if (!entity) {
      return next(createError.notFound("Entity not found"));
    }

    // Check if user has access
    const hasAccess =
      entity.owner.toString() === req.user._id.toString() ||
      entity.members.some((m) => m.userId._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return next(createError.forbidden("Access denied"));
    }

    res.status(200).json(entity);
  } catch (error) {
    next(createError.internal(error.message));
  }
};

// ✅ Update entity
exports.updateEntity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const entity = await Entity.findById(id);

    if (!entity) {
      return next(createError.notFound("Entity not found"));
    }

    // Only owner and managers can update
    const userMember = entity.members.find(
      (m) => m.userId.toString() === req.user._id.toString()
    );
    const isOwner = entity.owner.toString() === req.user._id.toString();
    const isManager = userMember?.role === "manager";

    if (!isOwner && !isManager) {
      return next(createError.forbidden("Only owners and managers can update"));
    }

    // Allowed fields
    const allowedUpdates = [
      "name",
      "description",
      "type",
      "email",
      "phone",
      "address",
      "website",
      "logo",
      "coverImage",
      "socialMedia",
      "currency",
      "timezone",
      "language",
      "isPublic",
    ];

    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        entity[field] = updates[field];
      }
    });

    entity.updatedAt = new Date();
    await entity.save();

    res.status(200).json(entity);
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Add member to entity
exports.addMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role = "artist" } = req.body;

    const entity = await Entity.findById(id);

    if (!entity) {
      return next(createError.notFound("Entity not found"));
    }

    // Only owner can add members
    if (entity.owner.toString() !== req.user._id.toString()) {
      return next(createError.forbidden("Only owner can add members"));
    }

    // Check if member already exists
    const existingMember = entity.members.find(
      (m) => m.userId.toString() === userId
    );

    if (existingMember) {
      return next(createError.badRequest("User is already a member"));
    }

    entity.members.push({
      userId,
      role,
    });

    await entity.save();
    await entity.populate("members.userId", "name email");

    res.status(200).json(entity);
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Update member role
exports.updateMemberRole = async (req, res, next) => {
  try {
    const { id, memberId } = req.params;
    const { role } = req.body;

    const entity = await Entity.findById(id);

    if (!entity) {
      return next(createError.notFound("Entity not found"));
    }

    // Only owner can update roles
    if (entity.owner.toString() !== req.user._id.toString()) {
      return next(createError.forbidden("Only owner can update member roles"));
    }

    const member = entity.members.find((m) => m._id.toString() === memberId);

    if (!member) {
      return next(createError.notFound("Member not found"));
    }

    member.role = role;
    await entity.save();
    await entity.populate("members.userId", "name email");

    res.status(200).json(entity);
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Remove member from entity
exports.removeMember = async (req, res, next) => {
  try {
    const { id, memberId } = req.params;

    const entity = await Entity.findById(id);

    if (!entity) {
      return next(createError.notFound("Entity not found"));
    }

    // Only owner can remove members
    if (entity.owner.toString() !== req.user._id.toString()) {
      return next(createError.forbidden("Only owner can remove members"));
    }

    // Cannot remove owner
    const member = entity.members.find((m) => m._id.toString() === memberId);
    if (member?.role === "owner") {
      return next(createError.badRequest("Cannot remove owner"));
    }

    entity.members = entity.members.filter(
      (m) => m._id.toString() !== memberId
    );

    await entity.save();
    res.status(200).json({ message: "Member removed" });
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Delete entity
exports.deleteEntity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const entity = await Entity.findById(id);

    if (!entity) {
      return next(createError.notFound("Entity not found"));
    }

    // Only owner can delete
    if (entity.owner.toString() !== req.user._id.toString()) {
      return next(createError.forbidden("Only owner can delete"));
    }

    await Entity.deleteOne({ _id: id });

    res.status(200).json({ message: "Entity deleted" });
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Switch to entity (set current context)
exports.switchEntity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const entity = await Entity.findById(id);

    if (!entity) {
      return next(createError.notFound("Entity not found"));
    }

    // Check access
    const hasAccess =
      entity.owner.toString() === req.user._id.toString() ||
      entity.members.some((m) => m.userId.toString() === req.user._id.toString());

    if (!hasAccess) {
      return next(createError.forbidden("Access denied"));
    }

    // Store in session/response (frontend will handle)
    res.status(200).json({
      message: "Successfully switched entity",
      entity,
    });
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};
