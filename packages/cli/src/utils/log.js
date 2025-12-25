import chalk from "chalk";

export const log = {
  info: (msg) => console.log(chalk.blue.bold(`${msg}`)),
  success: (msg) => console.log(chalk.green.bold(`✔ ${msg}`)),
  warn: (msg) => console.log(chalk.yellow.bold(`⚠  ${msg}`)),
  error: (msg) => console.error(chalk.red.bold(`✖ ${msg}`)),
};
