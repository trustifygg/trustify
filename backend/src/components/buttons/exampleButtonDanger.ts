import { ButtonInteraction } from 'discord.js';
import { ButtonComponent } from '../../types';

const component: ButtonComponent = {
  customId: 'example_button_danger',

  async execute(interaction: ButtonInteraction): Promise<void> {
    await interaction.reply({
      content: '⚠️ Danger button clicked! Be careful!',
      ephemeral: true,
    });
  },
};

export default component;
