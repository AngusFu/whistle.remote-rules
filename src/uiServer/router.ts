import Router from 'koa-router';
import qs from 'querystring';
import axios from 'axios';
import fs from 'fs';
import { execSync } from 'child_process';

// For help see https://github.com/ZijianHe/koa-router#api-reference
export default (router: Router) => {
  router.get('/', (ctx) => {
    if (ctx.params.remoteRules) {
      ctx.params.remoteRules = qs.unescape(ctx.params.remoteRules);
      axios.get(ctx.params.remoteRules).then(({ data }) => {
        const filename = `${__dirname}/_temp.js`;
        fs.writeFileSync(filename, data, { encoding: 'utf8' });
        execSync(`w2 add ${filename} --force`);
        execSync(`rm ${filename}`);
        ctx.body = 'Rules loaded!';
      }).catch((e) => {
        console.error(e);
        ctx.body = 'Invalid remoteRules!';
      });
    } else {
      ctx.body = 'No remoteRules!';
    }
  });
};
