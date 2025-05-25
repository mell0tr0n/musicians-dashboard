import { PracticeSession } from '../models/PracticeSession';

test('constructor sets title, tags, and duration correctly', () => {
  const session = new PracticeSession('My Song', ['practice', 'guitar'], 90000);
  expect(session.title).toBe('My Song');
  expect(session.tags).toEqual(['practice', 'guitar']);
  expect(session.duration).toBe(90000);
  expect(session.createdAt).toBeInstanceOf(Date);
});

test('setDuration() updates the duration', () => {
  const session = new PracticeSession();
  session.setDuration(45000);
  expect(session.duration).toBe(45000);
});

test('getFormattedDuration() returns correctly formatted time', () => {
  const session = new PracticeSession();
  session.setDuration(125000); // 2m 5s
  expect(session.getFormattedDuration()).toBe('2m 05s');
});

test('toJSON() returns correct structure', () => {
  const session = new PracticeSession('Etude', ['tag1'], 60000);
  const json = session.toJSON();
  expect(json).toHaveProperty('title', 'Etude');
  expect(json).toHaveProperty('tags', ['tag1']);
  expect(json).toHaveProperty('duration', 60000);
  expect(json).toHaveProperty('createdAt');
  expect(typeof json.createdAt).toBe('string'); // ISO string
});
