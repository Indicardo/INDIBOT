import { Command } from "discord-akairo";

export default class PauseCommand extends Command {
  constructor() {
    super("pause", {
      aliases: ["pause"],
      category: "music",
    });
  }

  async exec(message: Message) {
    const serverQueue = this.client.videoHandler.queue.get(message.guild.id);

    if (message.guild.voice.connection) {
      serverQueue.playing = false;
      message.guild.voice.connection.dispatcher.pause();
      return message.react("⏸");
    } else {
      return message.channel.send(
        this.client.i18n.translate(
          "Well... It seems like nothing is playing",
          message.settings.locale,
          "music"
        )
      );
    }
  }
}
