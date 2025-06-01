// frontend/src/components/ProjectForm.jsx

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Stack,
} from '@mui/material';
import TagInput from './TagInput';

const ProjectForm = ({ mode = 'add', initialData = {}, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [artist, setArtist] = useState(initialData.artist || '');
  const [chordsUrl, setChordsUrl] = useState(initialData.chordsUrl || '');
  const [recordingUrl, setRecordingUrl] = useState(
    initialData.recordingUrl || ''
  );
  const [notes, setNotes] = useState(initialData.notes || '');
  const [tags, setTags] = useState(initialData.tags || []);
  const [capo, setCapo] = useState(initialData.capo ?? '');
  const [transpose, setTranspose] = useState(initialData.transpose ?? '');
  const [memorized, setMemorized] = useState(initialData.memorized ?? false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const project = {
      title: title.trim(),
      artist: artist.trim(),
      chordsUrl: chordsUrl.trim() || '',
      recordingUrl: recordingUrl.trim() || '',
      notes: notes.trim(),
      tags,
      capo: capo === '' ? null : parseInt(capo, 10),
      transpose: transpose === '' ? null : parseInt(transpose, 10),
      memorized,
    };
    onSave(project);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Typography variant="h6">
        {mode === 'edit' ? 'Edit Project' : 'Add New Project'}
      </Typography>

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <TextField
        label="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        required
      />

      <TextField
        label="Chords URL"
        value={chordsUrl}
        onChange={(e) => setChordsUrl(e.target.value)}
        fullWidth
      />

      <TextField
        label="Recording URL"
        value={recordingUrl}
        onChange={(e) => setRecordingUrl(e.target.value)}
        fullWidth
      />

      <TextField
        label="Notes"
        multiline
        minRows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <TagInput tags={tags} setTags={setTags} />

      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          label="Capo"
          type="number"
          inputProps={{ min: 0 }}
          value={capo}
          onChange={(e) => setCapo(e.target.value)}
        />

        <TextField
          label="Transpose"
          type="number"
          value={transpose}
          onChange={(e) => setTranspose(e.target.value)}
        />

        <FormControlLabel
          control={
            <Switch
              checked={memorized}
              onChange={(e) => setMemorized(e.target.checked)}
            />
          }
          label="Memorized"
        />
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" type="submit">
          {mode === 'edit' ? 'Save Changes' : 'Save Project'}
        </Button>
      </Stack>
    </Box>
  );
};

export default ProjectForm;
