const multer = require("multer");
const path = require("path");
const fs = require("fs");

const makeStorage = (folder) => {
  const dir = path.join(__dirname, "..", "uploads", folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${req.user.id}-${Date.now()}${ext}`);
    },
  });
};

const resumeFilter = (req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx"];
  if (allowed.includes(path.extname(file.originalname).toLowerCase()))
    cb(null, true);
  else cb(new Error("Only PDF/DOC/DOCX files are allowed"));
};

const imageFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".webp"];
  if (allowed.includes(path.extname(file.originalname).toLowerCase()))
    cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

const uploadResume = multer({
  storage: makeStorage("resumes"),
  fileFilter: resumeFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB maximum file size
});

const uploadProfilePic = multer({
  storage: makeStorage("profilePics"),
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

const uploadCompanyLogo = multer({
  storage: makeStorage("companyLogos"),
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = { uploadResume, uploadProfilePic, uploadCompanyLogo };
