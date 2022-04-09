import Router from 'koa-router';
import qs from 'querystring';
import fs from 'fs';
import { execSync } from 'child_process';
import https from 'https';

// For help see https://github.com/ZijianHe/koa-router#api-reference
export default (router: Router) => {
  router.get('/', async (ctx, next) => {
    if (ctx.request.query.remoteRules) {
      const remoteRules = qs.unescape(ctx.request.query.remoteRules);
      try {
        const data: string = await new Promise((resolve, reject) => {
          let temp = '';
          https.get(remoteRules, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
              temp += chunk;
            });
            res.on('end', function () {
              resolve(temp);
            });
          }).on('error', reject);
        });
        const filename = `${__dirname}/_temp.js`;
        const ruleName = data.match(/(?<=\.name\s?=\s?(`|'|")).+(?=\1)/)?.[0];
        fs.writeFileSync(filename, data, { encoding: 'utf8' });
        execSync(`w2 add ${filename} --force`);
        execSync(`rm ${filename}`);
        const redirectURL = `http://${ctx.request.header.host}/#rules?ruleName=${ruleName ? qs.escape(ruleName) : ''}`;
        ctx.redirect(redirectURL);
      } catch (e) {
        console.error(e);
        ctx.body = 'Invalid remoteRules!';
      }
    } else {
      ctx.body = 'No remoteRules!';
    }
  });
};
