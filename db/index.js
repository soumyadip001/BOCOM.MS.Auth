import { Sequelize } from "sequelize";
import {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
} from "../config/index.js";

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT || 3306,
  dialect: "mysql",
  pool: {
    max: 15,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// models
import UserModel from "../models/user.model.js";
import CompanyModel from "../models/company.model.js";
import UserSessionModel from "../models/userSession.model.js";
import RefreshSessionModel from "../models/refreshSession.model.js";
import KYCDocumentModel from "../models/kycDocument.model.js";
import KYCDocumentHistoryModel from "../models/kycDocumentHistory.model.js";
import PasswordChangeLogModel from "../models/passwordChangeLog.model.js";
import UserActionLogModel from "../models/userActionLog.model.js";
import NotificationLogModel from "../models/notificationLog.model.js";
import RoleModel from "../models/role.model.js";
import PermissionModel from "../models/permission.model.js";
import RolePermissionModel from "../models/rolePermission.model.js";
import OtpCodeModel from "../models/otpCode.model.js";

export const User = UserModel(sequelize);
export const Company = CompanyModel(sequelize);
export const UserSession = UserSessionModel(sequelize);
export const RefreshSession = RefreshSessionModel(sequelize);
export const KYCDocument = KYCDocumentModel(sequelize);
export const KYCDocumentHistory = KYCDocumentHistoryModel(sequelize);
export const PasswordChangeLog = PasswordChangeLogModel(sequelize);
export const UserActionLog = UserActionLogModel(sequelize);
export const NotificationLog = NotificationLogModel(sequelize);
export const Role = RoleModel(sequelize);
export const Permission = PermissionModel(sequelize);
export const RolePermission = RolePermissionModel(sequelize);
export const OtpCode = OtpCodeModel(sequelize);

// Associations
User.belongsTo(Company, { foreignKey: "companyId", as: "company" });
Company.hasMany(User, { foreignKey: "companyId", as: "employees" });

User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
Role.hasMany(User, { foreignKey: "roleId", as: "users" });

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "roleId",
  otherKey: "permissionId",
  as: "permissions",
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles",
});

User.hasMany(KYCDocument, { foreignKey: "userId", as: "kycDocuments" });
KYCDocument.belongsTo(User, { foreignKey: "userId", as: "user" });

// User.hasMany(UserSession, { foreignKey: "userId", as: "sessions" });
// UserSession.belongsTo(User, { foreignKey: "userId", as: "user" });

RefreshSession.belongsTo(User, { foreignKey: "userId", as: "user" });

KYCDocument.hasMany(KYCDocumentHistory, {
  foreignKey: "kycDocumentId",
  as: "history",
});
KYCDocumentHistory.belongsTo(KYCDocument, {
  foreignKey: "kycDocumentId",
  as: "document",
});

User.hasMany(PasswordChangeLog, { foreignKey: "userId", as: "passwordLogs" });
PasswordChangeLog.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(UserActionLog, { foreignKey: "userId", as: "actionLogs" });
UserActionLog.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(NotificationLog, { foreignKey: "userId", as: "notifications" });
NotificationLog.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(OtpCode, { foreignKey: "userId", as: "otps" });
OtpCode.belongsTo(User, { foreignKey: "userId", as: "user" });

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize connected to MySQL");
  } catch (error) {
    console.error(
      "❌ Unable to connect to the database:",
      DB_USER,
      DB_PASSWORD
    );
    console.error("   Name:", error.name);
    console.error("   Message:", error.message);
    console.error("   Parent:", error.parent?.sqlMessage || error.parent);
    console.error("   Stack:", error.stack);
    process.exit(1);
  }
};
