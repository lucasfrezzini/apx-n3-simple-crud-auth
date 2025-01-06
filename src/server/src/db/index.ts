import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "postgresql://neondb_owner:I9iLdQF6AuEJ@ep-autumn-scene-a5sdfrjt.us-east-2.aws.neon.tech/neondb?sslmode=require"
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
