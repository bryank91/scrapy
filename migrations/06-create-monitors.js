'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Monitors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      siteUrl: {
        allowNull: false, 
        type: Sequelize.STRING
      },
      selector: {
        allowNull: false, 
        type: Sequelize.STRING
      },
      frequencySeconds: {
        allowNull: true, // defaults to 60s
        type: Sequelize.INTEGER
      },
      differencesId: { // relationship with Template
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {        
          model: 'Differences',
          key: 'id'
        }  
      },
      templateId: { // relationship with Template
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {        
          model: 'Templates',
          key: 'id'
        }
      },
      discordWebhookId: { // relationship with DiscordWebhook
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {        
          model: 'DiscordWebhooks',
          key: 'id'
        }
      },
      nestedSelectorsId: { // relationship with DiscordWebhook
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {        
          model: 'NestedSelectors',
          key: 'id'
        }
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Monitors');
  }
};