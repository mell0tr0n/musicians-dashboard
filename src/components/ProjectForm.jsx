import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Chip,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

const ProjectForm = ({ mode = 'add', initialData = {}, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [artist, setArtist] = useState(initialData.artist || '');
  const [chordsUrl, setChordsUrl] = useState(initialData.chordsUrl || '');
  const [notes, setNotes] = useState(initialData.notes || '');
  const [tags, setTags] = useState(initialData.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [editTagText, setEditTagText] = useState(
    initialData.tags ? initialData.tags.join(', ') : ''
  );
  const [titleError, setTitleError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNotes((prev) => `${prev} ${transcript}`.trim());
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleMicClick = () => {
    recognitionRef.current?.start();
  };

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
      artist: artist.trim(),
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
        label="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
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
        <TextField
          label="Tags"
          variant="outlined"
          fullWidth
          InputProps={{
            inputComponent: TagInputBase,
            inputProps: {
              tags,
              setTags,
              tagInput,
              setTagInput,
            },
          }}
        />
      )}

      <TextField
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        fullWidth
        multiline
        rows={2}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleMicClick} aria-label="Start recording">
                {isRecording ? (
                  <MicIcon sx={{ color: '#73b8c7' }} />
                ) : (
                  <MicOffIcon />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
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

// Inline component: Tag input with chips inside TextField
const TagInputBase = React.forwardRef(function TagInputBase(props, ref) {
  const { tags, setTags, tagInput, setTagInput, ...other } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
        minHeight: '2.5em',
        pl: 1,
        pt: 1,
        pb: 0.5,
      }}
    >
      {tags.map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          onDelete={() => setTags(tags.filter((_, i) => i !== index))}
          size="small"
          color="secondary"
        />
      ))}
      <input
        {...other}
        ref={ref}
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={(e) => {
          if (
            (e.key === 'Enter' || e.key === ',' || e.key === ' ') &&
            tagInput.trim()
          ) {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (!tags.includes(newTag)) {
              setTags([...tags, newTag]);
            }
            setTagInput('');
          }
        }}
        style={{
          border: 'none',
          outline: 'none',
          fontSize: '1rem',
          padding: 0,
          margin: 0,
          minWidth: '100px',
          background: 'transparent',
        }}
      />
    </Box>
  );
});

export default ProjectForm;
