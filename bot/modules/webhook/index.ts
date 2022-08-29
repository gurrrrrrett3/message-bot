import { ChannelType, Message, WebhookClient } from "discord.js";
import { bot } from "../../..";
import Bot from "../../bot";
import BaseModule from "../../loaders/base/baseModule";
import { Module } from "../../loaders/loaderTypes";
import DataModule from "../data";

export default class WebhookModule extends BaseModule implements Module {
  name = "webhook";
  description = "";

  // declare other public variables here

  constructor(bot: Bot) {
    super(bot);
  }

  async init(bot: Bot) {
    // init code here, this is called when the module is loaded

    bot.client.on("messageCreate", (message) => {

        console.log(message.content);

        const data = DataModule.getDataModule().data;

        const response = data.messages.find((m) => message.content.toLowerCase().includes(m[0].toLowerCase()));
        if (!response) return;

        this.reply(message, response[1]);

    })
  }

  public static getWebhookModule(): WebhookModule {
    return bot.moduleLoader.getModule("webhook") as WebhookModule;
  }

  public async reply(messageObject: Message, message: string) {
    if (messageObject.channel.type != ChannelType.GuildText) return;

    const data = DataModule.getDataModule().data;
    const webhooks = await messageObject.channel.fetchWebhooks();
    let webhook = webhooks.find((w) => w.name == "hi_amari");

    if (!webhook) {
      webhook = await messageObject.channel.createWebhook({
        name: "hi_amari",
        avatar: data.icon,
      });
    }

    webhook.send({
      body: {
        content: message,
      },
      username: data.username,
      avatarURL: data.icon,
    });
  }
}
