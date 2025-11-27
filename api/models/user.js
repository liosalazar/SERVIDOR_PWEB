'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    rol: DataTypes.STRING,
    activo: DataTypes.BOOLEAN,
    pais: DataTypes.STRING,
    celular: DataTypes.STRING,
    imagen_url: DataTypes.STRING,
    recovery_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};