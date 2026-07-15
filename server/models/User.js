const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: {
      type: String,
      enum: ["candidate", "recruiter"],
      default: "candidate",
    },

    profilePic: { type: String, default: "" },

    // Candidate-only fields
    skills: [{ type: String }],
    experience: [
      {
        title: String,
        company: String,
        from: Date,
        to: Date,
        description: String,
      },
    ],
    education: [
      {
        school: { type: String, required: true },
        degree: { type: String, default: "" },
        year: { type: String, default: "" },
      },
    ],

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    resumeUrl: { type: String, default: "" },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    github: { type: String, default: "" }, // ⬅ added, was missing entirely

    // Recruiter-only field
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
