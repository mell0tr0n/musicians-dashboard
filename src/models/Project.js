import { PracticeSession } from './PracticeSession.js';

export class Project {
  constructor(title, chordsUrl = '', tags = [], notes = '') {
    this.title = title;
    this.chordsUrl = chordsUrl;
    this.tags = tags;
    this.notes = notes;
    this.createdAt = new Date();
    this.lastUpdated = new Date();
    this.practiceSessions = []; // array of PracticeSession instances
  }

  update({ title, chordsUrl, tags, notes }) {
    if (title !== undefined) this.title = title;
    if (chordsUrl !== undefined) this.chordsUrl = chordsUrl;
    if (tags !== undefined) this.tags = tags;
    if (notes !== undefined) this.notes = notes;
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
      tags: this.tags,
      notes: this.notes,
      createdAt: this.createdAt.toISOString(),
      lastUpdated: this.lastUpdated.toISOString(),
      practiceSessions: this.practiceSessions.map(session => session.toJSON()),
    };
  }

  static fromJSON(json) {
    const obj = new Project(
      json.title,
      json.chordsUrl,
      json.tags || [],
      json.notes || ''
    );
    obj.createdAt = new Date(json.createdAt);
    obj.lastUpdated = new Date(json.lastUpdated);
    obj.practiceSessions = (json.practiceSessions || []).map(s =>
      PracticeSession.fromJSON(s)
    );
    return obj;
  }
}
