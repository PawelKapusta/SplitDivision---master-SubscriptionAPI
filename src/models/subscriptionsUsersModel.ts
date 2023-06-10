import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/config";
import { SubscriptionsUsersAttributes } from "../constants/constants";

class SubscriptionsUsers
  extends Model<SubscriptionsUsersAttributes, Optional<SubscriptionsUsersAttributes, "id">>
  implements SubscriptionsUsersAttributes
{
  public id!: string;
  public subscription_id!: string;
  public user_id!: string;
}

SubscriptionsUsers.init(
  {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    subscription_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "subscriptions_users",
    timestamps: false,
  },
);

export default SubscriptionsUsers;
