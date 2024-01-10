var career = {
    base_url: null,
    api_url: null,
    init: function () {
      this.bind_events();
      this.get_careers();
  
    },
  
    bind_events: function () {
      var self = this;
      if (self.edit == false) {
        $(".access-controll").each(function (i) {
          $(this).attr("disabled", "disabled");
        });
      }
      if (self.view == false) {
        $("#view-controll-web-master").hide();
      }
      $("#create_popup").on("click", function (event) {
        $('form[id="career_form"]').validate({
          rules: {
            title: {
              required: true,
            },
            description: {
              required: true,
            },
            priority: {
                required: true,
              },
            status: {
              required: true
            },
           
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
            priority: {
                required:
                  "<span style='font-size:10px; color: red;'>Please enter priority</span>",
              },
            status: {
              required: "<span style='font-size:10px; color: red;'>Please Select Status</span>",
            },
           
  
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
            // var src = $(".blog_thumbnail_icon").attr("data-path");
            if (description == "") {
              toastr["error"]("Please enter Detail Description", "Error");
            } else {
                career.add_popup();
            }
          },
        });
      });
    },
  
    add_popup: function () {
      if ($("#title").val() == " ") {
        toastr["error"]("Single space is not allowed", "error");
        return false;
      }
      var self = this;
      let id = $("#popup_id").val();
      let obj = new Object();
   
      obj.title = $("#title").val();
      obj.description = $("#detail_description").val();
      obj.priority = $("#priority").val();

      tinyMCE.triggerSave();
      if ($("#status").val() == "active") {
        obj.status = true;
      } else {
        obj.status = false;
      }
      obj.status = $("#status").val()
      if (id == "" || id == null) {
        obj._id = null;
        let $request = $.ajax({
          url: self.base_url + "/careers/create_career_data",
          contentType: "application/json; charset= utf-8",
          type: "POST",
          data: JSON.stringify(obj),
          dataType: "json",
        });
        $request.done(function (response) {
          $("#create_popup_btn").attr("disabled", false);
          if (response.title == "success") {
           
            $("#career_form").trigger("reset");
            toastr["success"](response.message, "Success");
            career.get_careers();
          } else {
            $("#create_popup_btn").attr("disabled", false);
            toastr["error"](response.message, "error");
          }
        });
      } else {
        obj._id = id;
        let $request = $.ajax({
          url: self.base_url + "/careers/create_career_data",
          contentType: "application/json; charset= utf-8",
          type: "POST",
          data: JSON.stringify(obj),
          dataType: "json",
        });
        $request.done(function (response) {
          $("#create_popup_btn").attr("disabled", false);
          if (response.title == "success") {
           
            $("#create_popup_btn").text("Add");
            $("#career_form").trigger("reset");
            
            toastr["success"](response.message, "Success");
            career.get_careers();
          } else {
            $("#create_popup_btn").attr("disabled", false);
            toastr["error"](response.message, "error");
          }
        });
      }
    },
  
    get_careers: function () {
      let self = this;
      $("#popup_table").empty();
      $("#popup_table").DataTable({
        processing: true,
        serverSide: false,
        paging: false,
        destroy: true,
        bFilter: true,
        aaSorting: [],
        bLengthChange: false,
        ajax: {
          url: self.base_url + "/careers/get_career_data",
          type: "GET",
          datatype: "json",
        },
        columns: [
          
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
            visible: false,
            //'class': 'center'
          },
          {
            data: "priority",
            sTitle: "Priority",
            visible: true,
            //'class': 'center'
          },
          
          {
            'data': 'status',
            'sTitle': 'Status',
            //'class': 'center',
            'render': function (data, type, row) {
              if (data == "active") {
                return '<span style="font-size: 12px !important;" class="badge gradient-45deg-green-teal">Active</span>'
  
              } else
                if (data == "inactive") {
                  return '<span style="font-size: 12px !important;" class="badge gradient-45deg-deep-orange-orange">Inactive</span>'
  
                } else {
                  return "NA";
                }
            }
          },
         
          {
            data: "null",
            width: "10%",
            sTitle: "Action",
            //'class': 'center',
            render: function (data, type, row) {
              return '<a style="margin: 0px 2px" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-green-teal disable-edit" onclick="career.edit_popup(this)" title="Edit"> <i class="material-icons">create</i> </a>' +
                '<a style="margin: 0px 2px" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-purple-deep-orange disable-delete" onclick="career.delete_popup(this)" title="Delete"> <i class="material-icons">delete_forever</i> </a>'
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
        let obj = $("#home_table").dataTable().fnGetData(row);
        let detail_description = obj.detail_description;
        $("#append_detail_description").empty();
        $("#append_detail_description").append(detail_description);
        $('#detail_description_modal').modal('open');
      },
  
    //Edit Popup
    edit_popup: function (e) {
      let self = this;
      if (self.edit == false) {
        swal("Sorry!", "You dont have edit access", "error");
        return false;
      }
      let row = $(e).closest("tr");
      let obj = $("#popup_table").dataTable().fnGetData(row);
      console.log(obj)
    
      $("#popup_id").val(obj._id);
      $("#create_popup_btn").text("Update");
      $("#status").val(obj.status);
      
      if (obj.status == true) {
        $("#status").val("active");
      } else {
        $("#status").val("inactive");
      }
     
      $("#title").val(obj.title);
      $("#title").focus();
      $("#title").next("label").attr("class", "active");
     $("#priority").val(obj.priority);
     $("#priority").next("label").attr("class", "active");
      $("#detail_description").val(obj.description);
      $("#detail_description").next("label").attr("class", "active");
      tinyMCE.get('detail_description').setContent("");
    if(obj.description != null) {
        tinyMCE.get('detail_description').setContent(obj.description);
    }
      $("#status").val(obj.status);
      $("#status").next("label").attr("class", "active");
      
    },
  
  
    delete_popup: function (e) {
      let self = this;
      if (self.del == false) {
        swal("Sorry!", "You dont have delete access", "error");
        return false;
      }
      var row = $(e).closest("tr");
      var obj = $("#popup_table").dataTable().fnGetData(row);
  
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
            url: self.base_url + "/careers/delete_career_data/" + obj._id,
            type: "delete",
            dataType: "json",
          });
          $request.done(function (response) {
            if (response.title == "success") {
              $("#career_form").trigger("reset");
              $("#popup_id").val("");
              swal("Deleted!", "Popup has been deleted.", "success");
              career.get_careers();
            } else {
              $("#popup_id").val("");
              swal("Error!", "Something Went Wrong!", "error");
            }
          });
        } else {
          $("#popup_id").val("");
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
 