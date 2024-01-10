var blog = {
  base_url: null,
  api_url: null,
  init: function () {
    this.bind_events();
    this.get_blogs();

  },

  bind_events: function () {
    var self = this;
    if (self.edit == false) {
      $(".access-controll").each(function (i) {
        $(this).attr("disabled", "disabled");
      });
    }

    $("#create_cancel_btn").on('click', function () {

      // if ($("#create_blog_btn").text() === "Update") {
      //   $("#create_cancel_btn").show();
      // } else {
        $("#blog_icon").show();
        $("#blog_icon").addClass("input-validation-error");
        $("#blog_id").val("");
        $(".blog_icon_container").empty("");
        $(".blog_thumbnail_icon_container").empty("");
        $("#blog_thumbnail_icon_bar").css("width", "0%");
        $("#blog_icon_bar").css("width", "0%");
        $("#create_blog_btn").text("Add");
        $("#blog_form").trigger("reset");
        $("#description").next("label").attr("class", "active");

        $("#related_products").empty('');
        $("#blog_meta_tags").val("")
        $("#meta_title").val("")
        $("#meta_dec").val("")
      $("#create_cancel_btn").hide();
      // }
    });

    // $("#create_cancel_btn").hide()
    if (self.view == false) {
      $("#view-controll-web-master").hide();
    }
    $("#create_blog").on("click", function (event) {
      $('form[id="blog_form"]').validate({
        rules: {
          title: {
            required: true,
          },
          description: {
            required: true,
          },
          blog_date: {
            required: true,
          },
          // blog_link: {
          //   required: true,
          // },
          blog_meta_tags: {
            required: true,
          },
          priority: {
            required: true,
          },
          category_id: {
            required: true
          },
          blog_url: {
            required: true,
          },
          meta_title: {
            required: true,
          },
          meta_dec: {
            required: true,
          }
        },
        messages: {
          title: {
            required:
              "<span style='font-size:10px; color: red;'>Please enter title</span>",
          },
          description: {
            required:
              "<span style='font-size:10px; color: red;'>Please enter description</span>",
          },
          blog_date: {
            required:
              "<span style='font-size:10px; color: red;'>Please select date</span>",
          },
          // blog_link: {
          //   required:
          //     "<span style='font-size:10px; color: red;'>Please enter blog link</span>",
          // },
          blog_meta_tags: {
            required: "<span style='font-size:10px; color: red;'>Please add meta tags</span>",
          },
          priority: {
            required:
              "<span style='font-size:10px; color: red;'>Please enter priority</span>",
          },
          category_id: {
            required:
              "<span style='font-size:10px; color: red;'>Please select category</span>",
          },
          blog_url: {
            required: "<span style='font-size:10px; color: red;'>Please add blog URL</span>",
          },
          meta_title: {
            required: "<span style='font-size:10px; color: red;'>Please add meta title</span>",
          },
          meta_dec: {
            required: "<span style='font-size:10px; color: red;'>Please add meta description</span>",
          }
        },
        errorElement: "div",
        errorPlacement: function (error, element) {
          var placement = $(element).data("error");
          if (placement) {
            $(placement).append(error);
          } else {
            let elem = element.closest(".input-field");
            elem.append(error);
          }
        },
        submitHandler: function () {
          tinyMCE.triggerSave();
          var description = $("#detail_description").val();
          var src1 = $(".blog_icon").attr("data-path");
          var src = $(".blog_thumbnail_icon").attr("data-path");
          if (description == "") {
            toastr["error"]("Please enter Detail Description", "Error");
          } else if (src1 == "" || src1 == undefined) {
            toastr['error']('Please select Blog icon', 'Error');
            return false;
          } else if (src == "" || src == undefined) {
            toastr['error']('Please select Blog thumbnail icon', 'Error');
            return false;

          } else {
            blog.add_blog();
          }
        },
      });
    });
  },

  add_blog: function () {
    if ($("#title").val() == " ") {
      toastr["error"]("Single space is not allowed", "error");
      return false;
    }
    var self = this;
    let id = $("#blog_id").val();
    let obj = new Object();
    if ($(".blog_icon").attr("data-path")) {
      obj.image = {
        icon_path: $(".blog_icon").attr("data-path"),
        icon_url: $(".blog_icon").attr("data-url"),
      };
    } else {
      obj.image = {
        icon_path: "/admin/images/icon/noicon.jpg",
        icon_url: "/admin/images/icon/noicon.jpg",
      };
    }

    if ($(".blog_thumbnail_icon").attr("data-path")) {
      obj.thumbnail_image = {
        icon_path: $(".blog_thumbnail_icon").attr("data-path"),
        icon_url: $(".blog_thumbnail_icon").attr("data-url"),
      };
    } else {
      obj.thumbnail_image = {
        icon_path: "/admin/images/icon/noicon.jpg",
        icon_url: "/admin/images/icon/noicon.jpg",
      };
    }
    obj.title = $("#title").val();
    let ur = $("#blog_url").val();
    if (ur.length >= 70) {
      toastr["error"]("Please enter a valid blog URL (maximum 70 characters) ", "error");
      return false;
    } else {
      obj.unique_url = ur.replace(/[^A-Z0-9]/ig, "-");
    }

    obj.description = $("#description").val();
    obj.link = $("#blog_link").val();
    obj.link = null
    obj.date = $("#blog_date").val();
    tinyMCE.triggerSave();
    obj.detail_description = $("#detail_description").val();
    if ($("#blog_status").val() == "active") {
      obj.is_active = true;
    } else {
      obj.is_active = false;
    }
    obj.priority = $("#priority").val();
    obj.blog_meta_tags = $("#blog_meta_tags").val()
    obj.meta_dec = $("#meta_dec").val()
    obj.meta_title = $("#meta_title").val()
    if (id == "" || id == null) {
      obj._id = null;
      let $request = $.ajax({
        url: self.base_url + "/blogs/create_blog",
        contentType: "application/json; charset= utf-8",
        type: "POST",
        data: JSON.stringify(obj),
        dataType: "json",
      });
      $request.done(function (response) {
        $("#create_blog_btn").attr("disabled", false);
        if (response.title == "success") {
          $("#blog_icon").show();
          $("#blog_icon").addClass("input-validation-error");
          $(".blog_icon_container").empty("");
          $(".blog_thumbnail_icon_container").empty("");
          $("#blog_meta_tags").val("")
          $(".blog_icon_bar").css("width", "0px");
          $("#blog_thumbnail_icon_bar").css("width", "0px");
          $("#blog_form").trigger("reset");
          $("#description").next("label").attr("class", "active");

          $("#related_products").empty('');
          $("#blog_icon_bar").css("width", "0%");
          $("#create_cancel_btn").hide();
          toastr["success"](response.message, "Success");
          blog.get_blogs();
        } else {
          $("#create_blog_btn").attr("disabled", false);
          toastr["error"](response.message, "error");
        }
      });
    } else {
      obj._id = id;
      let $request = $.ajax({
        url: self.base_url + "/blogs/create_blog",
        contentType: "application/json; charset= utf-8",
        type: "POST",
        data: JSON.stringify(obj),
        dataType: "json",
      });
      $request.done(function (response) {
        $("#create_blog_btn").attr("disabled", false);
        if (response.title == "success") {
          $("#blog_icon").show();
          $("#blog_icon").addClass("input-validation-error");
          $("#blog_id").val("");
          $(".blog_icon_container").empty("");
          $(".blog_thumbnail_icon_container").empty("");
          $("#blog_thumbnail_icon_bar").css("width", "0%");
          $("#blog_icon_bar").css("width", "0%");
          $("#create_blog_btn").text("Add");
          $("#blog_form").trigger("reset");
          $("#description").next("label").attr("class", "active");

          $("#related_products").empty('');
          $("#blog_meta_tags").val("")
          $("#meta_title").val("")
          $("#meta_dec").val("")
          $("#create_cancel_btn").hide();
          toastr["success"](response.message, "Success");
          blog.get_blogs();
        } else {
          $("#create_blog_btn").attr("disabled", false);
          toastr["error"](response.message, "error");
        }
      });
    }
  },

  remove_image: function (e) {
    var bucketName = "marspoles-website";
    var s3 = new AWS.S3({
      apiVersion: "2006-03-01",
    });
    var params = {
      Bucket: bucketName,
      Key: $(e).attr("data-path"),
    };
    s3.deleteObject(params, function (err, data) {
      if (data) {
        $(e).closest(".parent").children("input[type='file']").val("");
        $(e).closest(".parent").children(".progress").children("div").css({
          width: "0%",
        });
        $(e).closest(".image-preview").remove();
        $("#blog_icon").val("");
        $("#blog_icon").hide();
        $("#blog_icon").show();
      } else {
        console.log("Check if you have sufficient permissions : " + err);
      }
    });
  },

  get_blogs: function () {
    let self = this;
    $("#blog_table").empty();
    $("#blog_table").DataTable({
      processing: true,
      serverSide: false,
      paging: false,
      destroy: true,
      bFilter: true,
      aaSorting: [],
      bLengthChange: false,
      ajax: {
        url: self.base_url + "/blogs/get_blog_list_admin",
        type: "GET",
        datatype: "json",
      },
      columns: [
        {
          data: "_id",
          visible: false,
        },
        {
          data: null,
          sTitle: "Sr.",
          //'class': 'center'
        },
        {
          data: "title",
          sTitle: "Title",
          //'class': 'center'
        },
        {
          data: "description",
          sTitle: "Description",
          //'class': 'center'
        },
        {
          data: "unique_url",
          sTitle: "Blog URL",
          'class': 'center'
        },
        {
          data: "meta_dec",
          sTitle: "Blog URL",
          'class': 'center',
          visible: false,
        }, {
          data: "meta_title",
          sTitle: "Blog URL",
          'class': 'center',
          visible: false,
        }, {
          data: "thumbnail_image",
          sTitle: "Blog URL",
          'class': 'center',
          visible: false,
        },
        {
          data: "priority",
          sTitle: "blog Priority",
          //'class': 'center',
          render: function (data, type, row) {
            if (data == null || data == "") {
              return "-";
            } else {
              return data;
            }
          },
        },
        {
          data: "blog_meta_tags",
          sTitle: "blog meta tags",
          //'class': 'center',
          render: function (data, type, row) {
            if (data == null || data == "") {
              return "-";
            } else {
              return data;
            }
          },
        },
        {
          data: "image",
          sTitle: "image",
          //'class': 'center',
          render: function (data, type, row) {
            if (data.length > 0) {
              //alert("hello");
              if (data[0]) {
                if (data[0].icon_url) {
                  return (
                    `<img src="` +
                    data[0].icon_url +
                    `" onerror="$(this).attr('src','/admin/images/icon/noicon.jpg');" style="width:50px; height:50px;">`
                  );
                } else {
                  return `<img src="/admin/images/icon/noicon.jpg" style="width:50px; height:50px;">`;
                }
              } else {
                return `<img src="/admin/images/icon/noicon.jpg" style="width:50px; height:50px;">`;
              }
            } else {
              //alert("hi");
              return `<img src="/admin/images/icon/noicon.jpg" style="width:50px; height:50px;">`;
            }
          },
        },
        {
          data: "is_active",
          sTitle: "Status",
          //'class': 'center',
          render: function (data, type, row) {
            if (data == true) {
              return '<span style="font-size: 12px !important;" class="badge gradient-45deg-green-teal">Active</span>';
            } else if (data == false) {
              return '<span style="font-size: 12px !important;" class="badge gradient-45deg-deep-orange-orange">Inactive</span>';
            } else {
              return "NA";
            }
          },
        },
        {
          data: "null",
          width: "10%",
          sTitle: "Action",
          //'class': 'center',
          render: function (data, type, row) {
            return '<a style="margin: 0px 2px" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-green-teal disable-edit" onclick="blog.edit_blog(this)" title="Edit"> <i class="material-icons">create</i> </a>' +
              '<a style="margin: 0px 2px" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-purple-deep-orange disable-delete" onclick="blog.delete_blog(this)" title="Delete"> <i class="material-icons">delete_forever</i> </a>' +
              '<a style="margin: 0px 2px" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-green-teal " onclick="blog.view_detail_description(this)" title="View Detail Description"> <i class="material-icons">remove_red_eye</i> </a>';
          },
        },
      ],
      rowCallback: function (nRow, aData, iDisplayIndex) {
        var oSettings = this.fnSettings();
        $("td:first", nRow).html(oSettings._iDisplayStart + iDisplayIndex + 1);
        return nRow;
      },
    });
  },

  //view detail description
  view_detail_description: function (e) {
    let row = $(e).closest("tr");
    let obj = $("#blog_table").dataTable().fnGetData(row);
    let detail_description = obj.detail_description;
    $("#append_detail_description").empty();
    $("#append_detail_description").append(detail_description);
    $('#detail_description_modal').modal('open');
  },

  //Edit blog
  edit_blog: function (e) {
    let self = this;
    if (self.edit == false) {
      swal("Sorry!", "You dont have edit access", "error");
      return false;
    }
    let row = $(e).closest("tr");
    let obj = $("#blog_table").dataTable().fnGetData(row);
    console.log(obj)
    if (obj.image.length > 0) {
      $("#meta_title").val(obj.meta_title)
      $("#meta_title").next("label").attr("class", "active");
      $("#meta_dec").val(obj.meta_dec)
      $("#meta_dec").next("label").attr("class", "active");

      let imgBox = `<div class="image-preview blog_icon" data-path="` + obj.image[0].icon_path + `" data-url="` + obj.image[0].icon_url + `">
                        <a href="` + obj.image[0].icon_url + `" target="_blank">
                            <img src="` + obj.image[0].icon_url + `" alt="avatar" onerror="$(this).attr('src','/admin/images/icon/document.png');">
                        </a>
                        <span>Icon</span>
                        <button type="button" title="Remove Image" class="remove-img-btn" onclick="blog.remove_image(this)" data-path="` + obj.image[0].icon_path + `">
                            <i class="material-icons">close</i>
                        </button>
                       </div>`;
      $("#blog_icon").removeClass("input-validation-error");
      $(".blog_icon_container").empty("");
      $(".blog_icon_container").prepend(imgBox);
    }
    if (obj.thumbnail_image.length > 0) {
      let imgBox = `<div class="image-preview blog_thumbnail_icon" data-path="` + obj.thumbnail_image[0].icon_path + `" data-url="` + obj.thumbnail_image[0].icon_url + `">
                        <a href="` + obj.thumbnail_image[0].icon_url + `" target="_blank">
                            <img src="` + obj.thumbnail_image[0].icon_url + `" alt="avatar" onerror="$(this).attr('src','/admin/images/icon/document.png');">
                        </a>
                        <span>Icon</span>
                        <button type="button" title="Remove Image" class="remove-img-btn" onclick="blog.remove_image(this)" data-path="` + obj.thumbnail_image[0].icon_path + `">
                            <i class="material-icons">close</i>
                        </button>
                       </div>`;
      $("#blog_thumbnail_icon").removeClass("input-validation-error");
      $(".blog_thumbnail_icon_container").empty("");
      $(".blog_thumbnail_icon_container").prepend(imgBox);
    }
    $("#blog_id").val(obj._id);
    $("#create_blog_btn").text("Update");

    $("#create_cancel_btn").show();



    // $("#create_cancel_btn").off().click(function () {
    //   $("#blog_icon").show();
    //   $("#blog_id").val("");
    //   $(".blog_icon_container").empty();
    //   $(".blog_thumbnail_icon_container").empty();
    //   $("#blog_thumbnail_icon_bar").css("width", "0%");
    //   $("#blog_icon_bar").css("width", "0%");
    //   $("#create_blog_btn").text("Add");
    //   $("#blog_form").trigger("reset");
    //   $("#related_products").empty('');
    //   toastr["error"]("Data cleared", "Cancelled");

    //   $("#create_cancel_btn").hide();
    // });

    // $("#create_blog_btn").click(function () {
    //   $("#create_cancel_btn").hide();
    // });




    $("#blog_status").val(obj.is_active);

    if (obj.is_active == true) {
      $("#blog_status").val("active");
    } else {
      $("#blog_status").val("inactive");
    }
    if (obj.blog_meta_tags == null) {
      $("#blog_meta_tags").val("")
      $("#blog_meta_tags").next("label").attr("class", "active");
    } else {
      $("#blog_meta_tags").val(obj.blog_meta_tags)
      $("#blog_meta_tags").next("label").attr("class", "active");
    }
    $("#title").val(obj.title);
    $("#title").focus();
    $("#title").next("label").attr("class", "active");
    $("#priority").val(obj.priority);
    $("#priority").next("label").attr("class", "active");
    $("#description").val(obj.description);
    // $("#description").focus();
    $("#description").next("label").attr("class", "active");

    $("#blog_url").val(obj.unique_url);
    $("#blog_url").next("label").attr("class", "active");
    tinyMCE.get('detail_description').setContent("");
    if (obj.detail_description != null) {
      tinyMCE.get('detail_description').setContent(obj.detail_description);
    }
    var start_date1 = new Date(obj.date);
    var start_day = start_date1.getDate(); //Date of the month: 2 in our example
    var start_month = start_date1.toLocaleString("default", { month: "short" }); //Month of the Year: 0-based index, so 1 in our example
    var start_year = start_date1.getFullYear();
    var start_date = start_month + " " + start_day + ", " + start_year;
    $("#blog_date").val(start_date);
    $("#blog_date").next("label").attr("class", "active");


  },


  delete_blog: function (e) {
    let self = this;
    if (self.del == false) {
      swal("Sorry!", "You dont have delete access", "error");
      return false;
    }
    var row = $(e).closest("tr");
    var obj = $("#blog_table").dataTable().fnGetData(row);

    swal({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      dangerMode: true,
      buttons: {
        cancel: "No, cancel",
        delete: "Yes, delete It",
      },
    }).then((willDelete) => {
      if (willDelete) {
        let $request = $.ajax({
          url: self.base_url + "/blogs/delete_blog/" + obj._id,
          type: "delete",
          dataType: "json",
        });
        $request.done(function (response) {
          if (response.title == "success") {
            $("#blog_form").trigger("reset");
            $("#blog_id").val("");
            swal("Deleted!", "blog has been deleted.", "success");
            blog.get_blogs();
          } else {
            $("#blog_id").val("");
            swal("Error!", "Something Went Wrong!", "error");
          }
        });
      } else {
        $("#blog_id").val("");
        swal("Cancelled", "Your data is safe :)", "error");
      }
    });
  },
  //number validation
  isNumberKey: function (evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  },

};

