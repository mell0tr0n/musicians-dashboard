export class PracticeSession {
  constructor(title = '', tags = [], duration = 0) {
    this.title = title;
    this.tags = tags;
    this.duration = duration; // in milliseconds
    this.startTime = new Date(); // Added
    this.endTime = null;         // Optional: can be used later
    this.label = '';             // Optional: e.g., “Warm-ups”
    this.createdAt = new Date(); // Redundant but can keep for consistency
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
      startTime: this.startTime?.toISOString?.() || null,
      endTime: this.endTime?.toISOString?.() || null,
      label: this.label || '',
      createdAt: this.createdAt?.toISOString?.() || null,
    };
  }

  static fromJSON(json) {
    const session = new PracticeSession();
    session.title = json.title || '';
    session.tags = json.tags || [];
    session.duration = json.duration;
    session.startTime = json.startTime ? new Date(json.startTime) : null;
    session.endTime = json.endTime ? new Date(json.endTime) : null;
    session.label = json.label || '';
    session.createdAt = json.createdAt ? new Date(json.createdAt) : new Date();
    return session;
  }
}
