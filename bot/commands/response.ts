import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import DataModule from "../modules/data";

const Command = {
  enabled: true,
  builder: new SlashCommandBuilder()
    .setName("autoresponse")
    .setDescription("Manage the autoresponder")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("add")
        .setDescription("Add or edit an autoresponse message")
        .addStringOption(
          new SlashCommandStringOption()
            .setName("trigger")
            .setDescription("The trigger message to respond to")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption(
          new SlashCommandStringOption()
            .setName("response")
            .setDescription("The response message")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("remove")
        .setDescription("Remove an existing autoresponse message")
        .addStringOption(
          new SlashCommandStringOption()
            .setName("trigger")
            .setDescription("The trigger message to remove")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),
  handler: async (interaction: ChatInputCommandInteraction) => {
    const trigger = interaction.options
      .getString("trigger", true)
      .replace(/Create a new autoresponse for "|"$/g, "");
    const response = interaction.options.getString("response");
    const subCommand = interaction.options.getSubcommand(true);

    if (subCommand == "add") {
      const res = await DataModule.getDataModule().addMessage(trigger, response || "");
      interaction.reply({
        content: res ? "Added autoresponse" : "Failed to add autoresponse, message already exists",
        ephemeral: true,
      });
    } else if (subCommand == "remove") {
      const res = await DataModule.getDataModule().removeMessage(trigger);
      interaction.reply({
        content: res ? "Removed autoresponse" : "Failed to remove autoresponse, message does not exist",
        ephemeral: true,
      });
    }
  },
}; 

export default Command;
