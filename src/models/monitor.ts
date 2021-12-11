import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import Difference from './difference';
import DiscordWebhook from './discordwebhook';
import MonitorType from './monitortype';
import NestedSelector from './nestedselector';
import Template from './template';

interface MonitorAttributes {
    id: string;
    name: string;
    siteUrl: string;
    selector: string;
    frequencySeconds: number;
    differenceId: string;
    discordWebhookId: string;
    monitorTypeId: string;
    nestedSelectorId: string;
    templateId: string;
};

interface MonitorCreationAttributes
  extends Optional<MonitorAttributes, 'id'> {}

interface MonitorInstance
  extends Model<MonitorAttributes, MonitorCreationAttributes>,
    MonitorAttributes {
      createdAt: Date;
      updatedAt: Date;
    }

const Monitor = sequelize.define<MonitorInstance>(
    'Monitor',
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
        siteUrl: {
            allowNull: false,
            type: DataTypes.STRING
        },
        selector: {
            allowNull: true,
            type: DataTypes.STRING
        },
        frequencySeconds: {
            allowNull: true,
            defaultValue: 60,
            type: DataTypes.INTEGER
        },
        discordWebhookId: {
            allowNull: false,
            type: DataTypes.UUID,
        },
        differenceId: {
            allowNull: false,
            type: DataTypes.UUID,
        },
        monitorTypeId: {
            allowNull: false,
            type: DataTypes.UUID,
        },
        nestedSelectorId: {
            allowNull: false,
            type: DataTypes.UUID,
        },
        templateId: {
            allowNull: false,
            type: DataTypes.UUID,
        }
    }
);

// Monitor.belongsTo(DiscordWebhook, {
//     foreignKey: 'discordWebhookId',
//     as: 'discordWebhook'
// });

// Monitor.belongsTo(Difference, {
//     foreignKey: 'differenceId',
//     as: 'difference'
// });

// Monitor.belongsTo(MonitorType, {
//     foreignKey: 'monitorTypeId',
//     as: 'monitorType'
// });

// Monitor.belongsTo(NestedSelector, {
//     foreignKey: 'nestedSelectorId',
//     as: 'nestedSelector'
// });

// Monitor.belongsTo(Template, {
//     foreignKey: 'templateId',
//     as: 'template'
// });

export default Monitor;
