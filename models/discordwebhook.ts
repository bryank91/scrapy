import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import Monitor from './monitor';

interface DiscordWebhookAttributes {
    id: string;
    name: string;
    webhookId: string;
    webhookToken: string;
};

interface DiscordWebhookCreationAttributes
  extends Optional<DiscordWebhookAttributes, 'id'> {}

interface DiscordWebhookInstance
  extends Model<DiscordWebhookAttributes, DiscordWebhookCreationAttributes>,
    DiscordWebhookAttributes {
      createdAt: Date;
      updatedAt: Date;
    }

const DiscordWebhook = sequelize.define<DiscordWebhookInstance>(
    'DiscordWebhook',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.UUID
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        webhookId: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        webhookToken: {
            allowNull: false,
            type: DataTypes.STRING,
        }
    }
);

DiscordWebhook.hasMany(Monitor, {
    sourceKey: 'id',
    foreignKey: 'discordWebhookId',
    as: 'monitors'
});

export default DiscordWebhook;
