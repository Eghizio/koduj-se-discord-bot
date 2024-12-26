import { SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "./commands";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  execute: async (interaction) => {
    await interaction.reply("Pong!");
  },
} satisfies BotCommand;
