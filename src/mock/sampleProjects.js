// src/mock/sampleProjects.js

import { Project } from '../models/Project';

const sampleProjects = [
  new Project(
    'Warrior – Yeah Yeah Yeahs',
    'https://tabs.ultimate-guitar.com/tab/yeah-yeah-yeahs/warrior-chords-393253',
    ['riff'],
    'Improvement on transition into second verse'
  ),
  new Project(
    'Mouth of a Flower – Haley Heynderickx',
    '',
    ['vocals'],
    'Try breathing in rhythm with the phrase'
  ),
  new Project(
    'Hush Brain – Original Song',
    '',
    ['original', 'layering'],
    'Sketch harmony for outro'
  ),
];

export default sampleProjects;
