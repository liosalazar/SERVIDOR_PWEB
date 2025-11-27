import { sequelize } from "../db";
import { DataTypes } from "sequelize";

export const producto = sequelize.define(
    "producto",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categoriaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "categoria",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        descripcion: DataTypes.STRING,
        precio: DataTypes.FLOAT,
        imagen_url: DataTypes.STRING,
        stock: DataTypes.INTEGER,
    }, { freezeTableName: true }
);