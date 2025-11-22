import fs from "node:fs";
import path from "node:path";
import { Collection } from "discord.js";
import type { ExtendedClient, SlashCommand } from "../types";
import { logger } from "../utils/logger";

export function loadCommands(client: ExtendedClient): void {
  client.slashCommands = new Collection<string, SlashCommand>();
  const commandsPath = path.join(__dirname, "../commands");

  if (!fs.existsSync(commandsPath)) {
    logger.warning("Slash commands directory not found");
    return;
  }

  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);

    try {
      const command: SlashCommand =
        require(filePath).default || require(filePath);

      if (!("data" in command) || !("execute" in command)) {
        logger.warning(
          `Command at ${filePath} is missing required "data" or "execute" property`,
        );
        continue;
      }

      client.slashCommands.set(command.data.name, command);
      logger.success(`Loaded slash command: ${command.data.name}`);
    } catch (error) {
      logger.error(`Failed to load slash command from ${filePath}:`, error);
    }
  }
}

export function getSlashCommandsData(client: ExtendedClient): any[] {
  const commands: any[] = [];

  if (client.slashCommands) {
    client.slashCommands.forEach((command) => {
      commands.push(command.data.toJSON());
    });
  }

  return commands;
}
