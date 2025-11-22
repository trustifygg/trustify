import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGuild extends Document {
  guildId: string;
  guildName: string;
  prefix: string;
  settings: {
    welcomeChannel: string | null;
    welcomeMessage: string;
    logsChannel: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

const guildSchema = new Schema<IGuild>(
  {
    guildId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    guildName: {
      type: String,
      required: true,
    },
    prefix: {
      type: String,
      default: '!',
    },
    settings: {
      welcomeChannel: {
        type: String,
        default: null,
      },
      welcomeMessage: {
        type: String,
        default: 'Welcome to the server, {user}!',
      },
      logsChannel: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

guildSchema.statics = {
  async findOrCreate(guildId: string, guildName: string): Promise<IGuild> {
    let guild = await this.findOne({ guildId });

    if (!guild) {
      guild = await this.create({
        guildId,
        guildName,
      });
    }

    return guild;
  },
};

guildSchema.methods = {
  async updatePrefix(newPrefix: string): Promise<IGuild> {
    this.prefix = newPrefix;
    return await this.save();
  },

  async updateWelcomeChannel(channelId: string | null): Promise<IGuild> {
    this.settings.welcomeChannel = channelId;
    return await this.save();
  },
};

const Guild: Model<IGuild> = mongoose.model<IGuild>('Guild', guildSchema);

export default Guild;
