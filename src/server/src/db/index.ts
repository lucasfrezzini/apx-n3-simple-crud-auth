import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "postgresql://neondb_owner:eka9rExwP5zd@ep-long-violet-a5ram0nc.us-east-2.aws.neon.tech/neondb?sslmode=require"
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
