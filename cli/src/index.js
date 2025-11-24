#!/usr/bin/env node

import { Command } from "commander";
import { login } from "./commands/login.js";

const program = new Command();

program
  .name("composter")
  .description("CLI for Composter Platform")
  .version("0.1.0");

program
  .command("login")
  .description("Log into your Composter account")
  .action(login);

program.parse(process.argv);
