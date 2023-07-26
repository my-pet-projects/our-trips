import pino from "pino";
import PinoPretty from "pino-pretty";

import { env } from "./env.mjs";

const prettyStream = PinoPretty({
  colorize: true,
});

const stream = env.NODE_ENV === "production" ? process.stdout : prettyStream;

const logger = pino(
  {
    level: "debug",
    base: {
      env: env.NODE_ENV,
      revision: env.VERCEL_GITHUB_COMMIT_SHA,
    },
  },
  stream,
);

export default logger;
