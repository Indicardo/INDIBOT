import redis, { getAsync } from "../providers/redis";
import type { Guild, Snowflake } from "discord.js";

export class SettingsService {
  public async create(guild: Guild) {
    redis.set("guild:" + guild.id, JSON.stringify(defaults));
    return defaults;
  }

  public async get(guild: Guild) {
    const settings = JSON.parse(await getAsync("guild:" + guild.id));
    if (!settings) return this.create(guild);
    return settings;
  }

  public async set(guild: Guild, data: Partial<typeof defaults>) {
    const settings = await getAsync("guild:" + guild.id);

    if (!settings) await this.create(guild);
    return redis.set(
      "guild:" + guild.id,
      JSON.stringify({ ...defaults, ...data })
    );
  }

  public async clear(guild: Guild) {
    return redis.del("guild:" + guild.id);
  }
}

const defaults = {
  prefix: process.env.PREFIX,
  blacklist: [] as Snowflake[],
  locale: "en",
};
