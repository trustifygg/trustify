import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';
import { BotConfig } from './types';

dotenvConfig();

const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1, 'DISCORD_TOKEN is required'),
  CLIENT_ID: z.string().min(1, 'CLIENT_ID is required'),
  GUILD_ID: z.string().optional(),
  PREFIX: z.string().default('!'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/discord-bot'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
});

function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment variable validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    process.exit(1);
  }
}

const env = validateEnv();

export const config: BotConfig = {
  token: env.DISCORD_TOKEN,
  clientId: env.CLIENT_ID,
  guildId: env.GUILD_ID,
  prefix: env.PREFIX,
  mongodbUri: env.MONGODB_URI,
  environment: env.NODE_ENV,
};
