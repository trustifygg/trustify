import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from 'discord.js';
import { SlashCommand } from '../../types';

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('menu')
    .setDescription('Shows an example of select menu components'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('example_select')
        .setPlaceholder('Choose an option')
        .addOptions([
          {
            label: 'Option 1',
            description: 'This is the first option',
            value: 'option_1',
          },
          {
            label: 'Option 2',
            description: 'This is the second option',
            value: 'option_2',
          },
          {
            label: 'Option 3',
            description: 'This is the third option',
            value: 'option_3',
          },
        ])
    );

    await interaction.reply({
      content: 'Choose an option from the menu below:',
      components: [row],
    });
  },
};

export default command;
