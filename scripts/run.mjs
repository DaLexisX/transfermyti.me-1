import debug from "debug";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import {
  deleteEntitiesInWorkspaces,
  writeEntitiesToOutputFile,
} from "./clockify.mjs";
import { startServer } from "./server.mjs";
import { runTests } from "./tests.mjs";

debug.enable("tmt:*");

const RunAction = {
  ClockifyDelete: "clockify-delete",
  ClockifyWrite: "clockify-write",
  Serve: "serve",
  Tests: "tests",
};

// noinspection BadExpressionStatementJS
yargs(hideBin(process.argv))
  .command({
    command: RunAction.ClockifyDelete,
    describe: "Delete all entities on Clockify testing workspace",
    handler: deleteEntitiesInWorkspaces,
  })
  .command({
    command: RunAction.ClockifyWrite,
    describe: "Grabs all Clockify entities and writes them to ./clockify.json",
    handler: writeEntitiesToOutputFile,
  })

  .command({
    command: RunAction.Serve,
    describe: "Start the mock server",
    builder: {
      emptyTools: {
        alias: "e",
        describe: "Tools that should return empty API responses",
        type: "array",
        choices: ["clockify", "toggl"],
        default: [],
        demandOption: false,
      },
      port: {
        alias: "p",
        describe: "Port number to run server on (defaults to 9009)",
        type: "number",
        default: 9009,
        demandOption: false,
      },
    },
    handler: startServer,
  })

  .command({
    command: RunAction.Tests,
    describe: "Run the unit tests",
    handler: runTests,
  })

  .fail((message, err) => {
    if (message) {
      console.error(message);
    }
    if (err) {
      console.error(err);
    }
    process.exit(1);
  })
  .wrap(null)
  .help().argv;
