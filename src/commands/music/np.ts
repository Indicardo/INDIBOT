import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";

const replaceAt = (str: string, index: number, char: string) => {
  if (index > str.length - 1) return str;
  return str.substr(0, index) + char + str.substr(index + 1);
};

export default class NowPlayingCommand extends Command {
  constructor() {
    super("nowplaying", {
      aliases: ["nowplaying", "np"],
      category: "music",
    });
  }

  async exec(message: Message) {
    const serverQueue = this.client.videoHandler.queue.get(message.guild.id);

    if (!serverQueue)
      return message.channel.send(
        this.client.i18n.translate(
          "Well... It seems like nothing is playing",
          message.settings.locale,
          "music"
        )
      );

    const song = serverQueue.videos[0];

    const date: any = new Date();
    const currentDuration = (date - song.timestamp) / 1000;

    const progress: number = Math.round(
      ((currentDuration / song.durationSeconds) * 100) / 5
    );
    let bar: string = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    bar = replaceAt(bar, progress, "🔘");

    const state: string = progress >= 20 ? "⏸️" : "▶️";

    message.channel.send(
      new MessageEmbed()
        .setAuthor(
          `${song.by.username}#${song.by.discriminator}`,
          song.by.avatarURL()
        )
        .setTitle(song.title)
        .setURL(`https://youtube.com/watch?v=${song.id}`)
        .setDescription(
          `${state} **${bar}** \`[${
            Math.floor(currentDuration / 60) +
            ":" +
            ("0" + Math.floor(currentDuration % 60)).slice(-2)
          }/${song.duration}]\` 🔊`
        )
        .setImage(`https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`)
        .setFooter(
          `${this.client.i18n.translate(
            "Source",
            message.settings.locale,
            "music"
          )}: ${song.author.title}`
        )
        .setColor(0x41f4e8)
    );
  }
}
