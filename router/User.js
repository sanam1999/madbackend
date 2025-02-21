const express = require('express');
const router = express.Router({ mergeParams: true });
const warpAsync = require('../utils/warpAsync');
const passport = require('passport');
const { signup,
    login,
    logout,
    changepassword,
    updateProfile,
    addpost,
    addfood,
    deposit,
    getAccount,
    Withdrawall,
    getusername,
    tranfer,
    getmywallet,
    getfood} = require('../Controller/usre');
const upload = require("../utils/multer"); // Import multer middleware





router.route('/signup')
    .post(warpAsync(signup));


router.post(
      '/login',
       passport.authenticate('local', { failureMessage: true }),
        warpAsync(login)
);
    



router.post('/changepassword',  warpAsync(changepassword))

router.post('/updateProfile', upload.single("profileImg"), warpAsync(updateProfile)); 

router.post('/addpost', upload.single("postImg"), warpAsync(addpost)); 

router.post('/foodpost', upload.single("postImg"), warpAsync(addfood));

router.post('/diposit', warpAsync(deposit)); 

router.post('/Withdrawall', warpAsync(Withdrawall)); 

router.post('/tranfer', warpAsync(tranfer)); 

router.get('/getusername', warpAsync(getusername)); 

router.get('/getAccount', warpAsync(getAccount)); 

router.get('/getmywallet', warpAsync(getmywallet)); 

router.get('/getfood', warpAsync(getfood)); 

module.exports = router;
