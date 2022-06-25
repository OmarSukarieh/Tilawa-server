const { default: axios } = require("axios");
const asyncHandler = require("../utils/async");
const ErrorResponse = require("../utils/errorResponse");
const QuranData = require("../constant/hafsData_v18.json");
const config = require("../config/app");

const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

exports.getAiController = asyncHandler(async (req, res, next) => {
  if (!req.files) return next(new ErrorResponse(`Please add files to uploaded`, 400));
  let file = req.files.file;

  if (Array.isArray(file)) return next(new ErrorResponse(`Please upload one file only`, 400));

  if (!file) return next(new ErrorResponse(`Please add files to uploaded`, 400));

  if (
    file.mimetype.startsWith("audio") && file.mimetype.endsWith("wav")
  ) {
    return next(new ErrorResponse(`Please upload an audio wav file`, 400));
  }

  const pathChat = config.fileUploadPathAi + '/';

  if (!fs.existsSync(pathChat)) {
    fs.mkdirSync(pathChat);
  }

  file.mv(pathChat + file.name,
    async (err) => {
      if (err) {
        console.error(err);

        return next(new ErrorResponse("Problem with file upload", 500));
      }
    }
  );

  const formData = new FormData();
  formData.append("file", fs.createReadStream(pathChat + file.name));

  const { soraId, ayaId } = req.body;


  const response = await axios.post("http://192.168.43.144:4400/hello", formData);

  const aiString = response.data.string;

  let orginalString;
  QuranData.map((ayaDetails) => {
    if (ayaDetails.sora.toString() === soraId.toString() && ayaDetails.aya_no.toString() === ayaId.toString()) {
      const a = parseInt(ayaId.toString().length) + 1;
      orginalString = ayaDetails.aya_text.slice(0, -a);
    }
  });

  const aiArr = aiString[0].split(" ");
  const orginalArr = orginalString.split(" ");
  const falseWord = [];
  for (i = 0; i < orginalArr.length; i++) {
    if (orginalArr[i] !== aiArr[i]) {
      falseWord.push(i);
    }
  }

  // //   console.log(aiArr);
  // //   console.log(orginalArr.length);

  console.log({
    success: true,
    aiString,
    orginalString,
    falseWord,
  })

  res.json({
    success: true,
    aiString,
    orginalString,
    falseWord,
  });
});