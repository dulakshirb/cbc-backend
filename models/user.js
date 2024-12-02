import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "customer",
  },
  profilePicture: {
    type: String,
    default:
      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1731901835~exp=1731905435~hmac=a9d038e6207b1eb82a34015c511e830f04065520907cdd52762ac8bd79a55c69&w=740",
  },
});

const User = mongoose.model("users", userSchema);

export default User;