async function UPLOAD_ICON(dataArray, event) {
  var bucketName = "marspoles-website";
  var s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: {
      Bucket: bucketName,
    },
  });
  let data = {
    id: $(dataArray).attr("id"),
    "progress-bar": $(dataArray).attr("data-progress-bar"),
    "append-class": $(dataArray).attr("data-append-class"),
    "common-class": $(dataArray).attr("data-common-class"),
    "subfolder-name": $(dataArray).attr("data-subfolder-name"),
    "data-is-multiple": $(dataArray).attr("data-is-multiple"),
  };
  if (data["data-is-multiple"] == "false") {
    if ($("." + data["common-class"]).length > 0) {
      swal("Error", "You can't upload multiple files", "error");
      return false;
    }
  }
  var fuData = document.getElementById(data["id"]);
  var FileUploadPath = fuData.value;
  if (FileUploadPath == "") {
  } else {
    var Extension = FileUploadPath.substring(
      FileUploadPath.lastIndexOf(".") + 1
    ).toLowerCase();
    if (Extension == "png" || Extension == "jpg" || Extension == "jpeg" || Extension == "svg" || Extension == "ico") {
      $("#" + data["progress-bar"]).css("width", "0%");
      var today = new Date();
      var date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
      for (var i = 0; i < event.target.files.length; i++) {
        var imageFile = event.target.files[i];
        let img = new Image();
        img.src = window.URL.createObjectURL(imageFile);
        img.onload = async () => {
          let width = img.width;
          let height = img.height;
          if (width == 1200 && height == 400) {
            if (imageFile.size <= 1000000) {
              var filePath = "vendor/" + data["subfolder-name"] + "/" + date + "/" + uuidv4() + "." + Extension;
              await s3.upload(
                {
                  Key: filePath,
                  Body: imageFile,
                  ACL: "public-read",
                },
                async function (err, data1) {
                  if (err) {
                    toastr.error("Something Went wrong !.", "Error");
                  } else {
                    let fileUrl = null;
                    fileUrl = "https://images.youcarelifestyle.com/" + filePath;
                    $("#" + data["progress-bar"]).show();
                    $("." + data["append-class"]).show();
                    let imgBox =
                      `<div class="image-preview ` + data["common-class"] + `"
                                      data-path="` + data1.Location + `" data-url="` + data1.Location + `">
                                    <a href="` + data1.Location + `" target="_blank">
                                      <img src="` + data1.Location + `" alt="avatar" onerror="$(this).attr('src','/admin/images/icon/document.png');">
                                    </a>
                                    <span>` + imageFile.name + `</span>
                                    <button type="button" title="Remove Image" class="remove-img-btn" onclick="blog.remove_image(this)"
                                                                data-path="` + data1.Location + `">
                                      <i class="material-icons">close</i>
                                    </button>
                                  </div>`;
                    setTimeout(function () {
                      $("." + data["append-class"]).prepend(imgBox);
                    }, 2000);
                  }
                }
              )
                .on("httpUploadProgress", async function (progress) {
                  var uploaded = parseInt(
                    (progress.loaded * 100) / progress.total
                  );
                  $("#" + data["progress-bar"]).css("width", uploaded + "%");
                });
            } else {
              $("#" + data["id"]).val("");
              toastr["error"](
                "File size needs to be less than or equal to 500kb",
                "File name: " + imageFile.name
              );
            }
          } else {
            $("#" + data["id"]).val("");
            toastr['error']('Icon resolution should be 1200x400px', 'Error');
          }
        };
      }
    } else {
      $("#" + data["id"]).val("");
      toastr["error"](
        "Only JPG or PNG or JPEG file types are allowed",
        "Error"
      );
    }
  }
}

