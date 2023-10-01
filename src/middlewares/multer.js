const multer = require("multer");
const moment = require("moment");
const fileUploader = ({
  destinationFolder = "",
  prefix = "",
  filetype = "",
}) => {
  const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${__dirname}/../public/images/${destinationFolder}`);
    },
    filename: (req, file, cb) => {
      const fileExtension = file.mimetype.split("/")[1];
      const fileName =
        prefix + `_${moment().format("YYYY-MM-DD-HH-mm-ss")}.` + fileExtension;
      cb(null, fileName);
    },
  });

  const uploader = multer({
    storage: storageConfig,
    limits: { fieldSize: 25 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.split("/")[0] != filetype) {
        return cb(null, false);
      }
      return cb(null, true);
    },
  });

  return uploader;
};

const blobUploader = ({ filetype }) => {
  return multer({
    fileFilter: (req, file, cb) => {
      if (file.mimetype.split("/")[0] != filetype) {
        return cb(null, false);
      }
      return cb(null, true);
    },
    limits: { fieldSize: 25 * 1024 * 1024 },
  });
};

module.exports = { fileUploader, blobUploader };
