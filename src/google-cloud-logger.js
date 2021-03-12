// Imports the Google Cloud client library
const { Logging } = require("@google-cloud/logging");

class CloudLogger {
  constructor(projectId, logName, metadata) {

    // Creates a client
    const logging = new Logging({ projectId });

    // Metadata for entry
    this.metadata = metadata;

    // Selects the log to write to
    this.log = logging.log(logName);
  }

  async info(message) {
    // Prepares a log entry
    const entry = this._createEntry(message);

    // Writes the log entry
    await this.log.info(entry);
  }

  async error(message) {
    // Prepares a log entry
    const entry = this._createEntry(message);

    // Writes the log entry
    await this.log.error(entry);
  }

  _createEntry(message) {
    return !!this.metadata
      ? this.log.entry(this.metadata, message)
      : this.log.entry(message);
  }
}

module.exports = CloudLogger;
