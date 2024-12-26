import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { BotCommand } from "./commands.js";

interface ApiResponse {
  answer: "yes" | "no" | "maybe";
  forced: boolean;
  image: string;
}

export default {
  data: new SlashCommandBuilder()
    .setName("yesno")
    .setDescription("Makes a decision for you!")
    .addStringOption((option) =>
      option
        .setName("answer")
        .setDescription("Forcing the answer.")
        .setRequired(false)
    ),

  execute: async (interaction) => {
    const forcedAnswer = interaction.options.getString("answer");

    const url = forcedAnswer
      ? `https://yesno.wtf/api?force=${encodeURIComponent(forcedAnswer)}`
      : `https://yesno.wtf/api`;

    const response = await fetch(url);
    const { answer, image } = (await response.json()) as ApiResponse;

    const embed = new EmbedBuilder().setTitle(answer).setImage(image);

    if (answer === "yes") embed.setColor("#5ab783");
    if (answer === "no") embed.setColor("#e91e63");

    await interaction.reply({ embeds: [embed] });
  },
} satisfies BotCommand;
