import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFileSync} from 'node:fs';

import {SSMClient, GetParametersCommand} from '@aws-sdk/client-ssm';
import yargs from 'yargs/yargs';

// assume this is used as local module under node_modules
const root = (() => {
  const p = fileURLToPath(import.meta.url);
  if (p.indexOf('node_modules') > 0) {
    return p.split('node_modules')[0];
  } else {
    // directly used; for debugging
    return dirname(join(p, '..', '..'));
  }
})();

async function config() {
  const {argv} = yargs(process.argv.slice(2))
    .config('config', (configPath) => {
      try {
        return JSON.parse(readFileSync(configPath, 'utf-8'));
      } catch {
        return {};
      }
    });

  if (argv.ssm?.constructor === Object) {
    try {
      const configPath = join(root, 'config.json');
      console.log(`loading config from ${configPath}`);
      const fileConfig = JSON.parse(readFileSync(configPath, 'utf8'));

      if (!fileConfig.ssm) return fileConfig;

      const client = new SSMClient(fileConfig.ssm.config);
      const ssmConfig = await client.send(new GetParametersCommand({
        Names: [fileConfig.ssm.name],
        WithDecryption: true,
      }));

      return JSON.parse(ssmConfig.Parameters[0].Value);
    } catch (err) {
      console.log(`failed to load from ssm: ${err}`);
      throw err;
    }
  } else {
    return argv;
  }
}

export default await config();
