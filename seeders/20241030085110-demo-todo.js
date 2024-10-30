'use strict';
module.exports = {
  
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Todos', [
      {
        title: 'First Todo',
        description: 'This is a sample todo item',
        date: new Date().toISOString().split('T')[0],
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Second Todo',
        description: 'This is another todo item',
        date: new Date().toISOString().split('T')[0],
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Third Todo',
        description: 'This is a third todo item',
        date: new Date().toISOString().split('T')[0],
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Todos', null, {});
  }
};