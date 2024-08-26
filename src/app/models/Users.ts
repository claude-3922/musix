import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  sessionToken: String,
});

const Users = mongoose.models.Users || mongoose.model("Users", usersSchema);
export default Users;
