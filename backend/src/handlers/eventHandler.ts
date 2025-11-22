import fs from 'fs';
import path from 'path';
import { ExtendedClient, BotEvent } from '../types';
import { logger } from '../utils/logger';

export function loadEvents(client: ExtendedClient): void {
  const eventsPath = path.join(__dirname, '../events');

  if (!fs.existsSync(eventsPath)) {
    logger.warning('Events directory not found');
    return;
  }

  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    
    try {
      const event: BotEvent = require(filePath).default || require(filePath);

      if (!event.name || !event.execute) {
        logger.warning(`Event at ${filePath} is missing required "name" or "execute" property`);
        continue;
      }

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }

      logger.success(`Loaded event: ${event.name}`);
    } catch (error) {
      logger.error(`Failed to load event from ${filePath}:`, error);
    }
  }
}
