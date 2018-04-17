const multer = require('multer');
const path = require('path')
const db = require('../../config/database.js');
const fs = require('fs')

// multer configuration for profile image upload
const userAvatar = multer({
    dest: 'public/userFiles/userAvatars/',
    limits: {
        fileSize: 5e+6
    },

    fileFilter: function (req, file, cb, res) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        const filesize = filetypes.test(file.size);
        if (mimetype && extname) {
            return cb(null, true);
        } else {

            cb(" We only support PNG, GIF,JPEG or JPG pictures.")
        }
    }
}).single('userAvatar');



//multer configuration for file upload
const uploadProductFile = multer({
    dest: 'public/userFiles/productFile',
    limits: {
        fileSize: 3e+8,
    },

    fileFilter: function (req, file, cb) {
        const filetypes = /zip|tar|7z|rar/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('We only support zip, tar, 7z or rar type of compression. ')
        }
    }
}).single('productFile')





// multer configuration for product image upload
const uploadProductImage = multer({
    dest: 'public/userFiles/productImages',
    limits: {
        fileSize: 2e+7
    },

    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {

            cb(" We only support PNG, GIF, or JPG pictures.")
        }
    }
}).single('productImage')





///profile image 
module.exports.getUploadProfileAvatar = (req, res, next) => {
    let userId = req.user.id;
    db.query("SELECT  avatar,username about  FROM  users WHERE users.id = ?", [userId], function (err, results, fields) {
        res.render('./account/all-users/settings/profile-avatar', {
            'results': results[0]
        })
    })
}






module.exports.postUploadProfileAvatar = function (req, res, next) {
    db.query('SELECT avatar FROM users WHERE id = ?', [req.user.id], function (err, results, fields) {
        if (err) {
            console.log('[mysql error]', err)
        } else if (results[0].avatar !== null) {
            res.render('./account/all-users/settings/profile-avatar', {
                'results': results[0],
                msgError: 'PLease delete old image first by pressing delete button.'
            })

        } else {
            userAvatar(req, res, function (err) {
                let avatarImage = req.file.filename;
                if (err) {
                    res.render('./account/all-users/settings/profile-avatar', {
                        msgError: err
                    })
                } else if (req.file == undefined) {
                    res.render('./account/all-users/settings/profile-avatar', {
                        msgError: 'Please select image'
                    })
                } else {
                    let avatarImage = req.file.filename;
                    let userId = req.user.id
                    db.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarImage, userId], function (err, results) {
                        if (err) throw err;
                        console.log('success')
                        req.flash('success_msg', {
                            msg: 'Image was succesfull uploaded'
                        })
                        res.redirect('/profile');


                    }) //update query ends

                }

            })

        }
    }) //select  query ends
}




///delete old profile image
module.exports.deleteUserProfileImage = function (req, res, next) {
    let id = req.user.id;
    db.query(`SELECT avatar FROM users  WHERE id =${id}`, function (err, results) {
        if (err) throw err;
        if (results[0].avatar) {
            fs.unlink("./public/userFiles/userAvatars/" + results[0].avatar, function (err) {

                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });
        }

        db.query(`UPDATE users SET avatar = ?  WHERE id =${id}`, [null], function (err, result) {
            if (err) throw err;

            req.flash('success_msg', {
                msg: "Image removed.Now you can upload new image."
            });
            res.redirect('back');
        })
    })

};





//post product image

