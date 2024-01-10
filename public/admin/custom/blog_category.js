var blog_category = {
    base_url: null,
    init: function () {
        this.bind_events();
        this.load_blog_category_data();
    },

    bind_events: function () {
        var self = this;
        
        $("#create_blog_category").on('click', function (event) {
            $('form[id="blog_category_form"]').validate({
                rules: {
                    blog_category_name: {
                        required: true
                    },
                    blog_category_priority: {
                        required: true
                    }
                },
                messages: {
                    blog_category_name: {
                        required: "<span style='font-size:10px; color: red;'>Please enter category name</span>",
                    },
                    blog_category_priority: {
                        required: "<span style='font-size:10px; color: red;'>Please enter category priority</span>",
                    }
                },
                errorElement: 'div',
                errorPlacement: function (error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error)
                    } else {
                        let elem = element.closest('.input-field');
                        elem.append(error);
                    }
                },
                submitHandler: function () {
                    blog_category.add_blog_category();
                }
            });
        });
    },

    //Add Blog category
    add_blog_category: function () {
        $("#create_blog_category").prop("disabled", true);
        var self = this;
        let obj             = new Object();
        obj.name            = $("#blog_category_name").val();
        obj.priority        = $("#blog_category_priority").val();
        if($("#blog_category_status").val() == "active") {
            obj.status = true;
        }
        else  {
            obj.status = false;
        }
        let id = $("#blog_category_id").val();
        if(id == "") {
            obj._id = null;
            var src = $("#blog_category_image").val();
            if(src == "") {
                toastr['error']('Please select blog category image', 'Error');
                return false;
            }
            obj.icon = $(".blog_category_block").attr("data-url");
        }
        else {
            obj._id = id;
            if(!($(".blog_category_block").attr("data-url"))) {
                toastr['error']('Please select blog category image', 'Error');
                return false;
            }
            obj.icon = $(".blog_category_block").attr("data-url");
        }
        let $request = $.ajax({
            url: self.api_url + "/api/create_blog_categories",
            contentType: "application/json; charset= utf-8",
            type: "POST",
            data: JSON.stringify(obj),
            dataType: "json"
        });
        $request.done(function (response) {
            $("#create_blog_category_btn").attr("disabled", false);
            if (response.title == "success") {
                $("#create_blog_category_btn").text("Submit");
                $("#blog_category_image").show();
                $("#blog_category_image").addClass("input-validation-error");
                $(".blog_category_container").empty("");
                $(".blog_category_bar").css("width", "0px");
                $("#blog_category_form").trigger("reset");
                $("#blog_category_id").val("");
                toastr["success"](response.message, "Success");
                $("#create_blog_category").prop("disabled", false);
                $("#blog_category_bar").css("width", "0%");
                blog_category.load_blog_category_data();
            } else {
                $("#create_blog_category_btn").attr("disabled", false);
                toastr["error"](response.message, "error");
            };
        });
    },

    remove_image: function (e) {
        $("#create_blog_category").prop("disabled", false);
        var bucketName = "luke-images";
        var s3 = new AWS.S3({
            apiVersion: '2006-03-01',
        });
        var params = {
            Bucket: bucketName,
            Key: $(e).attr("data-path")
        }
        s3.deleteObject(params, function (err, data) {
            if (data) {
                $(e).closest(".parent").children("input[type='file']").val("");
                $(e).closest(".parent").children(".progress").children("div").css({
                    "width": "0%"
                });
                $(e).closest(".image-preview").remove();
                $("#blog_category_image").val("");
                $("#blog_category_image").val("");
                $("#blog_category_image").hide();
                $("#blog_category_image").show();
            } else {
                console.log("Check if you have sufficient permissions : " + err);
            }
        });
    },

    load_blog_category_data: function () {
        let self = this;
        $.ajax({
            type: "GET",
            url: self.api_url + "/api/get_all_blog_categories",
            data: "",
            dataType: "json",
            contentType: "application/json; charset= utf-8",
            success: function (response) {
                $('#blog_category_table').empty();
                $('#blog_category_table').DataTable({
                    "serverSide": false,
                    "paging": true,
                    "destroy": true,
                    "bFilter": true,
                    "aaSorting": [],
                    "bLengthChange": false,
                    "autoWidth": false,
                    "data": response.data,
                    "lengthMenu": [
                        [10, 25, 50, -1],
                        [10, 25, 50, "All"]
                    ],
                    "destroy": true,
                    "columnDefs": [{
                        "orderable": false,
                        "targets": 0
                    }],
                    "rowCallback": function (nRow, aData, iDisplayIndex) {
                        var oSettings = this.fnSettings();
                        $("td:first", nRow).html(oSettings._iDisplayStart + iDisplayIndex + 1);
                        return nRow;
                    },
                    "columns": [{
                            'data': '_id',
                            'visible': false
                        },
                        {
                            'data': null,
                            'sTitle': 'Sr.',
                            //'class': 'center'
                        },
                        {
                            'data': 'name',
                            'sTitle': 'Category Name'
                        },
                        {
                            'data': 'icon',
                            'sTitle': 'Category Icon',
                            //'class': 'center',
                            'render': function (data, type, row) {
                                return `<a class="product-images-link" href="` + data + `" title="View" data-lightbox="product-images" data-title="Click the right half of the image to move forward.">
                                            <img src="` + data + `" style="width:50px; height:50px;">
                                        </a>`;
                            }
                        },
                        {
                            'data': 'priority',
                            'sTitle': 'Priority',
                            //'class': 'center'
                        },
                        {
                            'data': 'status',
                            'sTitle': 'Status',
                            //'class': 'center',
                            'render': function (data, type, row) {
                                if (data == true) {
                                    return '<span style="font-size: 12px !important;" class="badge gradient-45deg-green-teal">Active</span>'
        
                                } else
                                if (data == false) {
                                    return '<span style="font-size: 12px !important;" class="badge gradient-45deg-deep-orange-orange">Inactive</span>'
                                } else {
                                    return "NA";
                                }
                            }
                        },
                        {
                            'data': 'null',
                            'width': '10%',
                            'sTitle': 'Action',
                            //'class': 'center',
                            'render': function (data, type, row) {
                                return '<a class="mb-6 btn-floating waves-effect waves-light gradient-45deg-green-teal disable-edit" onclick="blog_category.edit_blog_category(this)" title="Edit"> <i class="material-icons">create</i> </a>'
                                // return '<a class="mb-6 btn-floating waves-effect waves-light gradient-45deg-green-teal disable-edit" onclick="blog_category.edit_blog_category(this)" title="Edit"> <i class="material-icons">create</i> </a> <a class="mb-6 btn-floating waves-effect waves-light gradient-45deg-purple-deep-orange disable-delete" onclick="blog_category.delete_blog_category(this)" title="Delete"> <i class="material-icons">delete_forever</i> </a>'
                            }
                        }
                    ],
        
                });
            }
        });
    },

    //number validation
    isNumberKey: function(evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode != 46 && charCode > 31 &&
            (charCode < 48 || charCode > 57))
            return false;

        return true;
    },

    edit_blog_category: async function (e) {
        let self = this;
        if (self.edit == false) {
            swal(
                'Sorry!',
                'You dont have edit access',
                'error'
            )
            return false;
        }
        let row = $(e).closest('tr');
        let obj = $('#blog_category_table').dataTable().fnGetData(row);

        let imgBox = `<div class="image-preview blog_category_block"
                        data-path="` + obj.icon + `" data-url="` + obj.icon + `">
                        <a href="` + obj.icon + `" target="_blank">
                            <img src="` + obj.icon + `" alt="avatar" onerror="$(this).attr('src','/admin/images/icon/document.png');">
                        </a>
                        <span>Icon</span>
                        <button type="button" title="Remove Image" class="remove-img-btn" onclick="blog_category.remove_image(this)"
                            data-path="` + obj.icon + `">
                            <i class="material-icons">close</i>
                        </button>
                       </div>`;
        $("#blog_category_image").hide();
        $("#blog_category_url").removeClass("input-validation-error");
        $(".blog_category_container").empty("");
        $(".blog_category_container").prepend(imgBox);

        $("#blog_category_id").val(obj._id);
        $("#blog_category_name").val(obj.name);
        $("#blog_category_name").next("label").attr("class", "active");
        $("#blog_category_priority").val(obj.priority);
        $("#blog_category_priority").next("label").attr("class", "active");
        $("#create_blog_category_btn").text("Update");

        if(obj.status == true) {
            var st = "active";
        }
        else {
            var st = "inactive";
        }
        $('#blog_category_status').val(st).focus();
        $('#blog_category_status').formSelect();
    },

    delete_blog_category: function (e) {
        let self = this;
        if (self.del == false) {
            swal(
                'Sorry!',
                'You dont have delete access',
                'error'
            )
            return false;
        }
        var row = $(e).closest('tr');
        var obj = $('#blog_category_table').dataTable().fnGetData(row);
        var blog_category_id = obj._id;
        swal({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: 'warning',
            dangerMode: true,
            buttons: {
                cancel: 'No, cancel',
                delete: 'Yes, delete It'
            }
        })
        .then((willDelete) => {
            if (willDelete) {
                var $request = $.ajax({
                    url: self.api_url + "/api/delete_blog_categories/"+blog_category_id ,
                    type: "DELETE",
                    dataType: "json"
                });
                $request.done(function (response) { 
                    if (response.title == "success") {
                        $("#blog_category_form").trigger("reset");
                        $("#blog_category_id").val("");
                        $("#blog_category_bar").css("width", "0%");
                        toastr.success('Deleted!', 'Success');
                        blog_category.load_blog_category_data();
                    } else {
                        $("#category_id").val("");
                        toastr.error('Something Went wrong!', 'Error');
                    };
                });
            } else {
                $("#blog_category_id").val("");
                swal(
                    'Sorry!',
                    'Your data is safe :)',
                    'error'
                )
            }
        });
    }

};

