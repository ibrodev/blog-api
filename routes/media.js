const media = require("express").Router();
const mongoose = require("mongoose");
const fs = require("fs");
const createError = require("http-errors");
const _ = require("lodash");
const fileUpload = require("express-fileupload");

const { authentication } = require("../middlewares/auth");
const Media = require("../models/Media");
const { buildURL } = require("../helpers/string");
const { trimStart } = require("lodash");

const uploadPath = process.env.UPLOAD_PATH || "./uploads";
const tempFileDir = `${uploadPath}/tmp`;

media.use(authentication);

media.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(createError.BadRequest("Invalid media id"));

  try {
    const media = await Media.findOne({ _id: id });
    if (!media)
      return res.status(404).json(`No media found with this (${id}) id`);

    if (media.uploadedBy.toString() !== req.userID)
      return res.status(403).json("Not authorized");

    const deletedMedia = await media.deleteOne();

    await fs.rmSync(trimStart(deletedMedia.path));

    res.status(204);
  } catch (err) {
    console.log(err.message);
    return next(createError.InternalServerError());
  }
});

media.use(
  fileUpload({
    createParentPath: true,
    uriDecodeFileNames: true,
    abortOnLimit: true,
    responseOnLimit: "File exceeds maximum upload size",
    limits: { fileSize: 2 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir,
    parseNested: true,
    debug: process.env.APP_ENV === "development" ? true : false,
  })
);

media.post("/", async (req, res, next) => {
  try {
    const { files } = req;
    const date = new Date();
    const Year = date.getFullYear();
    const Month = date.getMonth();

    if (!files || _.isEmpty(files))
      return res.status(400).json("media file not found");

    for (const file in files) {
      const { name, size, mimetype } = files[file];
      const {
        APP_PROTOCOL = "http",
        APP_HOST = "localhost",
        APP_PORT = 8000,
      } = process.env;

      const uploadedBy = req.userID;

      const path = `${uploadPath}/${Year}/${Month}/${name}`;

      if (fs.existsSync(path)) {
        await fs.rmSync(files[file].tempFilePath);
        return res
          .status(409)
          .json(`a file with this (${name}) name already exist!`);
      }

      const url = await buildURL(APP_PROTOCOL, APP_HOST, APP_PORT, path);

      const media = new Media({ name, size, path, url, mimetype, uploadedBy });

      await media.save();

      files[file].mv(path);
    }

    res.status(201).json("File upload successful");
  } catch (err) {
    console.log(err.message);
    return next(createError.InternalServerError());
  }
});

module.exports = media;
