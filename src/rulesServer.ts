const queryString = require('query-string');
const qs = require('querystring');
const fs = require('fs');
const { execSync } = require('child_process');
const axios = require('axios');

export default (server: Whistle.PluginServer, options: Whistle.PluginOptions) => {
  server.on('request', (req: Whistle.PluginRequest, res: Whistle.PluginResponse) => {
    const urlQuery = options.parseUrl(req.originalReq.url);
    const parsed = queryString.parse(urlQuery.search);
    if (parsed.remoteRules) {
      parsed.remoteRules = qs.unescape(parsed.remoteRules);
      axios.get(parsed.remoteRules).then(({ data }) => {
        const filename = `${__dirname}/_temp.js`;
        fs.writeFileSync(filename, data, { encoding: 'utf8' });
        execSync(`w2 add ${filename} --force`);
        execSync(`rm ${filename}`);
        res.end();
      }).catch((e) => {
        console.error(e);
        res.end();
      });
    } else {
      res.end();
    }
  });
};
