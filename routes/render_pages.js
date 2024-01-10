var express = require('express');
var router = express.Router();
const BlogModel = require("../models/blogModel/BlogModel");
// let session = require('express-session');
// var cookieParser = require('cookie-parser');
// var redis = require("redis");
// var redisStore = require('connect-redis')(session);
// var redisClient = redis.createClient();
var keys = require("../config/keys");



// router.use(session({
//     secret: 'lukewellness@123#',
//     // create new redis store.
//     store: new redisStore({ host: 'luke-test-redis.bjlo9b.0001.aps1.cache.amazonaws.com', port: 6379, client: redisClient }),
//     saveUninitialized: false,
//     resave: false
//   }));

//---------Middleware for admin login-------//
function check_login_user(req, res, next) {
    if (req.session.id && (req.session.user_type == "admin" || req.session.user_type == "staff")) {
        req.app.locals.id = req.session.id;
        req.app.locals.user_id = req.session.user_id;
        req.app.locals.name = req.session.name;
        req.app.locals.user_type = req.session.user_type;
        req.app.locals.user_status = req.session.user_status;
        req.app.locals.user_access = req.session.user_access;
        req.app.locals.vendor_state = req.session.vendor_state;
        next();
    } else {
        res.render('login/login');
    }
}

//Middleware to check vendor done with initial setup or not

//--------- Middleware for vendor login -------//
function check_login_vendor(req, res, next) {
    if (req.session.id && req.session.user_type == "vendor") {
        req.app.locals.id = req.session.id;
        req.app.locals.user_id = req.session.user_id;
        req.app.locals.name = req.session.name;
        req.app.locals.first_name = req.session.first_name;
        req.app.locals.last_name = req.session.last_name;
        req.app.locals.user_type = req.session.user_type;
        req.app.locals.vendor_state = req.session.vendor_state;
        req.app.locals.vendor_profile_image = req.session.vendor_profile_image;
        next();
    } else {
        res.render('vendor_login/login', {
            title: "Vendor Login"
        });
    }
}

// Home page
router.get('/', function(req,res,next){
    res.render('index',{})
})

// about us
router.get('/about-us', function(req,res,next){
    res.render('about-us',{})
})

router.get('/contact-us', function(req,res,next){
    res.render('contact-us',{})
})

router.get('/career', function(req,res,next){
    res.render('career',{})
})

router.get('/privacy-policy', function(req,res,next){
    res.render('privacy-policy',{})
})

router.get('/accesories', function(req,res,next){
    res.render('accesories',{})
})

router.get('/adhesives', function(req,res,next){
    res.render('adhesives',{})
})

router.get('/industrial-paints', function(req,res,next){
    res.render('industrial-paints',{})
})

router.get('/insulation-or-waterproofing', function(req,res,next){
    res.render('insulation-or-waterproofing',{})
})
router.get('/speciality-lubricants', function(req,res,next){
    res.render('speciality-lubricants',{})
})

router.get('/blogs', function(req,res,next){
    res.render('blogs',{})
})
// blog-details
router.get('/blog-details/:url', async function (req, res, next) {
    try {
        const data = await BlogModel.findOne({ unique_url: req.params.url }); // Use findOne to retrieve a single document
        res.render('blog-details', {
            unique_url:req.params.url, // Pass the retrieved data to the rendering template
            data: data,
        });
    } catch (error) {
        // Handle errors, e.g., send an error response
        console.error(error);
        res.status(500).send('An error occurred while fetching blog data');
    }
});

//  faqs
router.get('/faqs', function(req,res,next){
    res.render('faqs',{})
})
//---------Home page-------//
router.get('/admin-login', check_login_user, function (req, res, next) {
    res.render('index-admin', {
        title: `Dashboard`,
        branch_key: keys.branch_key,
        id: req.session.id,
        user_id: req.session.user_id,
        name: req.session.name,
        user_type: req.session.user_type,
        vendor_state: req.session.vendor_state,
        user_status: req.session.user_status,
        user_access: req.session.user_access,
    });
});

