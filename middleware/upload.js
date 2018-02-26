
const multer = require('multer');


function Uploader(req, res, next) {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {

            cb(null, 'public/images');

        },
        filename: function (req, file, cb) {
            cb(null, filename)
        }
    });

    var upload = multer({
        storage: storage
    });

    return upload;
}

module.exports = Uploader