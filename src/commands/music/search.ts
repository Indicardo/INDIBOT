import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import youtube from "../../providers/youtube";

export default class SearchCommand extends Command {
  constructor() {
    super("search", {
      aliases: ["search"],
      category: "music",
      args: [
        {
          id: "search",
          type: "string",
          match: "text",
        },
      ],
    });
  }

  async exec(message: Message, { search }: { search: string }) {
    let video: any;

    try {
      let videos = await youtube.searchVideos(search, 5);
      let index = 0;

      const results = await message.channel.send(
        new MessageEmbed()
          .setTitle(
            `🎵  ${this.client.i18n.translate(
              "Searching...",
              message.settings.locale,
              "music"
            )}`
          )
          .setDescription(
            `${videos
              .map(
                (video2: { title: any }) => `\`${++index}.\` ${video2.title}`
              )
              .join("\n")}`
          )
          .setColor(0x41f4e8)
      );

      await results.react("1⃣");
      await results.react("2⃣");
      await results.react("3⃣");
      await results.react("4⃣");
      await results.react("5⃣");

      const filter = (
        reaction: { emoji: { name: string } },
        user: { id: string }
      ) => {
        return (
          ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣"].includes(reaction.emoji.name) &&
          user.id === message.author.id
        );
      };

      const collected = await results.awaitReactions(filter, {
        max: 1,
        time: 10000,
        errors: ["time"],
      });
      const reaction = collected.first();
      results.delete();

      if (Number(reaction.emoji.name.charAt(0)) <= 5) {
        let videoIndex: number = Number(reaction.emoji.name.charAt(0));
        video = await youtube.getVideoByID(videos[videoIndex - 1].id);
      } else
        return message.channel.send(
          `🆘 ${this.client.i18n.translate(
            "...Next time do something that makes sense, aight?",
            message.settings.locale,
            "music"
          )}`
        );
    } catch {
      return message.channel.send(
        `🆘 ${this.client.i18n.translate(
          "Uh oh chief! Nothing has been found. Better luck next time!",
          message.settings.locale,
          "music"
        )}`
      );
    }
    return this.client.videoHandler.send(video, message);
  }
}
