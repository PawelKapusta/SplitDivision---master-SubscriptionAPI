import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger";
import {
  ErrorType,
  SubscriptionAttributes,
  SubscriptionsUsersAttributes,
  UpdateSubscriptionRequest,
  UserSubscriptionFormData,
} from "../constants/constants";
import Subscription from "../models/subscriptionModel";
import SubscriptionsUsers from "../models/subscriptionsUsersModel";
import { Op } from "sequelize";

const router = express.Router();

router.get(
  "/api/v1/subscriptions",
  async (req: Request, res: Response<SubscriptionAttributes[] | ErrorType>) => {
    try {
      const subscriptions: SubscriptionAttributes[] = await Subscription.findAll();

      if (!subscriptions) {
        return res.status(404).send("Subscriptions not found");
      }

      return res.status(200).json(subscriptions);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.get(
  "/api/v1/subscriptions/bought",
  async (req: Request, res: Response<SubscriptionsUsersAttributes[] | ErrorType>) => {
    try {
      const subscriptionsBought: SubscriptionsUsersAttributes[] =
        await SubscriptionsUsers.findAll();

      if (!subscriptionsBought) {
        return res.status(404).send("Subscriptions bought not found");
      }

      return res.status(200).json(subscriptionsBought);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.get(
  "/api/v1/subscriptions/:id",
  async (req: Request<{ id: string }>, res: Response<SubscriptionAttributes | ErrorType>) => {
    const subscriptionId: string = req.params.id;
    try {
      const subscription: SubscriptionAttributes = await Subscription.findByPk(subscriptionId);

      if (!subscription) {
        return res.status(404).send("Subscription not found");
      }

      return res.status(200).json(subscription);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.get(
  "/api/v1/subscriptions/user/:id",
  async (req: Request, res: Response<SubscriptionAttributes[] | ErrorType>) => {
    const userId: string = req.params.id;

    try {
      const subscriptionsUsers: SubscriptionsUsers[] = await SubscriptionsUsers.findAll({
        where: {
          user_id: userId,
        },
      });

      const subscriptionsIds: string[] = subscriptionsUsers.map(
        subscription => subscription.dataValues.subscription_id,
      );

      const subscriptions: SubscriptionAttributes[] = await Subscription.findAll({
        where: {
          id: {
            [Op.in]: subscriptionsIds,
          },
        },
      });

      if (!subscriptions) {
        return res.status(404).send("Subscriptions not found");
      }

      return res.status(200).json(subscriptions);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.post(
  "/api/v1/subscriptions",
  async (
    req: Request<Omit<SubscriptionAttributes, "id">>,
    res: Response<SubscriptionAttributes | ErrorType>,
  ) => {
    const { type, currency_type, currency_code, features }: Omit<SubscriptionAttributes, "id"> =
      req.body;

    try {
      const newSubscription: SubscriptionAttributes = await Subscription.create({
        id: uuidv4(),
        type,
        currency_type,
        currency_code,
        features,
      });

      return res.status(201).json(newSubscription);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.post(
  "/api/v1/subscriptions/user",
  async (
    req: Request<Omit<UserSubscriptionFormData, "id">>,
    res: Response<SubscriptionsUsersAttributes | ErrorType>,
  ) => {
    const { user_id, subscription_id }: Omit<UserSubscriptionFormData, "id"> = req.body;

    try {
      const newSubscriptionsUsers: SubscriptionsUsers = await SubscriptionsUsers.create({
        id: uuidv4(),
        subscription_id,
        user_id,
      });

      return res.status(201).json(newSubscriptionsUsers);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.put(
  "/api/v1/subscriptions/:id",
  async (req: UpdateSubscriptionRequest, res: Response<SubscriptionAttributes | ErrorType>) => {
    const subscriptionId: string = req.params.id;
    const { type, currency_type, currency_code, features }: Partial<SubscriptionAttributes> =
      req.body;

    try {
      const subscription = await Subscription.findOne({ where: { id: subscriptionId } });
      if (!subscription) {
        return res.status(404).send("This subscription not exists in the system");
      }

      const updatedData: Partial<SubscriptionAttributes> = {
        type,
        currency_type,
        currency_code,
        features,
      };

      const dataToUpdate = Object.keys(updatedData).filter(key => updatedData[key] !== undefined);

      dataToUpdate.forEach(key => (subscription[key] = updatedData[key]));

      await subscription.save();

      return res.status(200).json(subscription);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.delete(
  "/api/v1/subscriptions/:id",
  async (req: Request<{ id: string }>, res: Response<string | ErrorType>) => {
    try {
      const subscriptionId: string = req.params.id;

      const deletedSubscription = await Subscription.destroy({ where: { id: subscriptionId } });

      if (!deletedSubscription) {
        return res.status(404).send("Subscription with this id not exists in the system");
      }

      return res.status(200).send("Subscription successfully deleted from the system!");
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

export default router;
