import React, { useState } from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

// media: [{ image_url, name, ... }]
const MediaLibrary = ({ media }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleOpen = (item) => {
    setSelected(item);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        {media.map((item, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id || idx}>
            <Card
              sx={{
                position: 'relative',
                cursor: 'pointer',
                boxShadow: 3,
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.03)', boxShadow: 6 }
              }}
              onClick={() => handleOpen(item)}
            >
              {item.image_url.endsWith('.mp4') ? (
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="video"
                    src={item.image_url}
                    sx={{ height: 200, objectFit: 'cover' }}
                    controls={false}
                    muted
                    onMouseOver={e => e.target.play()}
                    onMouseOut={e => e.target.pause()}
                  />
                  <PlayCircleOutlineIcon
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: 60,
                      color: 'rgba(255,255,255,0.8)',
                      pointerEvents: 'none'
                    }}
                  />
                </Box>
              ) : (
                <CardMedia
                  component="img"
                  image={item.image_url}
                  alt={item.name}
                  sx={{ height: 200, objectFit: 'cover' }}
                />
              )}
              <CardContent
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  bgcolor: 'rgba(0,0,0,0.55)',
                  color: 'white',
                  py: 1,
                  px: 2,
                  minHeight: 48
                }}
              >
                <Typography variant="subtitle1" noWrap>{item.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Preview Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
        <Box sx={{ position: 'relative', bgcolor: 'black', p: 2 }}>
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 10 }}
          >
            <CloseIcon />
          </IconButton>
          {selected && (selected.image_url.endsWith('.mp4') ? (
            <video
              src={selected.image_url}
              controls
              autoPlay
              style={{ width: '100%', maxHeight: '80vh', borderRadius: 12 }}
            />
          ) : (
            <img
              src={selected.image_url}
              alt={selected.name}
              style={{ width: '100%', maxHeight: '80vh', borderRadius: 12, objectFit: 'contain', background: '#222' }}
            />
          ))}
          {selected && (
            <Box sx={{ mt: 2, color: 'white' }}>
              <Typography variant="h6">{selected.name}</Typography>
              {selected.description && (
                <Typography variant="body1" sx={{ mt: 1 }}>{selected.description}</Typography>
              )}
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default MediaLibrary; 