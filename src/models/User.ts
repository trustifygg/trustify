import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  stats: {
    commandsUsed: number;
    messagesCount: number;
  };
  settings: {
    language: string;
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
    },
    discriminator: {
      type: String,
      default: '0',
    },
    avatar: {
      type: String,
      default: null,
    },
    stats: {
      commandsUsed: {
        type: Number,
        default: 0,
      },
      messagesCount: {
        type: Number,
        default: 0,
      },
    },
    settings: {
      language: {
        type: String,
        default: 'en',
      },
      notifications: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics = {
  async findOrCreate(userId: string, username: string): Promise<IUser> {
    let user = await this.findOne({ userId });

    if (!user) {
      user = await this.create({
        userId,
        username,
      });
    }

    return user;
  },
};

userSchema.methods = {
  async incrementCommandUsage(): Promise<IUser> {
    this.stats.commandsUsed += 1;
    return await this.save();
  },

  async incrementMessageCount(): Promise<IUser> {
    this.stats.messagesCount += 1;
    return await this.save();
  },
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
