import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import Monitor from './monitor';

interface TemplateAttributes {
    id: string;
    header: string;
    footer: string;
    domain: string;
};

interface TemplateCreationAttributes
  extends Optional<TemplateAttributes, 'id'> {}

interface TemplateInstance
  extends Model<TemplateAttributes, TemplateCreationAttributes>,
    TemplateAttributes {
      createdAt: Date;
      updatedAt: Date;
    }

const Template = sequelize.define<TemplateInstance>(
    'Template',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.UUID
        },
        header: {
            allowNull: false,
            type: DataTypes.STRING
        },
        footer: {
            allowNull: true,
            type: DataTypes.STRING
        },
        domain: {
            allowNull: true,
            type: DataTypes.STRING
        }
    }
);

Template.hasMany(Monitor, {
    sourceKey: 'id',
    foreignKey: 'templateId',
    as: 'monitors'
});

export default Template;