//Auth routes
//admin
//---------Login-------//
router.get('/login', check_login_user, function (req, res, next) {
    if (req.cookies.user_sid && req.session.id) {
        res.render('index', {
            title: 'YCL Panel',
            branch_key: keys.branch_key,
            id: req.session.id,
            user_id: req.session.user_id,
            name: req.session.name,
            user_type: req.session.user_type,
            vendor_state: req.session.vendor_state,
            user_status: req.session.user_status,
            user_access: req.session.user_access,
        });
    } else {
        res.render('login/login', {
            title: 'Login'
        });
    }
});
//---------Forgot Password-------//
router.get('/forgot-password', function (req, res, next) {
    res.render('login/forgot-password', {
        title: 'Forgot Password'
    });
});

//User Management
//---------Profile-------//
router.get('/profile', check_login_user, function (req, res, next) {
    res.render('profile', {
        title: 'Profile',
        branch_key: keys.branch_key,
        id: req.session.id,
        user_id: req.session.user_id,
        name: req.session.name,
        user_type: req.session.user_type,
        vendor_state: req.session.vendor_state,
        user_status: req.session.user_status,
        user_access: req.session.user_access,
    });
});
//---------Profile-------//
router.get('/vendor-profile', check_login_vendor, function (req, res, next) {
    res.render('vendor_profile', {
        title: 'My Profile',
        branch_key: keys.branch_key,
        id: req.session.id,
        user_id: req.session.user_id,
        vendor_profile_image: req.session.vendor_profile_image,
        name: req.session.name,
        user_type: req.session.user_type,
        vendor_state: req.session.vendor_state,
        user_status: req.session.user_status,
        user_access: req.session.user_access,
    });
});



//---------Users-------//

//---------Common Master-------//
router.get('/user-master', check_login_user, function (req, res, next) {
    res.render('common_master', {
        title: 'User Master',
        branch_key: keys.branch_key,
        id: req.session.id,
        user_id: req.session.user_id,
        name: req.session.name,
        user_type: req.session.user_type,
        vendor_state: req.session.vendor_state,
        user_status: req.session.user_status,
        user_access: req.session.user_access
    });
});

//---------Home Page Master-------//
router.get('/home-page-master', check_login_user, function (req, res, next) {
    res.render('home_master', {
        title: 'Home Page Master',
        branch_key: keys.branch_key,
        id: req.session.id,
        user_id: req.session.user_id,
        name: req.session.name,
        user_type: req.session.user_type,
        vendor_state: req.session.vendor_state,
        user_status: req.session.user_status,
        user_access: req.session.user_access
    });
});

router.get('/blog-master', check_login_user, function (req, res, next) {
    res.render('blog_master', {
        title: 'Blog Master',
        branch_key: keys.branch_key,
        id: req.session.id,
        user_id: req.session.user_id,
        name: req.session.name,
        user_type: req.session.user_type,
        vendor_state: req.session.vendor_state,
        user_status: req.session.user_status,
        user_access: req.session.user_access,
    });
});

router.get('/popup-master', check_login_user, function (req, res, next) {
    res.render('popup_master', {
        title: 'Popup Master',
        branch_key: keys.branch_key,
        id: req.session.id,
        user_id: req.session.user_id,
        name: req.session.name,
        user_type: req.session.user_type,
        vendor_state: req.session.vendor_state,
        user_status: req.session.user_status,
        user_access: req.session.user_access,
    });
});
router.get('/career-master', check_login_user, function (req, res, next) {
    res.render('career_master', {
        title: 'Career Master',
        branch_key: keys.branch_key,
        id: req.session.id,
        user_id: req.session.user_id,
        name: req.session.name,
        user_type: req.session.user_type,
        vendor_state: req.session.vendor_state,
        user_status: req.session.user_status,
        user_access: req.session.user_access,
    });
});
router.get('/home-master', check_login_user, function (req, res, next) {
    res.render('home_page', {
        title: 'Home Master',
        branch_key: keys.branch_key,
        id: req.session.id,
        user_id: req.session.user_id,
        name: req.session.name,
        user_type: req.session.user_type,
        vendor_state: req.session.vendor_state,
        user_status: req.session.user_status,
        user_access: req.session.user_access,
    });
});



//---------App Master-------//
router.get('/app-master', check_login_user, function (req, res, next) {
    res.render('users', {
        title: 'Master',
        branch_key: keys.branch_key,
        id: req.session.id,
        user_id: req.session.user_id,
        name: req.session.name,
        user_type: req.session.user_type,
        vendor_state: req.session.vendor_state,
        user_status: req.session.user_status,
        user_access: req.session.user_access,
    });
});



module.exports = router;