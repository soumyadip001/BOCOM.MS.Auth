import { DataTypes } from "sequelize";

export default (sequelize) => {
  const UserSession = sequelize.define(
    "UserSession",
    {
      sessionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      device: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      browser: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      operatingSystem: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "user_sessions",
      timestamps: false, // we already track createdAt manually
    }
  );

  // Associations
  UserSession.associate = (models) => {
    UserSession.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return UserSession;
};
