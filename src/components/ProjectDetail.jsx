// frontend/src/components/ProjectDetail.jsx

import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Divider,
  Link,
  Stack,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const formatDate = (isoString) => {
  if (!isoString) return '—';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(isoString).toLocaleDateString(undefined, options);
};

const ProjectDetail = ({ project, index, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  if (!project) return null;

  const {
    title,
    artist,
    chordsUrl,
    recordingUrl,
    notes,
    tags = [],
    capo,
    transpose,
    memorized,
    createdAt,
    lastUpdated,
  } = project;

  return (
    <Box sx={{ width: '100%', px: 2, wordBreak: 'break-word' }}>
      {/* Title and Menu */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="h6" color="text.secondary">
            by {artist}
          </Typography>
        </Box>
        <IconButton onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onEdit?.();
            }}
          >
            Edit Project
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onDelete?.(index);
            }}
            sx={{ color: 'error.main' }}
          >
            Delete Project
          </MenuItem>
        </Menu>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Technical Info */}
      <Box mb={2}>
        <Typography variant="subtitle1">Technical Info:</Typography>
        <Stack direction="row" spacing={4} mt={1} flexWrap="wrap">
          <Typography>Capo: {capo !== null ? capo : '—'}</Typography>
          <Typography>
            Transpose:{' '}
            {transpose !== null
              ? transpose >= 0
                ? `+${transpose}`
                : transpose
              : '—'}
          </Typography>
          <Typography>
            Memorized:{' '}
            {memorized === true ? 'Yes' : memorized === false ? 'No' : '—'}
          </Typography>
        </Stack>
      </Box>

      {/* Links */}
      <Box mb={2}>
        <Typography variant="subtitle1">Links:</Typography>
        <Stack spacing={1} mt={1}>
          <Typography sx={{ wordBreak: 'break-word' }}>
            Chords:{' '}
            {chordsUrl ? (
              <Link
                href={chordsUrl}
                target="_blank"
                rel="noopener"
                sx={{ wordBreak: 'break-word' }}
              >
                {chordsUrl}
              </Link>
            ) : (
              '—'
            )}
          </Typography>
          <Typography sx={{ wordBreak: 'break-word' }}>
            Recording:{' '}
            {recordingUrl ? (
              <Link
                href={recordingUrl}
                target="_blank"
                rel="noopener"
                sx={{ wordBreak: 'break-word' }}
              >
                {recordingUrl}
              </Link>
            ) : (
              '—'
            )}
          </Typography>
        </Stack>
      </Box>

      {/* Tags */}
      <Box mb={2}>
        <Typography variant="subtitle1">Tags:</Typography>
        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
          {tags.length > 0 ? (
            tags.map((tag, idx) => <Chip key={idx} label={tag} />)
          ) : (
            <Typography color="text.secondary">None</Typography>
          )}
        </Stack>
      </Box>

      {/* Notes */}
      <Box mb={3}>
        <Typography variant="subtitle1">Notes:</Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mt: 1 }}>
          {notes || '—'}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />
      <Typography variant="caption" color="text.secondary">
        Created: {formatDate(createdAt)}  Last Updated:{' '}
        {formatDate(lastUpdated)}
      </Typography>
    </Box>
  );
};

export default ProjectDetail;
