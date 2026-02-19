const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer");
const { auth, admin } = require("../middleware/auth");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  getPublishedPosts,
  getPublishedPostsByUserId,
  getDraftPostsByUserId,
  getArchivedPostsByUserId,
  archivePost,
  publishPost,
  getArchivedPosts,
  deleteAllPosts,
} = require("../controllers/blogPost.controller");

router.post("/", multer, createPost);

router.get("/", getAllPosts);

router.get("/published", getPublishedPosts);

router.get("/archived", getArchivedPosts);

router.get("/:id", getPostById);

router.put("/:id", admin, multer, updatePost);

router.get("/published/user/:id", getPublishedPostsByUserId);

router.get("/draft/user/:id", getDraftPostsByUserId);

router.get("/archived/user/:id", getArchivedPostsByUserId);

router.get("/archive/:id", admin, archivePost);

router.get("/publish/:id", admin, publishPost);

router.delete("/", admin, deleteAllPosts);

router.delete("/:id", admin, deletePost);

router.post("/comment/:id", auth, addComment);

router.delete("/:id/comments/:commentId", auth, deleteComment);

module.exports = router;
