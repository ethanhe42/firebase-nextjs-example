const { join } = require("path");
const functionsV2 = require("firebase-functions/v2");
// export declare type MemoryOption = "128MiB" | "256MiB" | "512MiB" | "1GiB" | "2GiB" | "4GiB" | "8GiB" | "16GiB" | "32GiB";
// https://firebase.google.com/docs/functions/beta/reference/firebase-functions.globaloptions.md#globaloptionscpu
functionsV2.setGlobalOptions({ memory: "1GiB", cpu: 1 });

const { default: next } = require("next");

const nextjsDistDir = join("src", require("./src/next.config.js").distDir);

// https://stackoverflow.com/questions/65601999/fetching-an-image-from-firebase-storage-using-next-image-results-in-a-400-status
const nextjsServer = next({
  dev: false,
  conf: {
    distDir: nextjsDistDir,
    images: {
      domains: [
        "www.notion.so",
        "notion.so",
        "images.unsplash.com",
        "pbs.twimg.com",
        "abs.twimg.com",
        "s3.us-west-2.amazonaws.com",
      ],
    },
  },
});
const nextjsHandle = nextjsServer.getRequestHandler();

exports.nextjsfunc = functionsV2.https.onRequest({ cors: true }, (req, res) => {
  return nextjsServer.prepare().then(() => nextjsHandle(req, res));
});
