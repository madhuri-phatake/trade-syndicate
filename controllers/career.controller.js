require("dotenv").config();
const mongoose = require("mongoose");
const CareerModel = require("../models/CareerModel");

const axios = require("axios");
const ObjectId = mongoose.Types.ObjectId;

let response = {
  status: true,
  message: "",
  data: {},
};

//Create career
exports.create_career_data = (req, res, next) => {
 
  if (req.body._id === null || req.body._id === "null" || req.body._id === undefined) {
    save_career_data(req, res, next);
  } else {
    update_career_data(req, res, next);
  }
};

const save_career_data = (req, res, next) => {
  const { title, description, priority, status } = req.body;
  const newData = new CareerModel({
    title,
    description,
    priority,
    status
  });

  newData.save()
    .then((data) => {
      res.status(201).json({
        title: "success",
        status: true,
        data,
        message: "Data created successfully"
      });
    })
    .catch((err) => {
      res.status(500).json({
        title: "error",
        status: false,
        message: "Failed to create data",
        error: err.message
      });
    });
};

const update_career_data = (req, res, next) => {
  const updateData = {};
  for (const field in req.body) {
    updateData[field] = req.body[field];
  }
  CareerModel.findOneAndUpdate(
    { _id: req.body._id },
    { $set: updateData },
    { new: true }
  )
    .exec()
    .then((info) => {
      if (!info) {
        return res.status(404).json({
          title: "error",
          status: false,
          message: "Data not found for update"
        });
      }
      res.json({
        title: "success",
        status: true,
        data: info,
        message: "Data updated successfully"
      });
    })
    .catch((err) => {
      res.status(500).json({
        title: "error",
        status: false,
        message: "Something went wrong while updating data",
        error: err.message
      });
      next(err);
    });
};






//Get data
exports.get_career_data = (req, res) => {
  CareerModel.find()
    .then((data) => {
      res.json({
        title: "success",
        status: true,
        data,
        message: "Data retrieved successfully"
      });
    })
    .catch((err) => {
      res.status(500).json({
        title: "error",
        status: false,
        message: "Failed to retrieve data",
        error: err.message
      });
    });
};

//Update data

exports.update_career_data = (req, res) => {

  const { title, description, priority, status } = req.body;

  const updateData = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (priority) updateData.priority = priority;
  if (status) updateData.status = status;

  // Find the document by ID and update it
  CareerModel.findOneAndUpdate(
    { _id: req.body.id },
    updateData,
    { new: true, runValidators: true }
  )
    .then((updatedData) => {
      if (!updatedData) {
        return res.status(404).json({
          title: "error",
          status: false,
          message: "Data not found"
        });
      }
      res.json({
        title: "success",
        status: true,
        data: updatedData,
        message: "Data updated successfully"
      });
    })
    .catch((err) => {
      res.status(500).json({
        title: "error",
        status: false,
        message: "Failed to update data",
        error: err.message
      });
    });
};

//API to get all the career
// exports.get_all_career = (req, res, next) => {
//   CareerModel.find()
// .sort({_id: -1})
// .exec()
// .then((result) => {
//   response.title = "success";
//   response.status = true;
//   response.data = result;
//   response.message = "career displayed successfully!!";
//   return res.json(response);
// })
// .catch((err) => {
//   response.title = "error";
//   response.status = false;
//   response.data = [];
//   response.message = "Something Went Wrong!";
//   return res.json(response);
//   next(err);
// });
// };

//delete career description
// exports.delete_career_data = (req, res) => {
//   CareerModel.findOneAndDelete({ _id: req.params.id })
//     .then((data) => {
//       res.json({
//         title: "success",
//         status: true,
//         data,
//         message: "Data deleted successfully"
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         title: "error",
//         status: false,
//         message: "Failed to delete data",
//         error: err.message
//       });
//     });
// };
exports.delete_career_data = (req, res) => {
  CareerModel.findOneAndDelete({ _id: req.params.career_id })
    .exec()
    .then((info) => {
      response.title = "success";
      response.status = true;
      response.data = info;
      response.message = "data deleted successfully";
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

