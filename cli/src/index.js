#!/usr/bin/env node
process.env.DOTENV_CONFIG_QUIET = "true";
process.env.DOTENVX_QUIET = "true";
import "dotenv/config";
import { Command } from "commander";
import { login } from "./commands/login.js";
import { mkcat } from "./commands/mkcat.js";
import { listCategories } from "./commands/listCat.js";
import { pushComponent } from "./commands/push.js";
import { pullComponent } from "./commands/pull.js";
import { initMcp } from "./commands/init.js";
import { createRequire } from "module";
import { log } from "./utils/log.js";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json");

const program = new Command();

program
  .name("composter")
  .description("CLI for Composter Platform")
  .version(packageJson.version)
  .configureOutput({
    // Override the default error handling to use our custom handler
    writeErr: (str) => {
      if (str.includes("error:")) log.error(str.trim());
      else log.info(str.trim());
    },
  });

program
  .command("login")
  .description("Log into your Composter account")
  .action(login);

program
  .command("init [client]")
  .description("Shows how to configure MCP for your AI assistant")
  .action((client) => {
    initMcp(client);
  });

program
  .command("mkcat <category-name>")
  .description("Create a new category")
  .action((categoryName) => mkcat(categoryName));

program 
  .command("ls")
  .description("List categories")
  .action(() => {
    listCategories();
  });

program
  .command("push <category-name> <component-title> <file-path>")
  .description("Push a new component")
  .action((category, title, filepath) => {
    pushComponent(category, title, filepath);
  });

program
  .command("pull <category-name> <component-title> <file-path>")
  .description("Pull a component")
  .action((category, title, filepath) => {
    pullComponent(category, title, filepath);
  });

process.on("SIGINT", () => {
  process.stdout.write("\n");
  process.exit(130);
});

process.on("unhandledRejection", (err) => {
  // Ctrl+C during fetch / inquirer
  if (
    err?.name === "AbortError" ||
    err?.name === "ExitPromptError"
  ) {
    log.info("\nOperation cancelled by user.\n");
    process.exit(130);
  }

  console.error(err);
  process.exit(1);
});

program.parse(process.argv);
