import { dump, load } from "js-yaml";
import { CONFIG } from "./globals";
import fs from "fs";

export interface Twitter {
    consumerKey: string;
    consumerSecret: string;
    postToTwitter: boolean;
    userAccessToken: string;
    userSecret: string;
}

/**
 * This represents the config.yml
 * @class Config
 * @property {string} botUsername
 * @property {string} changeHostChannelID
 * @property {string} chatChannelID
 * @property {string} clientId
 * @property {string} discordBotToken
 * @property {string} offlineChannelID
 * @property {string} prefix
 * @property {string[]} twitchUsernames
 * @property {Twitter} twitter
 */
export default class Config {
    private static readonly _configLocation = "./config.yml";

    public readonly botUsername: string;

    public readonly changeHostChannelID: string | undefined;

    public readonly chatChannelID: string | undefined;

    public readonly clientId: string;

    public readonly clientSecret: string;

    public readonly discordBotToken: string | undefined;

    public readonly offlineChannelID: string | undefined;

    public readonly prefix: string;

    public readonly twitchUsernames: string[];

    public readonly twitter: Twitter;

    public usingExpress: boolean;


    private constructor() {
        this.botUsername = "";
        this.changeHostChannelID = "";
        this.chatChannelID = "";
        this.clientId = "";
        this.clientSecret = "";
        this.discordBotToken = "";
        this.offlineChannelID = "";
        this.prefix = "";
        this.twitchUsernames = [""];
        this.twitter = {
            consumerKey: "",
            consumerSecret: "",
            postToTwitter: false,
            userAccessToken: "",
            userSecret: ""
        };
        this.usingExpress = false;
    }

    /**
       *  Call getConfig instead of constructor
       */
    public static getConfig(): Config {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!fs.existsSync(Config._configLocation)) {
            throw new Error("Please create a config.yml");
        }
        const fileContents = fs.readFileSync(
            Config._configLocation,
            "utf-8"
        );
        const casted = load(fileContents) as Config;

        return casted;
    }

    /**
   *  Safe the config to the congfig.yml default location
   */
    public static saveConfig(): void {
        fs.writeFileSync(Config._configLocation, dump(CONFIG));
    }
}