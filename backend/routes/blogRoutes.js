const {
  getBlogs,
  getBlog,
  searchBlog,
  setBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogControllers");
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

router.get("/search", searchBlog);
router.route("/").get(getBlogs).post(protect, setBlog);
router
  .route("/:id")
  .put(protect, updateBlog)
  .delete(protect, deleteBlog)
  .get(getBlog);

module.exports = router;
