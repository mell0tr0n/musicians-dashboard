// src/components/TagInput.jsx

import React from 'react';
import { Box, Chip, TextField, InputBase } from '@mui/material';

const TagInput = ({ tags, setTags, tagInput, setTagInput, label = 'Tags' }) => {
  return (
    <TextField
      label={label}
      fullWidth
      variant="outlined"
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
  );
};

// 🔧 Custom InputBase that behaves like native input but renders chips
const TagInputBase = React.forwardRef(function TagInputBase(props, ref) {
  const { tags, setTags, tagInput, setTagInput, ...other } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        minHeight: '1.5em',
        pl: 1,
        pt: 1,
        pb: 0.5,
        gap: 0.5,
      }}
    >
      {tags.map((tag, i) => (
        <Chip
          key={i}
          label={tag}
          onDelete={() => setTags(tags.filter((_, j) => j !== i))}
          color="secondary"
          size="small"
        />
      ))}
      <input
        {...other}
        ref={ref}
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
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
          flex: 1,
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

export default TagInput;
