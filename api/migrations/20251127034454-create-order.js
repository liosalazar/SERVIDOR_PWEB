'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      fecha_orden: {
        type: Sequelize.DATE
      },
      total: {
        type: Sequelize.DECIMAL
      },
      estado: {
        type: Sequelize.ENUM('Pendiente', 'Completada', 'Cancelada'),
        defaultValue: 'Pendiente',
        allowNull: false
      },
      direccion_envio: {
        type: Sequelize.STRING
      },
      metodo_pago: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};