module.exports.postProductImage = function (req, res, next) {

    uploadProductImage(req, res, function (err) {
        if (err) {

            res.render('./products/add-product-image', {
                msgError: err
            })
        } else if (req.file == undefined) {
            res.render('./products/add-product-image', {
                msgError: 'Please select image .'
            })
        } else {


            db.query('SELECT LAST_INSERT_ID()  as product_id ', function (err, result, fields) {
                if (err) {
                    console.log('[mysql error]', err)
                }
                let productImage = req.file.filename;
                let product_id = result[0].product_id

                let image = {
                    stage1: 'imageApproved',
                    image: productImage,

                }
                db.query('UPDATE  products SET ? WHERE id = ? AND user_id = ?  ', [image, product_id, req.user.id], function (err, result) {
                    if (err) {
                        console.log('[mysql error]', err)
                    } else {

                        console.log('posted')

                        res.render('./products/add-file')
                    }
                })

            })
        }

    })


}
///get product image update
module.exports.getProductImageUpdate = (req, res, next) => {
    let Todaydate = Date.now()
    db.query(`SELECT products.id as productId , products.image, products.user_id, users.membership_aproved_date,users.type  FROM products LEFT JOIN users ON products.user_id = users.id WHERE products.id =${req.params.id}`, function (err, results, fields) {
        console.log(results)
        if (err) {
            console.log('[mysql error]', err)
        } else if (results[0].type === 'basic') {
            res.render('./products/update-product-image', {
                'results': results[0]
            })
        } else if (results[0].type === 'pro' && results[0].membership_aproved_date < Todaydate) {
            res.render('./pages/membershipExpired')
        } else if (results[0].type === 'pro' && results[0].membership_aproved_date > Todaydate) {
            res.render('./products/update-product-image', {
                'results': results[0]
            })
        } else {
            res.redirect('/login')
        }



    })
}


///delete product image
module.exports.postProductImageDelete = (req, res, next) => {
    let id = req.params.id;
    db.query(`SELECT image FROM  products  WHERE id =${id}`, function (err, results) {
        if (err) throw err;
        if (results[0].image) {
            fs.unlink("./public/userFiles/productImages/" + results[0].image, function (err) {

                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });
        }

        db.query(`UPDATE products SET image  = ?  WHERE id =${id}`, [null], function (err, result) {
            if (err) throw err;

            req.flash('success_msg', {
                msg: "Image removed.Now you can upload new image."
            });
            res.redirect('back');
        })
    })
}
module.exports.postProductImageUpdate = (req, res, next) => {

    db.query(`SELECT image, id as productId FROM  products WHERE  id = ${req.params.id}`, function (err, results, fields) {
        if (err) {
            console.log('[mysql error]', err)
        } else if (results[0].image !== null) {
            res.render('./products/update-product-image', {
                'results': results[0],
                msgError: 'PLease delete old image first by pressing delete button.'
            })

        } else {


            uploadProductImage(req, res, function (err) {
                if (err) {

                    res.render('./products/update-product-image', {
                        msgError: err
                    })


                } else if (req.file == undefined) {
                    res.render('./products/update-product-image', {
                        msgError: 'Please select image .'
                    })
                } else {


                    db.query('UPDATE  products SET image = ? WHERE id = ?  ', [req.file.filename, req.params.id], function (err, result) {
                        if (err) {
                            console.log('[mysql error]', err)
                        } else {

                            console.log('posted')
                            req.flash('success_msg', {
                                msg: 'Image was succesfull uploaded'
                            })
                            res.redirect('back')
                        }
                    })


                }

            })
        }
    })

}



//file upload
module.exports.postProductFile = (req, res, next) => {

    // res.send('ok')
    uploadProductFile(req, res, function (err) {
        if (err) {

            res.render('./products/add-file', {
                msgError: err
            })


        } else if (req.file == undefined) {
            res.render('./products/add-file', {
                msgError: 'Please select file .'
            })
        } else {


            db.query('SELECT LAST_INSERT_ID()  as product_id ', function (err, result, fields) {
                if (err) {
                    console.log('[mysql error]', err)
                }
                let productFile = req.file.filename;
                let product_id = result[0].product_id
                let file_format = req.file.mimetype
                let product = {
                    stage1: 'imageApproved',
                    product_file: productFile,
                    product_file_format: file_format
                }
                db.query('UPDATE  products SET ? WHERE id = ?  AND user_id = ? ', [product, product_id, req.user.id], function (err, result) {
                    if (err) {
                        console.log('[mysql error]', err)
                    } else {

                        console.log('posted')
                        req.flash('success_msg', {
                            msg: 'Your product was successfully posted.We gonna review your product and give an answer in 24 hours'
                        })
                        res.redirect('/product/list')
                    }


                })

            })
        }
    })

};



module.exports.getDownload = (req, res, next) => {
    res.download(`./public/userFiles/productFile/${req.params.id}`)
}