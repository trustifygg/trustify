import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from 'discord.js';
import { SlashCommand } from '../../types';

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('feedback')
    .setDescription('Submit feedback about the bot'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const modal = new ModalBuilder()
      .setCustomId('feedback_modal')
      .setTitle('Bot Feedback');

    const nameInput = new TextInputBuilder()
      .setCustomId('feedback_name')
      .setLabel('Your Name')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Enter your name')
      .setRequired(false);

    const feedbackInput = new TextInputBuilder()
      .setCustomId('feedback_text')
      .setLabel('Your Feedback')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Tell us what you think!')
      .setRequired(true);

    const firstRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
    const secondRow = new ActionRowBuilder<TextInputBuilder>().addComponents(feedbackInput);

    modal.addComponents(firstRow, secondRow);

    await interaction.showModal(modal);
  },
};

export default command;
