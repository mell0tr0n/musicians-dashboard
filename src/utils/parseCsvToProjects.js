import Papa from 'papaparse';
import { Project } from '../models/Project';
import rawCsv from '../data/imported_songs.csv?raw'; // Vite directive

export const parseCsvToProjects = () => {
  const { data } = Papa.parse(rawCsv, {
    header: true,
    skipEmptyLines: true,
  });

  return data.map((row) => {
    const title = row['Song']?.trim() || 'Untitled';
    const chordsUrl = row['Chords']?.trim() || '';
    const notesParts = [];

    if (row['Artist']) notesParts.push(`Artist: ${row['Artist'].trim()}`);
    if (row['Capo']) notesParts.push(`Capo: ${row['Capo'].trim()}`);
    if (row['Memorized'])
      notesParts.push(`Memorized: ${row['Memorized'].trim()}`);
    if (row['Notes']) notesParts.push(row['Notes'].trim());

    const notes = notesParts.join('\n');

    const tags = [];
    if (row['Artist']) tags.push(row['Artist'].trim());
    if (row['Key']) tags.push(row['Key'].trim().toLowerCase());

    return new Project(title, chordsUrl, tags, notes);
  });
};
