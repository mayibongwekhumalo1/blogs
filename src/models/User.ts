import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  provider: { type: String, enum: ["credentials", "google", "facebook"], default: "credentials" },
});

const User = models.User || model("User", userSchema);
export default User;
