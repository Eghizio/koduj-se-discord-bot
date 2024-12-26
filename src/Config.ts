export class Config {
  readonly BOT_TOKEN: string;
  readonly APP_ID: string;
  readonly GUILD_ID: string;
  readonly AOC_SESSION_COOKIE: string;

  constructor() {
    this.BOT_TOKEN = this.getEnv("BOT_TOKEN");
    this.APP_ID = this.getEnv("APP_ID");
    this.GUILD_ID = this.getEnv("GUILD_ID");
    this.AOC_SESSION_COOKIE = this.getEnv("AOC_SESSION_COOKIE");
  }

  private getEnv<T>(key: string, defaultValue?: T): string | T {
    const value = process.env[key];

    if (value) return value;

    if (defaultValue) return defaultValue;

    throw new Error(`No environment variable "${key}" found.`);
  }
}
