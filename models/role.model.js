import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Role = sequelize.define(
    "Role",
    {
      roleId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      roleName: {
        type: DataTypes.STRING(50), // 'Individual'|'CorporateAdmin'|'Employee'
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "roles",
      timestamps: true,
    }
  );

  return Role;
};
