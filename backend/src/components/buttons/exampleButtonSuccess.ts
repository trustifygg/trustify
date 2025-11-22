import { ButtonInteraction } from 'discord.js';
import { ButtonComponent } from '../../types';

const component: ButtonComponent = {
  customId: 'example_button_success',

  async execute(interaction: ButtonInteraction): Promise<void> {
    await interaction.reply({
      content: '✅ Success button clicked!',
      ephemeral: true,
    });
  },
};

export default component;
