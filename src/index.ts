import { Client, GatewayIntentBits } from "discord.js";
import { config } from "./config";
import { loadCommands } from "./handlers/commandHandler";
import { loadComponents } from "./handlers/componentHandler";
import { loadEvents } from "./handlers/eventHandler";
import type { ExtendedClient } from "./types";
import { logger } from "./utils/logger";

async function startBot(): Promise<void> {
  logger.info("🚀 Starting Discord Bot...");

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  }) as ExtendedClient;

  client.config = config;

  logger.info("\n📦 Loading handlers...");
  loadEvents(client);
  loadCommands(client);
  loadComponents(client);
  logger.success("All handlers loaded successfully!\n");

  try {
    await client.login(config.token);
  } catch (error) {
    logger.error("Failed to login to Discord:", error);
    process.exit(1);
  }
}

process.on("unhandledRejection", (error: Error) => {
  logger.error("Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught exception:", error);
  process.exit(1);
});

startBot().catch((error) => {
  logger.error("Failed to start bot:", error);
  process.exit(1);
});
