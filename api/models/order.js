'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    fecha_orden: DataTypes.DATE,
    total: DataTypes.DECIMAL,
    estado: DataTypes.STRING,
    direccion_envio: DataTypes.STRING,
    metodo_pago: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};