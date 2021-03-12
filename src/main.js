#!/usr/bin/node

"use strict";

const CloudLogger = require("./google-cloud-logger")
const fs = require("fs-extra")
const path = require("path")
const glob = require("glob")

function StackdriverMergeAndLog(argv) {

const files = argv.f

if (!files.length) {
  throw new Error(`Cannot find any files at ${argv.f} - is this the right location?`)
}


const configObj = getConfig(files[0])

const metadataObj = getMetadata(files[0])

const statsArray = getStats(files[0])

const newFileObj = mergeFileData(files, statsArray)

const log = new CloudLogger(configObj.projectId, configObj.logName, metadataObj);

if (argv.o) {
  const mergedFileObj = {
    data: {}
  }
  mergedFileObj.metadata = metadataObj
  mergedFileObj.data = newFileObj
  mergedFileObj.projectId = configObj.projectId
  mergedFileObj.logName = configObj.logName
  fs.writeJSONSync(argv.o, mergedFileObj)
}

if (!argv.n) {
  if (newFileObj.failures.length > 0) log.error(newFileObj);
  else log.info(newFileObj);
}

}

module.exports = StackdriverMergeAndLog

function getConfig(file) {
  const report = fs.readJSONSync(file)
  if (!report.projectId || !report.logName ) {
    const errorMessage = `
Cannot find projectId or logName values in the files indicated!
`;
    console.error("Error:", errorMessage);

    throw new Error(errorMessage);
  }

  const { projectId, logName } = report

  return {
    projectId,
    logName
  }
}

function getMetadata(file) {
  const report = fs.readJSONSync(file)

  const entryMetadata = report.metadata

  if (!entryMetadata) return undefined;
  return entryMetadata
}

function getStats(file) {
  const report = fs.readJSONSync(file)
  const statsArray = Object.keys(report.data.stats)
  return statsArray
}

function mergeFileData(files, statsArray) {


  const newFileObj = {
    suites: [],
    passes: [],
    failures: [],
    stats: {
    }
  }

  console.log(newFileObj)

  files.forEach( file => {
    const report = fs.readJSONSync(file)
    if (report.data.suite) { newFileObj.suites.push(report.data.suite)}
    if (report.data.passes.length > 0) {
      report.data.passes.forEach ( pass => {
        newFileObj.passes.push(pass)
      })
    }
    if (report.data.failures.length > 0) {
      report.data.failures.forEach( fail => {
        newFileObj.failures.push(fail)
      })
    }
    statsArray.forEach(stat => {
      if (stat.includes("start")) {
        if (!newFileObj.stats.start) {
          newFileObj.stats.start = report.data.stats.start
        } else if (newFileObj.stats.start > report.data.stats.start) {
          newFileObj.start.start = report.data.stats.start
        }
      } else if (stat == "end") {
        if (!newFileObj.stats.end) {
          newFileObj.stats.end = report.data.stats.end
        } else if (newFileObj.stats.end < report.data.stats.end) {
          newFileObj.stats.end = report.data.stats.end
        }
      } else if (stat.includes("has")) {
        if (!newFileObj.stats[stat]) {
          newFileObj.stats[stat] = false
        }
      } else {
        if (!newFileObj.stats[stat]) {
          newFileObj.stats[stat] = report.data.stats[stat]
        } else {
          newFileObj.stats[stat] = newFileObj.stats[stat] + report.data.stats[stat]
        }
      }

    })

  if (newFileObj.stats.passPercent) {
    newFileObj.stats.passPercent = newFileObj.stats.passes/newFileObj.stats.tests * 100
  }
  if (newFileObj.stats.pendingPercent && newFileObj.stats.pendingPercent > 0) {
    newFileObj.stats.pendingPercent = newFileObj.stats.pending/newFileObj.stats.tests * 100
  }
  if (newFileObj.stats.other > 0 ) {
    newFileObj.stats.hasOther = true
  }
  if (newFileObj.stats.skipped > 0) {
    newFileObj.stats.skipped = true
  }
})
return newFileObj
}
