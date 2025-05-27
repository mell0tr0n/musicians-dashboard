import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import ProjectList from './components/ProjectList';
import { Project } from './models/Project';
import { PracticeSession } from './models/PracticeSession';

const LOCAL_STORAGE_KEY = 'projects';

const App = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const loaded = stored.map(Project.fromJSON);
    setProjects(loaded);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects.map(p => p.toJSON())));
  }, [projects]);

  const handleSaveSession = ({ title, duration }) => {
    const session = new PracticeSession(title, [], duration);

    setProjects(prevProjects => {
      const updatedProjects = [...prevProjects];
      const existing = updatedProjects.find(
        (p) => p.title.toLowerCase() === title.toLowerCase()
      );

      if (existing) {
        existing.addPracticeSession(session);
      } else {
        const newProject = new Project(title);
        newProject.addPracticeSession(session);
        updatedProjects.unshift(newProject);
      }

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProjects.map(p => p.toJSON())));
      return updatedProjects;
    });
  };

  return (
    <div>
      <h1>Musician’s Dashboard</h1>
      <Timer onSave={handleSaveSession} projects={projects} />
      <ProjectList projects={projects} setProjects={setProjects} />
    </div>
  );
};

export default App;
