# Mocha Stackdriver Merge

Merge tool to be used with .json files generated with [mocha-stackdriver-reporter-stats](https://github.com/Miscreancy/mocha-stackdriver-reporter-stats). Inspired by (mochawesome-merge)[https://github.com/Antontelesh/mochawesome-merge], google-logger lifted from [mocha-stackdriver-reporter](https://github.com/jouni-kantola/mocha-stackdriver-reporter).

## Install

`npm install mocha-stackdriver-merge`


## Usage

```bash
npx [path-to-reports]/[report_prefix]_*.json [-o/--output [path-to-output-file]/[output_filename].json -n/--no-cloud ]
```

By default, it does not write a file, and instead submits the merged object to the cloud logger with the details in the file.

If `--no-cloud` is specified, it __will__ write a file to `[path-to-reports]/[report_prefix]_merged.json`; to overwrite the output file location pass in `-o` with the file location. Specifying `-o` without `--no-cloud` both pass the log to Stackdriver and write the file for your perusal.

## Cypress

This was designed with Cypress in mind - recommended usage would be to pop a script in your package.json within cypress so you can `npm run` a combination of Cypress and this reporter.
