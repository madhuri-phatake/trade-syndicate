require("dotenv").config();
const mongoose = require("mongoose");
const BlogModel = require("../models/blogModel/BlogModel");
// const LiveProductsModel = require("../../models/LiveProductsModel");
const BlogCategoryModel       = require("../models/blogModel/BlogCategoryModel");
const axios = require("axios");
const ObjectId = mongoose.Types.ObjectId;

let response = {
  status: true,
  message: "",
  data: {},
};

//Create blog
exports.create_blog = (req, res, next) => {
  console.log(req.body._id);
  if (req.body._id === null || req.body._id === "null" || req.body._id === undefined) {
    save_blog(req, res, next);
  } else {
    update_blog(req, res, next);
  }
};

//Function to save the blog
async function save_blog(req, res, next) {
  let data = new BlogModel({
    title: req.body.title,
    date: req.body.date,
    description: req.body.description,
    image: req.body.image,
    thumbnail_image: req.body.thumbnail_image,
    link: req.body.link,
    unique_url: req.body.unique_url,
    priority: req.body.priority,
    is_active: req.body.is_active,
    category_id: req.body.category_id,
    detail_description: req.body.detail_description,
    blog_related_cat_id: req.body.blog_related_cat_id,
    blog_related_sub_cat_id: req.body.blog_related_sub_cat_id,
    blog_related_product_id: req.body.blog_related_product_id,
    blog_meta_tags: req.body.blog_meta_tags,
    meta_title: req.body.meta_title,
    meta_dec: req.body.meta_dec
  });
  data
    .save()
    .then(async (info) => {
      response.title = "success";
      response.status = true;
      response.data = info;
      response.message = "Blog added successfully";
      return res.json(response);
    })
    .catch((err) => {
      response.title = "error";
      response.status = false;
      response.data = err;
      response.message = "Something Went Wrong!";
      return res.json(response);
      next(err);
    });
}

//Function to update the blog
async function update_blog(req, res, next) {
  var updateData = {};
  for (var field in req.body) {
    updateData[field] = req.body[field];
  }

  //Update the details of the blog in database
  BlogModel.findOneAndUpdate(
    { _id: req.body._id },
    { $set: updateData },
    { new: true }
  )
    .exec()
    .then((info) => {
      response.title = "success";
      response.status = true;
      response.data = info;
      response.message = "Blog updated successfully!";
      return res.json(response);
    })
    .catch((err) => {
      response.title = "error";
      response.status = false;
      response.data = err;
      response.message = "Something Went Wrong!";
      return res.json(response);
      next(err);
    });
}

//API to get all the blog
exports.get_blog_list = async (req, res, next) => {
  var active_id = await BlogCategoryModel.find({ status: true }).select("_id");
  let newArray = [];
  for (var i = 0; i < active_id.length; i++) {
    newArray[i] = mongoose.Types.ObjectId(active_id[i]["_id"]);
  }
  BlogModel.find({ is_active: true, category_id: { $in : newArray } }, '_id thumbnail_image title unique_url')
  .populate("category_id", "name icon")
    .sort({ priority: 1 })
    .limit(8)
    .exec()
    .then((result) => {
      response.title = "success";
      response.status = true;
      response.data = result;
      response.message = "Blog displayed successfully!!";
      return res.json(response);
    })
    .catch((err) => {
      response.title = "error";
      response.status = false;
      response.data = [];
      response.message = "Something Went Wrong!";
      return res.json(response);
      next(err);
    });
};


