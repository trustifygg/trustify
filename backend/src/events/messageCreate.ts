import { Events, Message } from 'discord.js';
import { config } from '../config';
import { logger } from '../utils/logger';
import { ExtendedClient, BotEvent } from '../types';

const event: BotEvent = {
  name: Events.MessageCreate,
  async execute(message: Message): Promise<void> {
    if (message.author.bot) return;

    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const client = message.client as ExtendedClient;
    const command = client.messageCommands.get(commandName);

    if (!command) return;

    try {
      await command.execute(message, args);
    } catch (error) {
      logger.error(`Error executing message command ${commandName}:`, error);

      try {
        await message.reply('There was an error while executing this command!');
      } catch (replyError) {
        logger.error('Could not send error message:', replyError);
      }
    }
  },
};

export default event;
