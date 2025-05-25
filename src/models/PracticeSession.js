// PracticeSession.js

export class PracticeSession {
  constructor(title = '', tags = [], duration = 0) {
    this.title = title;
    this.tags = tags;
    this.duration = duration; // in milliseconds
    this.createdAt = new Date();
  }

  setDuration(ms) {
    this.duration = ms;
  }

  getFormattedDuration() {
    const totalSeconds = Math.floor(this.duration / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
  }

  toJSON() {
    return {
      title: this.title,
      tags: this.tags,
      duration: this.duration,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
