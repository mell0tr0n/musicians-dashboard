// backend/Project.js

const { PracticeSession } = require('./PracticeSession');

class Project {
  constructor(
    title,
    chordsUrl = '',
    tags = [],
    notes = '',
    artist = '',
    recordingUrl = '',
    capo = null,
    memorized = null,
    transpose = null
  ) {
    this.title = title;
    this.chordsUrl = chordsUrl;
    this.tags = tags;
    this.notes = notes;
    this.artist = artist;
    this.recordingUrl = recordingUrl;
    this.capo = capo;
    this.memorized = memorized;
    this.transpose = transpose;
    this.createdAt = new Date();
    this.lastUpdated = new Date();
    this.practiceSessions = [];
  }

  update({
    title,
    chordsUrl,
    tags,
    notes,
    artist,
    recordingUrl,
    capo,
    memorized,
    transpose,
  }) {
    if (title !== undefined) this.title = title;
    if (chordsUrl !== undefined) this.chordsUrl = chordsUrl;
    if (tags !== undefined) this.tags = tags;
    if (notes !== undefined) this.notes = notes;
    if (artist !== undefined) this.artist = artist;
    if (recordingUrl !== undefined) this.recordingUrl = recordingUrl;
    if (capo !== undefined) this.capo = capo;
    if (memorized !== undefined) this.memorized = memorized;
    if (transpose !== undefined) this.transpose = transpose;
    this.lastUpdated = new Date();
  }

  addPracticeSession(session) {
    if (session instanceof PracticeSession) {
      this.practiceSessions.push(session);
      this.lastUpdated = new Date();
    } else {
      console.warn('Invalid session added: not a PracticeSession instance');
    }
  }

  toJSON() {
    return {
      title: this.title,
      chordsUrl: this.chordsUrl,
      recordingUrl: this.recordingUrl,
      tags: this.tags,
      notes: this.notes,
      artist: this.artist,
      capo: this.capo,
      memorized: this.memorized,
      transpose: this.transpose,
      createdAt: this.createdAt.toISOString(),
      lastUpdated: this.lastUpdated.toISOString(),
      practiceSessions: this.practiceSessions.map((s) => s.toJSON()),
    };
  }
}

module.exports = { Project };
