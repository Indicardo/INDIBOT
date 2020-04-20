import INDIBOT from "./client";
import "dotenv/config";

const client: INDIBOT = new INDIBOT({
  owner: process.env.owner,
  token: process.env.token,
});

client.start();
