import { DataTypes } from "sequelize";

export default (sequelize) => {
  const UserActionLog = sequelize.define(
    "UserActionLog",
    {
      actionId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      /****
       * e.g. LOGIN, LOGOUT, TRANSFER_FUEL, RECHARGE, KYC_UPDATE
       * OTP_VERIFY_FAIL - Failed OTP verification attempts
       * OTP_VERIFY_SUCCESS - Successful OTP verification
       */
      actionType: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      actionDetails: {
        type: DataTypes.JSON, // store payload or metadata (e.g. amount, QR ID, station ID)
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING(45),
      },
      device: {
        type: DataTypes.STRING(100),
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "user_action_logs",
      timestamps: false,
    }
  );

  UserActionLog.associate = (models) => {
    UserActionLog.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return UserActionLog;
};
