import { Message, EmbedBuilder } from 'discord.js';
import { MessageCommand, ExtendedClient } from '../../types';

const command: MessageCommand = {
  name: 'help',
  description: 'Lists all available commands',
  aliases: ['h', 'commands'],

  async execute(message: Message, args: string[]): Promise<void> {
    const client = message.client as ExtendedClient;
    const commands = client.messageCommands;
    
    const uniqueCommands = new Map<string, MessageCommand>();
    commands.forEach((cmd) => {
      if (!uniqueCommands.has(cmd.name)) {
        uniqueCommands.set(cmd.name, cmd);
      }
    });

    const commandList = Array.from(uniqueCommands.values()).map((cmd) => {
      const aliasText = cmd.aliases
        ? ` (aliases: ${cmd.aliases.map((a) => `\`${a}\``).join(', ')})`
        : '';
      return `\`${cmd.name}\`${aliasText} - ${cmd.description || 'No description'}`;
    });

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('📚 Available Commands')
      .setDescription(`Use the prefix \`${client.config.prefix}\` before commands.`)
      .addFields({
        name: 'Commands',
        value: commandList.join('\n') || 'No commands available',
      })
      .setTimestamp()
      .setFooter({ text: 'Message Commands' });

    await message.reply({ embeds: [embed] });
  },
};

export default command;
