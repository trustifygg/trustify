import fs from 'fs';
import path from 'path';
import { Collection } from 'discord.js';
import { ExtendedClient, MessageCommand } from '../types';
import { logger } from '../utils/logger';

export function loadMessageCommands(client: ExtendedClient): void {
  client.messageCommands = new Collection<string, MessageCommand>();
  const commandsPath = path.join(__dirname, '../commands/message');

  if (!fs.existsSync(commandsPath)) {
    logger.warning('Message commands directory not found');
    return;
  }

  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);

    try {
      const command: MessageCommand = require(filePath).default || require(filePath);

      if (!('name' in command) || !('execute' in command)) {
        logger.warning(`Command at ${filePath} is missing required "name" or "execute" property`);
        continue;
      }

      client.messageCommands.set(command.name, command);

      if (command.aliases && Array.isArray(command.aliases)) {
        command.aliases.forEach((alias) => {
          client.messageCommands.set(alias, command);
        });
      }

      logger.success(`Loaded message command: ${command.name}`);
    } catch (error) {
      logger.error(`Failed to load message command from ${filePath}:`, error);
    }
  }
}
