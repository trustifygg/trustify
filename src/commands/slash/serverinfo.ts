import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../types';

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Get information about the server'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const { guild } = interaction;

    if (!guild) {
      await interaction.reply({
        content: 'This command can only be used in a server!',
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`${guild.name} Server Information`)
      .setThumbnail(guild.iconURL({ forceStatic: false }))
      .addFields(
        {
          name: '👑 Owner',
          value: `<@${guild.ownerId}>`,
          inline: true,
        },
        {
          name: '👥 Members',
          value: `${guild.memberCount}`,
          inline: true,
        },
        {
          name: '📅 Created',
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: '🆔 Server ID',
          value: guild.id,
          inline: true,
        },
        {
          name: '💬 Channels',
          value: `${guild.channels.cache.size}`,
          inline: true,
        },
        {
          name: '😀 Emojis',
          value: `${guild.emojis.cache.size}`,
          inline: true,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
