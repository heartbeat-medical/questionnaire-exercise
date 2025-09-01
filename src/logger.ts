import * as util from "node:util";

export type Logger = {
  info: (msg: string, extra?: unknown) => void;
  warn: (msg: string, extra?: unknown) => void;
  error: (msg: string, extra?: unknown) => void;
  child: (name: string, extra?: unknown) => Logger;
}

const logWithExtra = (logFunction: (...data: unknown[]) => void, msg: string, extra: unknown) => {
  if (extra) {
    logFunction(new Date(), msg, util.inspect(extra, {colors: true, depth: 5}));
  } else {
    logFunction(new Date(), msg);
  }
}

export const createLogger = (name: string): Logger => {
  return {
    info: (msg: string, extra?: unknown) => {
      logWithExtra(console.log, `INFO [${name}] ${msg}`, extra);
    },
    warn: (msg: string, extra?: unknown) => {
      logWithExtra(console.warn, `WARN [${name}] ${msg}`, extra);
    },
    error: (msg: string, extra: unknown) => {
      logWithExtra(console.error, `ERROR [${name}] ${msg}`, extra);
    },
    child: (childName: string) => createLogger(`${name}.${childName}`),
  };
};