async function UPLOAD_blog_category(dataArray, event) {
    $("#create_blog_category").prop("disabled", true);
    var bucketName = "luke-images-data";
    var s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {
            Bucket: bucketName
        }
    });
    let data = {
        'id': $(dataArray).attr("id"),
        'progress-bar': $(dataArray).attr("data-progress-bar"),
        'append-class': $(dataArray).attr("data-append-class"),
        'common-class': $(dataArray).attr("data-common-class"),
        'subfolder-name': $(dataArray).attr("data-subfolder-name"),
        'data-is-multiple': $(dataArray).attr("data-is-multiple"),
    };
    if (data["data-is-multiple"] == "false") {
        if ($("." + data["common-class"]).length > 0) {
            swal(
                'Error',
                "You can't upload multiple files",
                'error'
            )
            $("#create_blog_category").prop("disabled", false);
            return false;
        };
    }
    var fuData = document.getElementById(data["id"]);
    var FileUploadPath = fuData.value;
    if (FileUploadPath == '') {} else {
        var Extension = FileUploadPath.substring(
            FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
        if (Extension == "png" || Extension == "jpg" || Extension == "jpeg" || Extension == "svg" || Extension == "ico") {
            $("#" + data["progress-bar"]).css('width', "0%");
            var today = new Date();
            var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
            for (var i = 0; i < event.target.files.length; i++) {
                var imageFile = event.target.files[i];
                let img = new Image();
                img.src = window.URL.createObjectURL(imageFile);
                img.onload = async () => {
                    let width = img.width;
                    let height = img.height;
                    let dynamicWidth = 0;
                    let dynamicHeight = 0;
                    let viewType = $("#view_type").val();
                    if (width == 100 && height == 100) {
                        if (imageFile.size <= 500000) {
                            var filePath = "blog_category/" + data["subfolder-name"] + "/" + date + "/" + uuidv4() + "." + Extension;
                            await s3.upload({
                                Key: filePath,
                                Body: imageFile,
                                ACL: 'public-read'
                            }, async function (err, data1) {
                                if (err) {
                                    toastr.error('Something Went wrong !.', 'Error');
                                } else {
                                    let fileUrl = null;
                                    fileUrl = "https://images.youcarelifestyle.com/" + filePath;
                                    $("#" + data["progress-bar"]).show();
                                    $("." +
                                        data["append-class"]).show();
                                    let imgBox = `<div class="image-preview ` + data['common-class'] + `"
                                                            data-path="` + filePath + `" data-url="` + fileUrl + `">
                                                          
                                                            <a class="product-images-link" href="` + fileUrl + `" data-lightbox="product-images" data-title="Click the right half of the image to move forward.">
                                                                <img class="product-images" src="` + fileUrl + `">
                                                            </a>
                                                            <button type="button" title="Remove Image" class="remove-img-btn" onclick="blog_category.remove_image(this)"
                                                                data-path="` + filePath + `">
                                                                <i class="material-icons">close</i>
                                                            </button>
                                                            </div>`;
                                    setTimeout(function () {
                                        $("#create_blog_category").prop("disabled", false);
                                        $("." + data["append-class"]).prepend(imgBox);
                                    }, 4000);

                                }
                            }).on('httpUploadProgress', async function (progress) {
                                var uploaded = parseInt((progress.loaded * 100) / progress.total);
                                $("#" + data["progress-bar"]).css('width', uploaded + "%");
                            });
                        } else {
                            $("#" + data["id"]).val("");
                            toastr['error']('File size needs to be less than or equal to 500kb', 'File name: ' + imageFile
                                .name);
                        }
                    } else {
                        $("#" + data["id"]).val("");
                        toastr['error']('Icon file resolution should be 100x100px', 'Error');
                    }
                }
            }
        } else {
            $("#" + data["id"]).val("");
            toastr['error']('Only JPG, PNG and JPEG file types are allowed', 'Error');
        }
    }
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}