import { Sequelize } from "sequelize";
import {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_LOGGING,
} from "../config/index.js";

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mssql",
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  },
  pool: {
    max: 15,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: DB_LOGGING,
});

// models
import UserModel from "../models/user.model.js";
import CompanyModel from "../models/company.model.js";

export const User = UserModel(sequelize);
export const Company = CompanyModel(sequelize);

// associations
User.belongsTo(Company, { foreignKey: "companyId", as: "company" });
Company.hasMany(User, { foreignKey: "companyId", as: "employees" });

export const connectDb = async () => {
  await sequelize.authenticate();
  // do not use sync({ force: true }) in prod; use migrations
  // await sequelize.sync({ alter: true });
  console.log("Sequelize connected to SQL Server");
};
