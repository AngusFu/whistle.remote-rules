import Router from "koa-router";
import fs from "fs-extra";
import axios from "axios";

const taskFilePath = __dirname + "/tasks.txt";
fs.ensureFileSync(taskFilePath);
runTask();

// For help see https://github.com/ZijianHe/koa-router#api-reference
export default (router: Router) => {
  router.get("/api/tasks", async (ctx, next) => {
    const content = await fs.readFile(taskFilePath, "utf-8");
    ctx.body = content.trim();
  });
  router.post("/api/tasks", async (ctx, next) => {
    if (ctx.request.body.data) {
      await fs.writeFile(taskFilePath, ctx.request.body.data);

      ctx.body = "ok";
      process.nextTick(() => {
        sync();
      });
    } else {
      ctx.body = "error";
    }
  });

  router.get("/", async (ctx, next) => {
    if (!ctx.request.query.remoteRules) {
      ctx.body = `<!DOCTYPE html>
        <html>
          <head>
            <link rel="stylesheet" href="../public/purecss.3.0.0.min.css?${Date.now()}" />
          </head>
          <body>
            <div id=root></div>
            <script src="../public/jquery.3.6.3.min.js"></script>
            <script src="main.js"></script>
          </body>
        </html>
      `.replace(/\.\.\/public\//g, "");
      return;
    }

    const remoteRules = decodeURIComponent(
      ctx.request.query.remoteRules as string
    );

    try {
      const { host } = ctx.request.header;
      const { ruleName } = await install(remoteRules);
      ctx.redirect(`http://${host}/#rules?ruleName=${ruleName}`);
    } catch (e) {
      console.error(e);
      ctx.body = "Invalid remoteRules!";
    }
  });
};

async function runTask() {
  sync();
  setTimeout(runTask, 5 * 60 * 1000);
}

async function sync() {
  const content = await fs.readFile(taskFilePath, "utf-8");
  const lines = content
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((el) => el && /^https?:/.test(el));

  for (const line of lines) {
    await install(line).catch(() => {
      //noop
    });
  }
}

async function install(url: string) {
  const e = encodeURIComponent;

  let { data } = await axios.get(url, { responseType: "text" });
  const res = /^# @rulName="([^"]+?)"/.exec(data.trim());
  const ruleName = res ? res[0] : "";

  // TODO
  await axios.post(
    "http://127.0.0.1:8899/cgi-bin/rules/select",
    `name=${e(ruleName)}&value=${e(data)}&active=true&changed=true`
  );

  return { ruleName };
}
