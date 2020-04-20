import { Inhibitor } from "discord-akairo";

export default class BlacklistInhibitor extends Inhibitor {
  constructor() {
    super("blacklist", {
      reason: "blacklist",
    });
  }

  async exec(message: Message) {
    const blacklist = message.settings ? message.settings.blacklist : [];
    return blacklist.includes(message.author.id);
  }
}
