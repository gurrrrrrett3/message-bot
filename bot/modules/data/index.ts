import Bot from "../../bot";
import BaseModule from "../../loaders/base/baseModule";
import { Module } from "../../loaders/loaderTypes";
import fs from "fs"
import { bot } from "../../..";

interface dataFile {
    username: string;
    icon: string;
    messages: [string, string][];
}

export default class DataModule extends BaseModule implements Module {
    
    name = "data";
    description = "";

    // declare other public variables here

    data: dataFile

    constructor(bot: Bot) {
        super(bot);

        if (!fs.existsSync("./data.json")) {
            fs.writeFileSync("./data.json", JSON.stringify({

                username: "kofi-bot",
                icon: "https://uploads-ssl.webflow.com/5c14e387dab576fe667689cf/5c91bddac6c3aa6b3718fd86_kofisvglofo.svg",
                messages: []

            }));
        }

        this.data = JSON.parse(fs.readFileSync("./data.json").toString());
    }

    async init(bot: Bot) {

        // init code here, this is called when the module is loaded

    }

    public static getDataModule(): DataModule {
        return bot.moduleLoader.getModule("data") as DataModule;
    }

    public async addMessage(message: string, response: string): Promise<boolean> {
        if (this.data.messages.find((m) => m[0] == message)) return false;
        this.data.messages.push([message, response]);
        fs.writeFileSync("./data.json", JSON.stringify(this.data));
        return true;
    }

    public async removeMessage(message: string): Promise<boolean> {
        this.data.messages = this.data.messages.filter((m) => m[0] != message);
        fs.writeFileSync("./data.json", JSON.stringify(this.data));
        return true;
    }

}