async function UPLOAD_THUMBNAIL_ICON(dataArray, event) {
  var bucketName = "marspoles-website";
  var s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: {
      Bucket: bucketName,
    },
  });
  let data = {
    id: $(dataArray).attr("id"),
    "progress-bar": $(dataArray).attr("data-progress-bar"),
    "append-class": $(dataArray).attr("data-append-class"),
    "common-class": $(dataArray).attr("data-common-class"),
    "subfolder-name": $(dataArray).attr("data-subfolder-name"),
    "data-is-multiple": $(dataArray).attr("data-is-multiple"),
  };
  if (data["data-is-multiple"] == "false") {
    if ($("." + data["common-class"]).length > 0) {
      swal("Error", "You can't upload multiple files", "error");
      return false;
    }
  }
  var fuData = document.getElementById(data["id"]);
  var FileUploadPath = fuData.value;
  if (FileUploadPath == "") {
  } else {
    var Extension = FileUploadPath.substring(
      FileUploadPath.lastIndexOf(".") + 1
    ).toLowerCase();
    if (Extension == "png" || Extension == "jpg" || Extension == "jpeg" || Extension == "svg" || Extension == "ico") {
      $("#" + data["progress-bar"]).css("width", "0%");
      var today = new Date();
      var date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
      for (var i = 0; i < event.target.files.length; i++) {
        var imageFile = event.target.files[i];
        let img = new Image();
        img.src = window.URL.createObjectURL(imageFile);
        img.onload = async () => {
          let width = img.width;
          let height = img.height;
          if (width == 305 && height == 382) {
            if (imageFile.size <= 10000000) {
              var filePath = data["subfolder-name"] + "/" + date + "/" + uuidv4() + "." + Extension;
              await s3.upload(
                {
                  Key: filePath,
                  Body: imageFile,
                  ACL: "public-read",
                },
                async function (err, data1) {
                  if (err) {
                    toastr.error("Something Went wrong !.", "Error");
                  } else {
                    let fileUrl = null;
                    console.log(filePath)

                    $("#" + data["progress-bar"]).show();
                    $("." + data["append-class"]).show();
                    let imgBox =
                      `<div class="image-preview ` + data["common-class"] + `"
                                      data-path="` + data1.Location + `" data-url="` + data1.Location + `">
                                    <a href="` + data1.Location + `" target="_blank">
                                      <img src="` + data1.Location + `" alt="avatar" onerror="$(this).attr('src','/admin/images/icon/document.png');">
                                    </a>
                                    <span>` + imageFile.name + `</span>
                                    <button type="button" title="Remove Image" class="remove-img-btn" onclick="blog.remove_image(this)"
                                                                data-path="` + data1.Location + `">
                                      <i class="material-icons">close</i>
                                    </button>
                                  </div>`;
                    setTimeout(function () {
                      $("." + data["append-class"]).prepend(imgBox);
                    }, 2000);
                  }
                }
              )
                .on("httpUploadProgress", async function (progress) {
                  var uploaded = parseInt(
                    (progress.loaded * 100) / progress.total
                  );
                  $("#" + data["progress-bar"]).css("width", uploaded + "%");
                });
            } else {
              $("#" + data["id"]).val("");
              toastr["error"](
                "File size needs to be less than or equal to 500kb",
                "File name: " + imageFile.name
              );
            }
          } else {
            $("#" + data["id"]).val("");
            toastr['error']('Icon resolution should be 400x400px', 'Error');
          }
        };
      }
    } else {
      $("#" + data["id"]).val("");
      toastr["error"](
        "Only JPG or PNG or JPEG file types are allowed",
        "Error"
      );
    }
  }
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function alpha(e) {
  var k;
  document.all ? (k = e.keyCode) : (k = e.which);
  return (
    (k > 64 && k < 91) ||
    (k > 96 && k < 123) ||
    k == 8 ||
    k == 32 ||
    (k >= 48 && k <= 57)
  );
}
