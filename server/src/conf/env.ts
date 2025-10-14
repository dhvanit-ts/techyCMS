import "dotenv/config";
import { z } from "zod";

const zodObject = {
  PORT: z.coerce.number().default(8000),
  ENVIRONMENT: z
    .enum(["development", "production", "test"])
    .default("development"),
  HTTP_SECURE_OPTION: z.string(),
  ACCESS_CONTROL_ORIGIN: z.string(),

  REFRESH_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_LIFE: z.string(),
  REFRESH_TOKEN_LIFE: z.string(),

  GMAIL_APP_PASSWORD: z.string(),
  GMAIL_USER: z.string(),
  SMTP_API_KEY: z.string(),

  SERVER_BASE_URI: z.string().default("http://localhost:8000"),
  GOOGLE_OAUTH_CLIENT_ID: z.string().default("your_google_oauth_client_id"),
  GOOGLE_OAUTH_CLIENT_SECRET: z
    .string()
    .default("your_google_oauth_client_secret"),

  DATABASE_URL: z.url().default("mysql://root:@localhost:3306/techy-cms"),
  DB_TYPE: z.enum(["postgres", "mysql"]),
};

const envSchema = z.object(zodObject);
export const env = envSchema.parse(process.env);
