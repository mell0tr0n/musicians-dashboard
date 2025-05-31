import Papa from 'papaparse';
import { Project } from '../models/Project';
import rawCsv from '../data/imported_songs.csv?raw';

export const parseCsvToProjects = () => {
  const { data } = Papa.parse(rawCsv, {
    header: true,
    skipEmptyLines: true,
  });

  return data.map((row) => {
    const title = row['Song']?.trim() || 'Untitled';
    const chordsUrl = row['Chords']?.trim() || '';
    const artist = row['Artist']?.trim() || '';

    const notesParts = [];
    if (row['Capo']) notesParts.push(`Capo: ${row['Capo'].trim()}`);
    if (row['Memorized'])
      notesParts.push(`Memorized: ${row['Memorized'].trim()}`);
    if (row['Notes']) notesParts.push(row['Notes'].trim());
    const notes = notesParts.join('\n');

    const tags = [];
    if (artist) tags.push(artist);
    if (row['Key']) tags.push(row['Key'].trim().toLowerCase());

    return new Project(title, chordsUrl, tags, notes, artist);
  });
};