//API to get all the blog
exports.get_all_blogs = (req, res, next) => {
  BlogModel.find({is_active: true}).sort({"createdAt": -1 }).limit(8)
  // .populate("category_id")
  .sort({_id: -1})
  .exec()
  .then((result) => {
    response.title = "success";
    response.status = true;
    response.data = result;
    response.message = "Blog displayed successfully!!";
    return res.json(response);
  })
  .catch((err) => {
    response.title = "error";
    response.status = false;
    response.data = [];
    response.message = "Something Went Wrong!";
    return res.json(response);
    next(err);
  });
};
exports.get_priority_blogs = (req, res, next) => {
  BlogModel.find({ is_active: true })
    .sort({ priority: 1 })
    .limit(4)
    .exec()
    .then((result) => {
      const response = {
        title: "success",
        status: true,
        data: result,
        message: "Priority Blogs displayed successfully!!"
      };
      return res.json(response);
    })
    .catch((err) => {
      const response = {
        title: "error",
        status: false,
        data: [],
        message: "Something Went Wrong!"
      };
      return res.json(response);
    });
};
exports.get_remaining_blogs = (req, res, next) => {
  BlogModel.find({ is_active: true })
    .sort({ priority: 1 })
    .skip(4)
    .exec()
    .then((result) => {
      const response = {
        title: "success",
        status: true,
        data: result,
        message: "Remaining Blogs displayed successfully!!"
      };
      return res.json(response);
    })
    .catch((err) => {
      const response = {
        title: "error",
        status: false,
        data: [],
        message: "Something Went Wrong!"
      };
      return res.json(response);
    });
};

//API to get all the in admin
exports.get_blog_list_admin = (req, res, next) => {
  BlogModel.find().sort({"createdAt": -1 })
  // .populate("category_id")
  .sort({_id: -1})
  .exec()
  .then((result) => {
    response.title = "success";
    response.status = true;
    response.data = result;
    response.message = "Blog displayed successfully!!";
    return res.json(response);
  })
  .catch((err) => {
    response.title = "error";
    response.status = false;
    response.data = [];
    response.message = "Something Went Wrong!";
    return res.json(response);
    next(err);
  });
};
//API to get all the blog
exports.get_all_blogs_no_limit = (req, res, next) => {
  BlogModel.find({is_active: true}).sort({"createdAt": -1 })
  // .populate("category_id")
  .sort({_id: -1})
  .exec()
  .then((result) => {
    response.title = "success";
    response.status = true;
    response.data = result;
    response.message = "Blog displayed successfully!!";
    return res.json(response);
  })
  .catch((err) => {
    response.title = "error";
    response.status = false;
    response.data = [];
    response.message = "Something Went Wrong!";
    return res.json(response);
    next(err);
  });
};

//API to get blog details
exports.get_blog_details = (req, res, next) => {
  console.log(req.params.unique_url)
  BlogModel.find({ unique_url: req.params.unique_url ,})
    .exec()
    .then(async(result) => {
    // Get product data by ids
    let blog_related_product_id = result[0].blog_related_product_id;
    blog_related_product_id = await blog_related_product_id.map(function(el) {
      return mongoose.Types.ObjectId(el);
    });

      response.title = "success";
      response.status = true;
      if (result.length > 0) {
        response.data = {
          BlogData: result,
        };
      } else {
        response.data = null;
      }
      response.message = "Blog displayed successfully!!";
      return res.json(response);
    })
    .catch((err) => {
      response.title = "error";
      response.status = false;
      response.data = null;
      response.message = "Something Went Wrong!";
      return res.json(response);
      next(err);
    });
};

//API to delete the blog
exports.delete_blog = (req, res) => {
  BlogModel.findOneAndDelete({ _id: req.params.blog_id })
    .exec()
    .then((info) => {
      response.title = "success";
      response.status = true;
      response.data = info;
      response.message = "blog deleted successfully";
      return res.json(response);
    })
    .catch((err) => {
      response.title = "error";
      response.status = false;
      response.data = err;
      response.message = "Something Went Wrong!";
      return res.json(response);
    });
};

