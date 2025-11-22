import { Client, Collection, ChatInputCommandInteraction, Message, ButtonInteraction, StringSelectMenuInteraction, ModalSubmitInteraction } from 'discord.js';

export interface ExtendedClient extends Client {
  config: BotConfig;
  slashCommands: Collection<string, SlashCommand>;
  messageCommands: Collection<string, MessageCommand>;
  components: {
    buttons: Collection<string, ButtonComponent>;
    selectMenus: Collection<string, SelectMenuComponent>;
    modals: Collection<string, ModalComponent>;
  };
}

export interface BotConfig {
  token: string;
  clientId: string;
  guildId?: string;
  prefix: string;
  mongodbUri: string;
  environment: 'development' | 'production';
}

export interface SlashCommand {
  data: {
    name: string;
    toJSON: () => any;
  };
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface MessageCommand {
  name: string;
  description: string;
  aliases?: string[];
  usage?: string;
  cooldown?: number;
  execute: (message: Message, args: string[]) => Promise<void>;
}

export interface ButtonComponent {
  customId: string;
  execute: (interaction: ButtonInteraction) => Promise<void>;
}

export interface SelectMenuComponent {
  customId: string;
  execute: (interaction: StringSelectMenuInteraction) => Promise<void>;
}

export interface ModalComponent {
  customId: string;
  execute: (interaction: ModalSubmitInteraction) => Promise<void>;
}

export interface BotEvent {
  name: string;
  once?: boolean;
  execute: (...args: any[]) => Promise<void> | void;
}
