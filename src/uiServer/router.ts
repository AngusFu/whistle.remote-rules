import Router from 'koa-router';
import qs from 'querystring';
import fs from 'fs';
import { execSync } from 'child_process';
import http from 'http';

// For help see https://github.com/ZijianHe/koa-router#api-reference
export default (router: Router) => {
  router.get('/', (ctx) => {
    if (ctx.params.remoteRules) {
      ctx.params.remoteRules = qs.unescape(ctx.params.remoteRules);
      let data = '';
      var req = http.get(ctx.params.remoteRules, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          data += chunk;
        });
        res.on('end', function () {
          const filename = `${__dirname}/_temp.js`;
          fs.writeFileSync(filename, data, { encoding: 'utf8' });
          execSync(`w2 add ${filename} --force`);
          execSync(`rm ${filename}`);
          ctx.redirect('/#rules');
        });
      }).on('error', (e) => {
        console.error(e);
        ctx.body = 'Invalid remoteRules!';
      });
    } else {
      ctx.body = 'No remoteRules!';
    }
  });
};
