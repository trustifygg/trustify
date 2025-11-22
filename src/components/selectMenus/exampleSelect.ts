import { StringSelectMenuInteraction } from 'discord.js';
import { SelectMenuComponent } from '../../types';

const component: SelectMenuComponent = {
  customId: 'example_select',

  async execute(interaction: StringSelectMenuInteraction): Promise<void> {
    const selected = interaction.values[0];

    await interaction.reply({
      content: `You selected: **${selected}**`,
      ephemeral: true,
    });
  },
};

export default component;
