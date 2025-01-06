import { DataTypes } from "sequelize";
import { sequelize } from "../db/index";

export const Auth = sequelize.define("Auth", {
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  user_id: DataTypes.INTEGER,
});
