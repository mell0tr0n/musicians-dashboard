// src/data/mockProjects.js

export const mockProjects = [
  {
    title: 'Jazz Standards',
    tags: ['jazz', 'improv'],
    notes: 'Focus on ii-V-I progressions and tone control.',
    chordsUrl: 'https://example.com/jazz-standards',
    practiceSessions: [
      { duration: 900000, date: '2024-05-24T10:00:00Z' },
      { duration: 1200000, date: '2024-05-25T14:30:00Z' },
    ],
  },
  {
    title: 'Classical Etudes',
    tags: ['classical', 'technique'],
    notes: 'Target articulation and dynamics in Czerny exercises.',
    chordsUrl: 'https://example.com/classical-etudes',
    practiceSessions: [{ duration: 600000, date: '2024-05-23T18:00:00Z' }],
  },
  {
    title: 'Original Songwriting',
    tags: ['creative', 'lyrics'],
    notes: 'Working on new bridge section and chord variations.',
    chordsUrl: 'https://example.com/original-songwriting',
    practiceSessions: [],
  },
];
