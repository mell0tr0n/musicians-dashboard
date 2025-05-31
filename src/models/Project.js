import { PracticeSession } from './PracticeSession.js';

export class Project {
  constructor(title, chordsUrl = '', tags = [], notes = '', artist = '') {
    this.title = title;
    this.chordsUrl = chordsUrl;
    this.tags = tags;
    this.notes = notes;
    this.artist = artist;
    this.createdAt = new Date();
    this.lastUpdated = new Date();
    this.practiceSessions = [];
  }

  update({ title, chordsUrl, tags, notes, artist }) {
    if (title !== undefined) this.title = title;
    if (chordsUrl !== undefined) this.chordsUrl = chordsUrl;
    if (tags !== undefined) this.tags = tags;
    if (notes !== undefined) this.notes = notes;
    if (artist !== undefined) this.artist = artist;
    this.lastUpdated = new Date();
  }

  toJSON() {
    return {
      title: this.title,
      chordsUrl: this.chordsUrl,
      tags: this.tags,
      notes: this.notes,
      artist: this.artist,
      createdAt: this.createdAt.toISOString(),
      lastUpdated: this.lastUpdated.toISOString(),
      practiceSessions: this.practiceSessions.map((s) => s.toJSON()),
    };
  }

  static fromJSON(json) {
    const obj = new Project(
      json.title,
      json.chordsUrl,
      json.tags || [],
      json.notes || '',
      json.artist || ''
    );
    obj.createdAt = new Date(json.createdAt);
    obj.lastUpdated = new Date(json.lastUpdated);
    obj.practiceSessions = (json.practiceSessions || []).map((s) =>
      PracticeSession.fromJSON(s)
    );
    return obj;
  }
}
