import { AkairoClient, CommandHandler, InhibitorHandler } from "discord-akairo";
import { join } from "path";

import { VideoHandler } from "../handlers/video";
import { SettingsService, LoggerService, LocaleService } from "../services";
import i18n from "../providers/i18n";

import type { Snowflake } from "discord.js";
import type { Logger } from "winston";

interface botOptions {
  owner?: Snowflake;
  token?: string;
}

declare module "discord-akairo" {
  interface AkairoClient {
    commandHandler: CommandHandler;
    inhibitorHandler: InhibitorHandler;
    videoHandler: VideoHandler;
    config: botOptions;
    settings: SettingsService;
    i18n: LocaleService;
    logger: Logger;
  }
}

export default class INDIBOT extends AkairoClient {
  constructor(config: botOptions) {
    super(
      { ownerID: config.owner },
      {
        fetchAllMembers: true,
        messageCacheMaxSize: 10e3,
        messageCacheLifetime: 3600,
        shardCount: 2,
      }
    );

    this.config = config;
    this.settings = new SettingsService();
    this.i18n = new LocaleService(i18n);
    this.logger = new LoggerService().logger;

    this.commandHandler = new CommandHandler(this, {
      directory: join(__dirname, "..", "commands"),
      prefix: async (message: Message) => {
        message.settings = await this.settings.get(message.guild);

        if (!message.settings || !message.settings.prefix)
          return process.env.PREFIX;
        else return message.settings.prefix;
      },
      allowMention: true,
      commandUtil: false,
      defaultCooldown: 3000,
    });

    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: join(__dirname, "..", "inhibitors"),
    });

    this.videoHandler = new VideoHandler(this);
  }

  private async _init() {
    this.logger.info("=======================");
    this.logger.info("Initializing INDIBOT...");
    this.logger.info("=======================\n");

    this.commandHandler.loadAll();
    this.logger.info(`Commands loaded: ${this.commandHandler.modules.size}`);

    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    this.inhibitorHandler.loadAll();
    this.logger.info(
      `Inhibitors loaded: ${this.inhibitorHandler.modules.size}`
    );

    this.on("shardReady", (id: number) =>
      this.logger.info(`Shard ${id} ready`)
    );
    this.on("shardDisconnect", (_, id: number) =>
      this.logger.error(`Shard ${id} disconnected`)
    );
    this.on("shardError", (error: Error, id: number) =>
      this.logger.error(`Shard ${id} error: ${error.stack}`)
    );
  }

  public async start() {
    await this._init();
    return this.login(this.config.token);
  }
}
