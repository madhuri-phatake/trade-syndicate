const express               = require('express');
const router                = express.Router();
const BlogController        = require("../controllers/blog.controller");


//Blog API's
router.post('/create_blog', BlogController.create_blog);
router.get('/get_blog_list', BlogController.get_blog_list);
router.get('/get_blog_list_admin', BlogController.get_blog_list_admin);
router.get('/get_blog_details/:unique_url', BlogController.get_blog_details);
router.delete('/delete_blog/:blog_id', BlogController.delete_blog);
router.get('/get_all_blogs', BlogController.get_all_blogs);
router.get('/get_all_blogs_no_limit', BlogController.get_all_blogs_no_limit);
router.post('/get_related_blog', BlogController.get_related_blog);
router.get('/get_priority_blogs', BlogController.get_priority_blogs);
router.get('/get_remaining_blogs', BlogController.get_remaining_blogs);


//Blog Category API's
// router.post('/create_blog_categories', BlogController.create_blog_categories);
// router.get('/get_blog_category_list', BlogController.get_blog_category_list);
router.get('/get_all_blog_categories', BlogController.get_all_blog_categories);
// router.delete('/delete_blog_categories/:blog_category_id', BlogController.delete_blog_categories);


module.exports = router;