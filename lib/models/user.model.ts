import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  likedThreads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
      default: [],
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
