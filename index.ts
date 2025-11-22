import { Client, GatewayIntentBits } from 'discord.js';
import { config } from './src/config';
import { connectDatabase } from './src/database';
import { loadEvents } from './src/handlers/eventHandler';
import { loadSlashCommands } from './src/handlers/slashCommandHandler';
import { loadMessageCommands } from './src/handlers/messageCommandHandler';
import { loadComponents } from './src/handlers/componentHandler';
import { logger } from './src/utils/logger';
import { ExtendedClient } from './src/types';

async function startBot(): Promise<void> {
  logger.info('🚀 Starting Discord Bot...');

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  }) as ExtendedClient;

  client.config = config;

  try {
    await connectDatabase();
  } catch (error) {
    logger.warning('Failed to connect to database. Bot will continue without database.');
  }

  logger.info('\n📦 Loading handlers...');
  loadEvents(client);
  loadSlashCommands(client);
  loadMessageCommands(client);
  loadComponents(client);
  logger.success('All handlers loaded successfully!\n');

  try {
    await client.login(config.token);
  } catch (error) {
    logger.error('Failed to login to Discord:', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (error: Error) => {
  logger.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

startBot().catch((error) => {
  logger.error('Failed to start bot:', error);
  process.exit(1);
});
