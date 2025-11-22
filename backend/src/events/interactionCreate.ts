import { Events, Interaction } from 'discord.js';
import { logger } from '../utils/logger';
import { ExtendedClient, BotEvent } from '../types';

const event: BotEvent = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction): Promise<void> {
    const client = interaction.client as ExtendedClient;

    try {
      if (interaction.isChatInputCommand()) {
        await handleSlashCommand(interaction, client);
      }
      else if (interaction.isButton()) {
        await handleButton(interaction, client);
      }
      else if (interaction.isStringSelectMenu()) {
        await handleSelectMenu(interaction, client);
      }
      else if (interaction.isModalSubmit()) {
        await handleModal(interaction, client);
      }
    } catch (error) {
      logger.error('Error handling interaction:', error);
    }
  },
};

async function handleSlashCommand(
  interaction: Interaction,
  client: ExtendedClient
): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);

  if (!command) {
    logger.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(`Error executing ${interaction.commandName}:`, error);

    const errorMessage = {
      content: 'There was an error while executing this command!',
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
}

async function handleButton(
  interaction: Interaction,
  client: ExtendedClient
): Promise<void> {
  if (!interaction.isButton()) return;

  const button = client.components.buttons.get(interaction.customId);

  if (!button) {
    logger.error(`No button handler matching ${interaction.customId} was found.`);
    return;
  }

  try {
    await button.execute(interaction);
  } catch (error) {
    logger.error(`Error executing button ${interaction.customId}:`, error);

    const errorMessage = {
      content: 'There was an error while handling this button!',
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
}

async function handleSelectMenu(
  interaction: Interaction,
  client: ExtendedClient
): Promise<void> {
  if (!interaction.isStringSelectMenu()) return;

  const selectMenu = client.components.selectMenus.get(interaction.customId);

  if (!selectMenu) {
    logger.error(`No select menu handler matching ${interaction.customId} was found.`);
    return;
  }

  try {
    await selectMenu.execute(interaction);
  } catch (error) {
    logger.error(`Error executing select menu ${interaction.customId}:`, error);

    const errorMessage = {
      content: 'There was an error while handling this select menu!',
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
}

async function handleModal(
  interaction: Interaction,
  client: ExtendedClient
): Promise<void> {
  if (!interaction.isModalSubmit()) return;

  const modal = client.components.modals.get(interaction.customId);

  if (!modal) {
    logger.error(`No modal handler matching ${interaction.customId} was found.`);
    return;
  }

  try {
    await modal.execute(interaction);
  } catch (error) {
    logger.error(`Error executing modal ${interaction.customId}:`, error);

    const errorMessage = {
      content: 'There was an error while handling this modal!',
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
}

export default event;
