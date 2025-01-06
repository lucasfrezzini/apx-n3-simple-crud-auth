import { DataTypes } from "sequelize";
import { sequelize } from "../db/index";

export const User = sequelize.define("User", {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  birthdate: DataTypes.DATE,
});
