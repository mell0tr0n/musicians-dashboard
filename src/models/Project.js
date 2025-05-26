export class Project {
  constructor(title, chordsUrl = '', tags = [], notes = '') {
    this.title = title;
    this.chordsUrl = chordsUrl;
    this.tags = tags;
    this.notes = notes;
    this.createdAt = new Date();
    this.lastUpdated = new Date();
  }

  update({ title, chordsUrl, tags, notes }) {
    if (title !== undefined) this.title = title;
    if (chordsUrl !== undefined) this.chordsUrl = chordsUrl;
    if (tags !== undefined) this.tags = tags;
    if (notes !== undefined) this.notes = notes;
    this.lastUpdated = new Date();
  }

  toJSON() {
    return {
      title: this.title,
      chordsUrl: this.chordsUrl,
      tags: this.tags,
      notes: this.notes,
      createdAt: this.createdAt.toISOString(),
      lastUpdated: this.lastUpdated.toISOString(),
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
    return obj;
  }
}
