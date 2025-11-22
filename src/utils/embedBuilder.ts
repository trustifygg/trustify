import {
  type EmbedAuthorOptions,
  EmbedBuilder,
  type EmbedField,
  type EmbedFooterOptions,
} from "discord.js";
import { COLORS } from "./constants";

interface EmbedOptions {
  color?: number;
  title?: string;
  url?: string;
  author?: EmbedAuthorOptions;
  description?: string;
  thumbnail?: string;
  fields?: EmbedField[];
  image?: string;
  footer?: EmbedFooterOptions;
}

export function createEmbed(options?: EmbedOptions | string): EmbedBuilder {
  const embed = new EmbedBuilder().setColor(COLORS.PRIMARY);

  if (typeof options === "string") {
    return embed.setDescription(options);
  }

  if (!options) return embed;

  if (options.color !== undefined) embed.setColor(options.color);
  if (options.title) embed.setTitle(options.title);
  if (options.url) embed.setURL(options.url);
  if (options.author) embed.setAuthor(options.author);
  if (options.description) embed.setDescription(options.description);
  if (options.thumbnail) embed.setThumbnail(options.thumbnail);
  if (options.fields) embed.addFields(...options.fields);
  if (options.image) embed.setImage(options.image);
  if (options.footer) embed.setFooter(options.footer);

  return embed;
}
