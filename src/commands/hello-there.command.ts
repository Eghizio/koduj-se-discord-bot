import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { BotCommand } from "./commands.js";

const hellothereGif =
  "https://media1.tenor.com/m/Tsob5aHiS3UAAAAd/hello-there.gif";

export default {
  data: new SlashCommandBuilder()
    .setName("hello-there")
    .setDescription("Hello there!"),

  execute: async (interaction) => {
    const embed = new EmbedBuilder()
      .setDescription(`General <@${interaction.user.id}>!`)
      .setImage(hellothereGif);

    await interaction.reply({ embeds: [embed] });
  },
} satisfies BotCommand;
