import { sequelize } from "../db";
import { DataTypes } from "sequelize";

export const categoria = sequelize.define(
    "categoria",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, { freezeTableName: true }
);