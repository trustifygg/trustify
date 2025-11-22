import { ButtonInteraction } from 'discord.js';
import { ButtonComponent } from '../../types';

const component: ButtonComponent = {
  customId: 'example_button',

  async execute(interaction: ButtonInteraction): Promise<void> {
    await interaction.reply({
      content: '✅ You clicked the primary button!',
      ephemeral: true,
    });
  },
};

export default component;
