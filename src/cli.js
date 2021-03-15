#!/usr/bin/env node

"use strict";

const CloudLogger = require("./google-cloud-logger")
const StackdriverMergeAndLog = require("./main.js")
const fs = require("fs-extra")
const path = require("path")
const glob = require("glob")

const argv = require("yargs")
  .command('$0 [files...]', 'Merge and log files', yargs => {
    yargs.positional('files', {
      description: 'Files to merge',
      type: 'array',
      alias: ['f'],
      demandOption: true
    })
  })
  .option('o', {
    alias: 'output',
    demandOption: false,
    describe: 'Output file path',
    type: 'string',
  })
  .option('f', {
    alias: 'files',
    demandOption: false,
    describe: 'Files to merge',
    type: 'array',
  })
  .option('n', {
    demandOption: false,
    describe: 'Run without logging to Stackdriver',
    type: 'boolean',
    default: false,
    alias: 'no-cloud'
  })
  .help()
  .argv

StackdriverMergeAndLog(argv)
