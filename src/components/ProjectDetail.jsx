// frontend/src/components/ProjectDetail.jsx

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Link,
  Divider,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const formatDate = (isoString) => {
  if (!isoString) return '—';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(isoString).toLocaleDateString(undefined, options);
};

const ProjectDetail = ({ project }) => {
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
    <Box sx={{ width: '100%', px: 3, py: 2 }}>
      {/* Title + Artist + Menu */}
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
          <MenuItem onClick={handleMenuClose}>Edit Project</MenuItem>
          <MenuItem onClick={handleMenuClose}>Delete Project</MenuItem>
        </Menu>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        {/* Technical Info */}
        <Box>
          <Typography variant="subtitle1">Technical Info:</Typography>
          <Stack direction="row" spacing={4} mt={1}>
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
        <Box>
          <Typography variant="subtitle1">Links:</Typography>
          <Stack spacing={1} mt={1}>
            <Typography>
              Chords:{' '}
              {chordsUrl ? (
                <Link href={chordsUrl} target="_blank" rel="noopener">
                  {chordsUrl}
                </Link>
              ) : (
                '—'
              )}
            </Typography>
            <Typography>
              Recording:{' '}
              {recordingUrl ? (
                <Link href={recordingUrl} target="_blank" rel="noopener">
                  {recordingUrl}
                </Link>
              ) : (
                '—'
              )}
            </Typography>
          </Stack>
        </Box>

        {/* Tags */}
        <Box>
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
        <Box>
          <Typography variant="subtitle1">Notes:</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mt: 1 }}>
            {notes || '—'}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Typography variant="caption" color="text.secondary">
        Created: {formatDate(createdAt)}  Last Updated:{' '}
        {formatDate(lastUpdated)}
      </Typography>
    </Box>
  );
};

export default ProjectDetail;
