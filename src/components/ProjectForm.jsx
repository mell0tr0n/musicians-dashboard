// src/components/ProjectForm.jsx

import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import TagInput from './TagInput';

const ProjectForm = ({ mode = 'add', initialData = {}, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [chordsUrl, setChordsUrl] = useState(initialData.chordsUrl || '');
  const [notes, setNotes] = useState(initialData.notes || '');

  // Add mode (chip input)
  const [tags, setTags] = useState(initialData.tags || []);
  const [tagInput, setTagInput] = useState('');

  // Edit mode (plain text)
  const [editTagText, setEditTagText] = useState(
    initialData.tags ? initialData.tags.join(', ') : ''
  );

  const [titleError, setTitleError] = useState('');
  const [urlError, setUrlError] = useState('');

  const isValidHttpUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = () => {
    let valid = true;

    if (!title.trim()) {
      setTitleError('Title is required.');
      valid = false;
    } else {
      setTitleError('');
    }

    if (chordsUrl.trim() && !isValidHttpUrl(chordsUrl.trim())) {
      setUrlError('Please enter a valid URL.');
      valid = false;
    } else {
      setUrlError('');
    }

    if (!valid) return;

    const parsedTags =
      mode === 'edit'
        ? editTagText
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : tags.map((t) => t.trim()).filter(Boolean);

    const projectData = {
      title: title.trim(),
      chordsUrl: chordsUrl.trim(),
      notes: notes.trim(),
      tags: parsedTags,
    };

    onSave(projectData);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={!!titleError}
        helperText={titleError}
        fullWidth
      />

      <TextField
        label="Chords/Lyrics URL"
        value={chordsUrl}
        onChange={(e) => setChordsUrl(e.target.value)}
        error={!!urlError}
        helperText={urlError}
        fullWidth
      />

      {mode === 'edit' ? (
        <TextField
          label="Tags"
          fullWidth
          value={editTagText}
          onChange={(e) => setEditTagText(e.target.value)}
        />
      ) : (
        <TagInput
          tags={tags}
          setTags={setTags}
          tagInput={tagInput}
          setTagInput={setTagInput}
        />
      )}

      <TextField
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        fullWidth
        multiline
        rows={2}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} color="primary">
          {mode === 'edit' ? 'Save Changes' : 'Save Project'}
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectForm;
