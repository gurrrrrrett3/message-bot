import { Client } from "discord.js";
import ModuleLoader from "./loaders/moduleLoader";
import CommandLoader from "./loaders/commandLoader";
import ButtonManager from "./loaders/managers/buttonManager";
import SelectMenuManager from "./loaders/managers/selectMenuManager";
import ModalManager from "./loaders/managers/modalManager";
import DataModule from "./modules/data";

export default class Bot {
  public moduleLoader: ModuleLoader;
  public commandLoader: CommandLoader;

  public buttonManager: ButtonManager;
  public selectMenuManager: SelectMenuManager;
  public modalManager: ModalManager;

  constructor(public client: Client) {
    this.client.on("ready", () => {
      console.info(`Logged in as ${this.client.user?.tag}`);
    });
    this.moduleLoader = new ModuleLoader(this);
    this.commandLoader = new CommandLoader(this.client);

    this.buttonManager = new ButtonManager(this.client);
    this.selectMenuManager = new SelectMenuManager(this.client);
    this.modalManager = new ModalManager(this.client);

    // autocomplete handler

    this.client.on("interactionCreate", (interaction) => {
      if (!interaction.isAutocomplete()) return;

        const focusedValue = interaction.options.getFocused(true);
        const subCommand = interaction.options.getSubcommand(true);
        switch (focusedValue.name) {
          case "trigger":
            let choices = DataModule.getDataModule()
              .data.messages.map((m) => m[0])
              .filter((m) => m.toLowerCase().includes(focusedValue.value.toLowerCase()));
            if (choices.length == 0) choices = [subCommand == "add" ? `Create a new autoresponse for "${focusedValue.value}"` : "No autoresponses found"];
            interaction.respond(choices.map((choice) => ({ name: choice, value: choice })));
            break;
        }
    });
  }
}
