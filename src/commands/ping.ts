import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import type { SlashCommand } from "../types";
import { createEmbed } from "../utils/embedBuilder";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong and bot latency"),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    const embed = createEmbed({
      title: "🏓 Pong!",
      fields: [
        { name: "📡 Latency", value: `${latency}ms`, inline: true },
        { name: "💓 API Latency", value: `${apiLatency}ms`, inline: true },
      ],
    });

    await interaction.editReply({ content: "", embeds: [embed] });
  },
};

export default command;
