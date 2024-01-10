$(document).ready(async function() {
    const base_url= window.location.origin
    $.ajax({
      // url: `${base_url}` + "/blogs/get_all_blogs",
      url: base_url + "/blogs/get_priority_blogs",
      type: "GET",
      success: function(response) {
  
        if (response.status == true) {
          let arrOfBlog = response.data;
//   console.log(arrOfBlog[0].thumbnail_image)
          let blogItem = "";
          arrOfBlog.forEach((obj, i) => {
            console.log(obj.thumbnail_image[0])
            let currentDate = new Date(obj.date);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; // Months are zero-based
            const year = currentDate.getFullYear();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = currentDate.toLocaleDateString('en-US', options);
          
                const base_url=window.location.origin
                const uniqueURL = obj.unique_url;
                blogItem +=`<div class="col-md-4">
            <article class="post post-medium border-0 pb-0 mb-5">
                <div class="post-image">
                    <a href="${base_url +'/blog-details/' + obj.unique_url}"">
                        <img src="${obj.thumbnail_image[0].icon_url}" class="img-fluid img-thumbnail img-thumbnail-no-borders " alt="">
                    </a>
                </div>
                <div class="post-content">
                    <h2 class="font-weight-semibold text-5 line-height-6 mt-3 mb-2"><a href="${base_url +'/blog-details/' + obj.unique_url}"">${obj.title}</a></h2>
                    <p>${obj.description}</p>
                    <a href="${base_url + '/blog-details/' + obj.unique_url}" class="mt-20 ls1 sub-title">Read More <i
//                                             class="ml-5"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"
//                                                 xmlns="http://www.w3.org/2000/svg">
//                                                 <path
//                                                     d="M13.922 4.5V11.8125C13.922 11.9244 13.8776 12.0317 13.7985 12.1108C13.7193 12.1899 13.612 12.2344 13.5002 12.2344C13.3883 12.2344 13.281 12.1899 13.2018 12.1108C13.1227 12.0317 13.0783 11.9244 13.0783 11.8125V5.51953L4.79547 13.7953C4.71715 13.8736 4.61092 13.9176 4.50015 13.9176C4.38939 13.9176 4.28316 13.8736 4.20484 13.7953C4.12652 13.717 4.08252 13.6108 4.08252 13.5C4.08252 13.3892 4.12652 13.283 4.20484 13.2047L12.4806 4.92188H6.18765C6.07577 4.92188 5.96846 4.87743 5.88934 4.79831C5.81023 4.71919 5.76578 4.61189 5.76578 4.5C5.76578 4.38811 5.81023 4.28081 5.88934 4.20169C5.96846 4.12257 6.07577 4.07813 6.18765 4.07812H13.5002C13.612 4.07813 13.7193 4.12257 13.7985 4.20169C13.8776 4.28081 13.922 4.38811 13.922 4.5Z"
//                                                     fill="currentColor"></path>
//                                             </svg></i></a>
                </div>
            </article>
        </div>`
          });
          $("#homePageBlog").append(blogItem);
        }
      }
    });
  });
//   $(document).ready(async function () {
//     const base_url=window.location.origin;
//     $.ajax({
//         url: base_url + "/blogs/get_remaining_blogs",
//         type: "GET",
//         success: function (response) {

//             if (response.status == true) {
//                 let arrOfBlog = response.data;
//                 console.log(arrOfBlog)
//                 let blogItem = "";
//                 arrOfBlog.forEach((obj, i) => {
//                     let currentDate = new Date(obj.date);
//                     const day = currentDate.getDate();
//                     const month = currentDate.getMonth() + 1; // Months are zero-based
//                     const year = currentDate.getFullYear();
//                     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//                     const formattedDate = currentDate.toLocaleDateString('en-US', options);
//                     const uniqueURL = obj.unique_url;
//                    console.log(obj.thumbnail_image[0])
//                     blogItem += 
                 
//             `<div class="col-lg-4 col-md-6">
//                             <div class="item mb-50">
//                                 <div class="img">
//                                     <a href="${base_url + '/blog-details/' + obj.unique_url}"> <img src="${obj.thumbnail_image[0].icon_url}" alt=""></a>
//                                     <div class="date">
//                                         ${formattedDate}
//                                     </div>
//                                 </div>
//                                 <div class="cont mt-30">
//                                     <h6>
//                                         <a href="${base_url + '/blog-details/' + obj.unique_url}"> ${obj.title}</a>
//                                     </h6>
//                                     <a href="${base_url + '/blog-details/' + obj.unique_url}" class="mt-20 ls1 sub-title">Read More <i
//                                             class="ml-5"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"
//                                                 xmlns="http://www.w3.org/2000/svg">
//                                                 <path
//                                                     d="M13.922 4.5V11.8125C13.922 11.9244 13.8776 12.0317 13.7985 12.1108C13.7193 12.1899 13.612 12.2344 13.5002 12.2344C13.3883 12.2344 13.281 12.1899 13.2018 12.1108C13.1227 12.0317 13.0783 11.9244 13.0783 11.8125V5.51953L4.79547 13.7953C4.71715 13.8736 4.61092 13.9176 4.50015 13.9176C4.38939 13.9176 4.28316 13.8736 4.20484 13.7953C4.12652 13.717 4.08252 13.6108 4.08252 13.5C4.08252 13.3892 4.12652 13.283 4.20484 13.2047L12.4806 4.92188H6.18765C6.07577 4.92188 5.96846 4.87743 5.88934 4.79831C5.81023 4.71919 5.76578 4.61189 5.76578 4.5C5.76578 4.38811 5.81023 4.28081 5.88934 4.20169C5.96846 4.12257 6.07577 4.07813 6.18765 4.07812H13.5002C13.612 4.07813 13.7193 4.12257 13.7985 4.20169C13.8776 4.28081 13.922 4.38811 13.922 4.5Z"
//                                                     fill="currentColor"></path>
//                                             </svg></i></a>
//                                 </div>
//                             </div>
//                         </div>`
//                 });
//                 $("#remaining-blog").append(blogItem);

//             }
//         }
//     });
// });