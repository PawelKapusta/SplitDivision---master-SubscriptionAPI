export interface UserAttributes {
  id: string;
  first_name: string;
  last_name: string;
  password: string;
  username: string;
  gender: string;
  service: string;
  email: string;
  phone: string;
  birth_date: Date;
  is_admin: boolean;
  is_blocked: boolean;
  avatar_image: string;
}

export interface SubscriptionAttributes {
  id: string;
  type: string;
  currency_type: string;
  currency_code: string;
  features: Record<string, unknown>;
}

export type ErrorType = string | { error: string };

export type UpdateSubscriptionRequest = {
  params: {
    id: string;
  };
  body: Partial<SubscriptionAttributes>;
};
