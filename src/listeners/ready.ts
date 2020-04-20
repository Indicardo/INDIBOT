import { Listener } from "discord-akairo";

export default class ReadyListener extends Listener {
  public constructor() {
    super("ready", {
      emitter: "client",
      category: "client",
      event: "ready",
    });
  }

  public async exec(): Promise<void> {
    this.client.logger.info(`Logged in as ${this.client.user.tag}`);
    this.client.user.setPresence({
      activity: {
        name: `${process.env.PREFIX}help | ${this.client.guilds.cache.size} servers | ${this.client.users.cache.size} users`,
        type: "PLAYING",
      },
      status: "online",
    });

    if (this.client.voice.connections.size > 0)
      this.client.voice.connections.map((c) => {
        c.channel.leave();
      });
  }
}
