class PracticeSession {
  constructor(duration = 0, startTime = null, endTime = null) {
    this.duration = duration;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  start() {
    this.startTime = new Date();
  }

  stop() {
    this.endTime = new Date();
    this.duration = this.endTime - this.startTime;
  }

  save(duration) {
    this.duration = duration;
  }

  getFormattedDuration() {
    const totalSeconds = Math.floor(this.duration / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }

  toJSON() {
    return {
      duration: this.duration,
      startTime: this.startTime,
      endTime: this.endTime,
    };
  }
}

module.exports = { PracticeSession };
