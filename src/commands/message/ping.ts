import { Message } from 'discord.js';
import { MessageCommand } from '../../types';

const command: MessageCommand = {
  name: 'ping',
  description: 'Replies with Pong and bot latency!',
  aliases: ['p'],

  async execute(message: Message, args: string[]): Promise<void> {
    const sent = await message.reply('Pinging...');

    const latency = sent.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(message.client.ws.ping);

    await sent.edit(
      `🏓 Pong!\n` +
      `📡 Latency: ${latency}ms\n` +
      `💓 API Latency: ${apiLatency}ms`
    );
  },
};

export default command;
