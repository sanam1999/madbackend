const User = require("../Model/user");
const Post = require("../Model/Post");
const FoodPost = require("../Model/Foodpost");
const Account  =  require("../Model/Account")


module.exports.updateProfile = async (req, res) => {
    try {
        const userId = req.params.id || req.user._id;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required." });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        const { name, email } = req.body;
        const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

        const updateData = {};
        if (name && name !== user.name) updateData.name = name;
        if (email && email !== user.email) updateData.email = email;
        if (profileImage && profileImage !== user.profileImage) updateData.profileImage = profileImage;
        if (Object.keys(updateData).length > 0) {
            let n = await User.findByIdAndUpdate(userId, updateData, { new: true });
            const user = await User.findById(userId)
            console.log(user);
            console.log(n)
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully!",
                user
            });
        }
        return res.status(200).json({ success: true, message: "No changes made to the profile." });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }
};
module.exports.signup = async (req, res) => {
    try {
        const { Name, Email, Password } = req.body;
        let newUser = new User({
            name:Name,
            username: Email,
        });
        await User.register(newUser, Password);
       let user =  await newUser.save();
        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user: {
                _id : user._id,
                Name: Name,
                username: user.username,
                profileImg: user.profileImg,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(200).json({
            success: false,
            message: "Error during signup",
            error: err.message,
        });
    }
};
module.exports.login = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(200).json({
                success: false,
                message: "Authentication failed",
            });
        }
        console.log(req.user._id)
        let usesss= await User.findById(req.user._id)
        console.log(usesss)
        res.status(200).json({
            success: true,
            message: "Login successful",

            user: {
                _id : req.user._id,
                name: req.user.name,
                username: req.user.username,
                profileImg: usesss.profileImage,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error during login",
            error: err.message,
        });
    }
};
module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Error in logout",
                error: err.message,
            });
        }
        return res.status(200).json({
            success: true,
            message: "You have successfully logged out",
        });
    });
};
module.exports.changepassword = async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({ username });
console.log("a")
        if (!user) {
            console.log(1)
            return res.status(200).json({
                success: false,
                message: 'User not found',
            });
        }
        user.authenticate(currentPassword, async (err, isMatch) => {
            if (err) {
                console.log(2)
                console.error('Error during authentication:', err);
                return res.status(200).json({
                    success: false,
                    message: 'Authentication error',
                    error: err.message,
                });
            }

            if (!isMatch) {
                console.log(3)
                return res.status(200).json({
                    success: false,
                    message: 'Current password is incorrect',
                });
            }
            user.setPassword(newPassword, async (err) => {
                if (err) {
              
                    console.error('Error setting new password:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Error setting new password',
                        error: err.message,
                    });
                }
                await user.save();
       
                return res.status(200).json({
                    success: true,
                    message: 'Password updated successfully',
                });
            });
        });
    } catch (error) {
        console.error('Error changing password:', error);

        return res.status(200).json({
            success: false,
            message: 'Error changing password',
            error: error.message,
        });
    }
};
module.exports.addpost = async (req, res) => {
    try {

        if (!req.body.text) {
            return res.status(400).json({ message: "Text is required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }
        
        let post = new Post({
            Title: req.body.text,
            imgUri: `/uploads/${req.file.filename}`,
             user:req.query.id
         }); 

         post =  await post.save()    
         console.log(post)
         return res.status(200).json({
            success: true,
            message: 'post added sussefully',
            data: post,
        });
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: 'Error creating post',
            error: error.message,
        });
    }
};
module.exports.addfood = async (req, res) => {
   
    try {
        let foodpost = new FoodPost({
            imgUri: `/uploads/${req.file.filename}`,
            user:req.query.id,
            location: req.body.location,
            quantity: req.body.quantity,
            description: req.body.description,
            foodName: req.body.foodName,
         }); 
         foodpost =  await foodpost.save()    
         return res.status(200).json({
            success: true,
            message: 'post added sussefully',
            data: foodpost,
        });
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: 'Error creating post',
            error: error.message,
        });
    }
};
module.exports.deposit = async (req, res) => {
    try {
        const { cardNumber, cardName, expiryDate, cvv, amount  } = req.body;
   const amounts = parseInt(amount, 10);
        if (!cardNumber || !cardName || !expiryDate || !cvv || !amount) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
                data:null
            });
        }


        // Find the account
        let account = await Account.findOne({ user: req.user._id });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found',
                data:null
            });
        }

        // Update balance
        account.balance += amounts;

        // Add transaction
        account.transactions.push({
            type: 'deposit',
            amount: amounts,
            to: req.user._id
            
        });
        await account.save();
      
        return res.status(200).json({
            success: true,
            message: 'Deposit successful',
            balance: account.balance,
            data:null
        });

    } catch (error) {
        console.log("Fdsfsdfsdfsdf")
        return res.status(500).json({
            success: false,
            message: 'Error in deposit',
            error: error.message,
        });
    }
};
module.exports.Withdrawall = async (req, res) => {
 try{
    const { cardNumber, cardName, amount  } = req.body;
    const amounts = parseInt(amount, 10);
        if (!cardNumber || !cardName || !amount) {
             return res.status(200).json({
                 success: false,
                 message: 'All fields are required',
                 data:null
             });
         }
 
 
         // Find the account
         let account = await Account.findOne({ user: req.user._id });
 
         if (!account) {
             return res.status(200).json({
                 success: false,
                 message: 'Account not found',
                 data:null
             });
         }
         if(account.balance < amount || amount ==0){
            return res.status(200).json({
                success: false,
                message: 'Insufficient balance',
                data: null
            });
        }




//          // Update balance
         account.balance -= amounts;
 
         // Add transaction
         account.transactions.push({
             type: 'withdrawal',
             amount: amounts,
             from: req.user._id
             
         });

     
       
            
    
         await account.save();
     
         return res.status(200).json({
             success: true,
             message: 'Deposit successful',
             balance: account.balance,
             data:"fdsfsd"
         });
   
 
      } catch (error) {
         console.log(error)
         return res.status(500).json({
             success: false,
             message: 'Error in deposit',
             error: error.message,
             
         });
    }
};
module.exports.getAccount = async (req, res) => {

    try {
        let account = await Account.findOne({ user: req.user._id })
        .populate('transactions.to')
        .populate('transactions.from');
      
        if (!account) {
            const a = new Account({
                balance:0,
                user:req.user._id
            });
            account =  await a.save(); 
        }
  
    console.log(account)
        return res.status(200).json({
            success: true,
            message: 'post added sussefully',
            data: account,
        });

       

       
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            success: false,
            message: 'Error  in deposit',
            error: error.message,
        });

    }
};
module.exports.getusername = async (req, res) => {
   

    const WalletID = req.query.id;
    if (!WalletID) {
        return res.status(200).json({
            success: false,
            message: "Wallet address is required.",
            data: null,
        });
    }

    try {
        const account = await Account.findById(WalletID).populate('user');
        return res.status(200).json({
            success: true,
            message: "ok",
            data: account.user.name,
        });


    } catch (error) {
       return res.status(200).json({
            success: false,
            message: "Invalid Wallet address",
            data: null,
        });
    }
};
module.exports.tranfer = async (req, res) => {
    try{
       const {WalletID ,amount  } = req.body;
       const amounts = parseInt(amount, 10);
           if (!WalletID || !amount) {
                return res.status(200).json({
                    success: false,
                    message: 'All fields are required',
                    data:null
                });
            }
            // Find the account
            let account = await Account.findOne({ user: req.user._id });
    
            if (!account) {
                return res.status(200).json({
                    success: false,
                    message: 'Account not found',
                    data:null
                });
            }
            if(account.balance < amount || amount ==0){
               return res.status(200).json({
                   success: false,
                   message: 'Insufficient balance',
                   data: null
               });
           }

           let resiver = await Account.findById(WalletID);
           if (!resiver) {
            return res.status(200).json({
                success: false,
                message: 'Invalid Wallet address',
                data:null
            });
        }
            account.balance -= amounts;
            resiver.balance += amounts;

            account.transactions.push({
                type: 'withdrawal',
                amount: amounts,
                from: req.user._id,
                to: resiver.user


                
            });
            resiver.transactions.push({
                type: 'deposit',
                amount: amounts,
                from: req.user._id,
                to: resiver.user
            });
   
            await resiver.save();
            await account.save();
        
            return res.status(200).json({
                success: true,
                message: 'Deposit successful',
                balance: account.balance,
                data:"fdsfsd"
            });
      
    
         } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: 'Error in deposit',
                error: error.message,
                
            });
       }
};
module.exports.getmywallet = async(req, res)=>{
console.log(req.user._id)

let account = await Account.findOne({user:req.user._id});
try{
return res.status(200).json({
    success: true,
    message: "ok",
    data: {
       name: req.user.name,
       walletid: account._id

    },
});
}catch(e){
    return res.status(200).json({
        success: false,
        message: "invalid user error",
        data:null,
        error:e
    });
}


}