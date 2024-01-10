$(document).ready(async function () {
    const base_url = window.location.origin
    console.log()
    $.ajax({
        url: base_url + "/blogs/get_blog_details/" + unique_url,
        type: "GET",
        success: function (response) {
            let blogsMarkup = "";
            let currentDate = new Date(response.data.BlogData[0].date);

            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; // Months are zero-based
            const year = currentDate.getFullYear();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const options2 = { month: 'long' };
            const monthFullName = currentDate.toLocaleDateString('en-US', options2);
            const formattedDate = currentDate.toLocaleDateString('en-US', options);
            if (response.status) {

                blogsMarkup += ` <h1 class="font-weight-bold text-color-secondary text-11">${response.data.BlogData[0].title}</h1>`
                $("#blog-details-header").empty(blogsMarkup);

                $("#blog-details-header").append(blogsMarkup);
            } else {
                $(".blogsSection").hide();
            }
            if (response.status) {
                let blogsMarkup2 = "";
                blogsMarkup2 += `   <article class="post post-large blog-single-post border-0 m-0 p-0">
                    <div class="post-image ms-0">
                        
                            <img src="${response.data.BlogData[0].image[0].icon_url}"
                                class="img-fluid img-thumbnail img-thumbnail-no-borders"
                                alt="">
                       
                    </div>

                    <div class="post-date ms-0">
                        <span class="day">${day}</span>
                        <span class="month">${monthFullName}</span>
                    </div>

                    <div class="post-content ms-0">

                        <h2 class="font-weight-semi-bold">${response.data.BlogData[0].title}</h2>

                        ${response.data.BlogData[0].detail_description}

                       
                        </div>
                    

                     
                   
                </article>`
                $("#blog-details").empty(blogsMarkup2);
    //             <div class="post-block mt-5 post-share">
    //             <h4 class="mb-3">Share this Post</h4>

    //             <div class="post-icon">
                               
                  
    //                 <ul class="social-icons social-icons-dark social-icons-clean">
    //     <li class="social-icons-instagram">
    //         <a href="https://www.instagram.com/trade_syndicate/?utm_source=ig_profile_share&igshid=t6qdirnb8z0a" target="_blank" title="Instagram">
    //             <i class="fab fa-instagram font-weight-semibold"></i>
    //         </a>
    //     </li>
    //     <li class="social-icons-facebook">
    //         <a href="https://www.facebook.com/tradesyndicate/" target="_blank" title="Facebook">
    //             <i class="fab fa-facebook-f font-weight-semibold"></i>
    //         </a>
    //     </li>
    //     <li class="social-icons-linkedin">
    //         <a href="https://www.linkedin.com/company/trade-syndicate/" target="_blank" title="linkedin">
    //             <i class="fab fa-linkedin-in"></i>
    //         </a>
    //     </li>
    //     <li class="social-icons-youtube">
    //         <a href="#" target="_blank" title="youtube">
    //             <i class="fab fa-youtube"></i>
    //         </a>
    //     </li>
    //     <li class="social-icons-twitter">
    //         <a class="main-image" href="https://www.justdial.com/Pune/Trade-Syndicate-Near-S-S-Ajmera-High-School-Pimpri/020PXX20-XX20-101226122701-B3Q6_BZDET?xid=UHVuZSBUcmFkZSBTeW5kaWNhdGU=" target="_blank" title="justdial">
    //             <img src="/website-files/img/social-media/jd-logo-black.png"alt=""width="15">
    //         </a>
    //     </li>
       
    // </ul>
    // </div>
    //             </div>
                $("#blog-details").append(blogsMarkup2);
            } else {
                $(".blogsSection").hide();
            }
        }
    });
});

function copytoClipboard(e) {
    $("body").append('<input id="copyURL" type="text" value="" />');
    $("#copyURL").val(window.location.href).select();
    document.execCommand("copy");
    $("#copyURL").remove();
}

const atag = document.querySelector('.main-image');
const originalSrc = '/website-files/img/social-media/jd-logo-black.png';
const newSrc = '/website-files/img/social-media/jd-logo-white1.png'; // Replace this with your new image source

atag.addEventListener('mouseover', function () {
    const img = this.querySelector('img');
    img.src = newSrc; // Change the image source on hover
});

atag.addEventListener('mouseout', function () {
    const img = this.querySelector('img');
    img.src = originalSrc; // Revert back to the original image source on mouse out
});

