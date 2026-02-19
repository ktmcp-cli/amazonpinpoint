import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getConfig, setConfig, isConfigured } from './config.js';
import { getStatus } from './api.js';

const program = new Command();

function printSuccess(message) {
  console.log(chalk.green('✓') + ' ' + message);
}

function printError(message) {
  console.error(chalk.red('✗') + ' ' + message);
}

function printJson(data) {
  console.log(JSON.stringify(data, null, 2));
}

async function withSpinner(message, fn) {
  const spinner = ora(message).start();
  try {
    const result = await fn();
    spinner.stop();
    return result;
  } catch (error) {
    spinner.stop();
    throw error;
  }
}

function requireAuth() {
  if (!isConfigured()) {
    printError('API key not configured.');
    console.log('\nRun: pinpoint-email config set --api-key YOUR_KEY');
    process.exit(1);
  }
}

program
  .name('pinpoint-email')
  .description('Amazon email service')
  .version('1.0.0');

const configCmd = program.command('config').description('Manage configuration');

configCmd
  .command('set')
  .option('--api-key <key>', 'API key')
  .action((options) => {
    if (options.apiKey) {
      setConfig('apiKey', options.apiKey);
      printSuccess('API key set');
    }
  });

configCmd
  .command('show')
  .action(() => {
    const apiKey = getConfig('apiKey');
    console.log('API Key:', apiKey ? chalk.green('***' + apiKey.slice(-4)) : chalk.red('not set'));
  });

program.parse(process.argv);
if (process.argv.length <= 2) program.help();