// ----get related blog --------------//
exports.get_related_blog = (req, res) => {
  // if (req.body.sub_category_id == null) {
    BlogModel.find({ category_id: ObjectId(req.body.category_id), is_active: true }).populate("category_id")
      .then((data) => {
        return res.json({
          status: true,
          message: "Related Blog Data ",
          data: data,
        });
      })
      .catch((err) => {
        return res.json({
          status: false,
          message: "somethings went wrong",
          err: err,
        });
      });
  // } else {
  //   BlogModel.find({$and:[{ category_id: ObjectId(req.body.category_id) },{sub_category_id: ObjectId(req.body.sub_category_id)}, {is_active: true}]}).populate("category_id")
  //   .then((data) => {
  //     if(data.length > 0) {
  //       return res.json({
  //         status: true,
  //         message: "Related Blog Data ",
  //         data: data,
  //       });
  //     }
  //     else {
  //       BlogModel.find({ category_id: ObjectId(req.body.category_id), is_active: true })
  //       .then((data) => {
  //         return res.json({
  //           status: true,
  //           message: "Related Blog Data ",
  //           data: data,
  //         });
  //       })
  //       .catch((err) => {
  //         return res.json({
  //           status: false,
  //           message: "somethings went wrong",
  //           err: err,
  //         });
  //       });
  //     }
  //   })
  //   .catch((err) => {
  //     return res.json({
  //       status: false,
  //       message: "somethings went wrong",
  //       err: err,
  //     });
  //   });
  // }
};


//Create or update Blog Categories
exports.create_blog_categories = (req, res, next) => {

  if (req.body._id === null || req.body._id === "null") {
    save_blog_categories(req, res, next);
  } else {
    update_blog_categories(req, res, next);
  }
};

//Function to save the Blog categories
async function save_blog_categories(req, res, next) {
  try {
    let data = new BlogCategoryModel({
      name      :   req.body.name,
      icon      :   req.body.icon,
      priority  :   req.body.priority,
      status    :   req.body.status
    });
    data
    .save()
    .then(async (info) => {
      return res.json({
        status: true,
        message: "Created Successfully!",
        title: "success",
        data: info
      })
    })
    .catch((err) => {
      return res.json({
        title: "error",
        status: false,
        data: err,
        message: "Something went wrong!"
      })
    });
  }
  catch(e) {
    return res.json({
      title: "error",
      status: false,
      data: e,
      message: "Something went wrong!"
    })
  }
}

//Function to update the Blog categories
async function update_blog_categories(req, res, next) {
  var updateData = {};
  for (var field in req.body) {
    updateData[field] = req.body[field];
  }

  //Update the details of the  blog categories in database
  BlogCategoryModel.findOneAndUpdate(
    { _id: req.body._id },
    { $set: updateData },
    { new: true }
  )
    .exec()
    .then((info) => {
      return res.json({
        status: true,
        message: "Updated Successfully!",
        title: "success",
        data: info
      })
    })
    .catch((err) => {
      return res.json({
        title: "error",
        status: false,
        data: err,
        message: "Something went wrong!"
      })
    });
}

//API to get active the blog categories
exports.get_blog_category_list = (req, res, next) => {
  BlogCategoryModel.find({ status: true })
    .sort({ _id: -1 })
    .exec()
    .then((result) => {
      return res.json({
        status: true,
        message: "Displayed Successfully!",
        title: "success",
        data: result
      })
    })
    .catch((err) => {
      return res.json({
        title: "error",
        status: false,
        data: err,
        message: "Something went wrong!"
      })
    });
};

//API to get all the blog categories
exports.get_all_blog_categories = (req, res, next) => {
  BlogCategoryModel.find({})
    .sort({ _id: -1 })
    .exec()
    .then((result) => {
      return res.json({
        status: true,
        message: "Displayed Successfully!",
        title: "success",
        data: result
      })
    })
    .catch((err) => {
      return res.json({
        title: "error",
        status: false,
        data: err,
        message: "Something went wrong!"
      })
    });
};

//API to delete the blog categories
exports.delete_blog_categories = (req, res) => {
  BlogCategoryModel.findOneAndDelete({ _id: req.params.blog_category_id })
    .exec()
    .then((info) => {
      return res.json({
        status: true,
        message: "Deleted Successfully!",
        title: "success",
        data: info
      })
    })
    .catch((err) => {
      return res.json({
        title: "error",
        status: false,
        data: err,
        message: "Something went wrong!"
      })
    });
};