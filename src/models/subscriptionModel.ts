import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/config";
import { SubscriptionAttributes } from "../constants/constants";

class Subscription
  extends Model<SubscriptionAttributes, Optional<SubscriptionAttributes, "id">>
  implements SubscriptionAttributes
{
  public id!: string;
  public type!: string;
  public currency_type!: string;
  public currency_code!: string;
  public features!: Record<string, unknown>;
}

Subscription.init(
  {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    currency_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    currency_code: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "subscriptions",
    timestamps: false,
  },
);

// User.belongsToMany(Subscription, { through: "subscriptions_users" });
// Subscription.belongsToMany(User, { through: "subscriptions_users" });

export default Subscription;
