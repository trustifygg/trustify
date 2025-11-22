import { ModalSubmitInteraction } from 'discord.js';
import { ModalComponent } from '../../types';
import { logger } from '../../utils/logger';

const component: ModalComponent = {
  customId: 'feedback_modal',

  async execute(interaction: ModalSubmitInteraction): Promise<void> {
    const name = interaction.fields.getTextInputValue('feedback_name') || 'Anonymous';
    const feedback = interaction.fields.getTextInputValue('feedback_text');

    logger.info(`Feedback received from ${name}: ${feedback}`);

    await interaction.reply({
      content: `✅ Thank you for your feedback, ${name}!\n\nYour feedback:\n>>> ${feedback}`,
      ephemeral: true,
    });
  },
};

export default component;
