import { Events, REST, Routes } from 'discord.js';
import { config } from '../config';
import { getSlashCommandsData } from '../handlers/commandHandler';
import type { BotEvent, ExtendedClient } from '../types';
import { logger } from '../utils/logger';
import { createEmbed } from '../utils/embedBuilder';
import { CHANNELS } from '../utils/constants';

const event: BotEvent = {
  name: Events.ClientReady,
  once: true,
  async execute(client: ExtendedClient): Promise<void> {
    if (!client.user) {
      logger.error('Client user is not available');
      return;
    }

    logger.success(`Bot is ready! Logged in as ${client.user.tag}`);
    logger.info(`Serving ${client.guilds.cache.size} guild(s)`);

    await registerSlashCommands(client);
    startHeartbeat(client);
  },
};

async function registerSlashCommands(client: ExtendedClient): Promise<void> {
  try {
    const commands = getSlashCommandsData(client);

    if (commands.length === 0) {
      logger.warning('No slash commands to register');
      return;
    }

    const rest = new REST().setToken(config.token);

    logger.info(`Started refreshing ${commands.length} application (/) commands.`);

    if (config.guildId && config.environment === 'development') {
      const data = await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands }
      ) as any[];

      logger.success(`Successfully registered ${data.length} guild application (/) commands.`);
    } else {
      const data = await rest.put(
        Routes.applicationCommands(config.clientId),
        { body: commands }
      ) as any[];

      logger.success(`Successfully registered ${data.length} global application (/) commands.`);
    }
  } catch (error) {
    logger.error('Error registering slash commands:', error);
  }
}

function startHeartbeat(client: ExtendedClient): void {
  const sendHeartbeat = async () => {
    try {
      const channel = await client.channels.fetch(CHANNELS.HEARTBEAT);
      if (channel?.isTextBased() && 'send' in channel) {
        const embed = createEmbed('Heartbeat');
        await channel.send({ embeds: [embed] });
        logger.info('Heartbeat sent');
      }
    } catch (error) {
      logger.error('Failed to send heartbeat:', error);
    }
  };

  setInterval(sendHeartbeat, 30 * 60 * 1000);
  logger.success('Heartbeat started (30 minute interval)');
}

export default event;
