import React, { useState } from 'react';
import { Box, IconButton, Popover, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../Utility/axios';
import { useParams } from 'react-router-dom';

const FloatingMenu = ({
  icon = <ArrowBackIosIcon sx={{ fontSize: 20 }} />, 
  menuItems = [],
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  sx = {},
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { project } = useParams();
  const [description, setDescription] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [descModalOpen, setDescModalOpen] = useState(false);
  const [amenitiesModalOpen, setAmenitiesModalOpen] = useState(false);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  React.useEffect(() => {
    if (!project) return;
    axiosInstance.get(`/app/project/${project}/details`)
      .then(response => {
        const {description, project_url, amenities } = response.data;
        setDescription(description || '');
        setProjectUrl(project_url || '');
        setAmenities(amenities || []);
      })
      .catch(error => {
        console.error('API error:', error);
      });
  }, [project]);
  return (
    <>
      <Box sx={{ position: 'absolute', right: 5, top: 250, zIndex: 1000, ...sx }}>
        <IconButton
          onClick={handleClick}
          sx={{
            bgcolor: 'rgba(255,255,255,0.9)',
            color: '#023047',
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: 2,
            width: 40,
          }}
        >
          {icon}
        </IconButton>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
        >
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                key="descrition"
                variant="contained"
                sx={{
                  bgcolor: '#023047',
                  color: 'white',
                  '&:hover': { bgcolor: '#219ebc' },
                  minWidth: 120,
                }}
                onClick={() => {
                  setDescModalOpen(true);
                }}
              >
                Description
              </Button>

              {projectUrl && (
                <Button
                  key="vr_tour"
                  variant="contained"
                  sx={{
                    bgcolor: '#023047',
                    color: 'white',
                    '&:hover': { bgcolor: '#219ebc' },
                    minWidth: 120,
                  }}
                  onClick={() => { window.open(projectUrl, '_blank') }}
                >
                  VR Tour
                </Button>
              )}

              <Button
                key="amenities"
                variant="contained"
                sx={{
                  bgcolor: '#023047',
                  color: 'white',
                  '&:hover': { bgcolor: '#219ebc' },
                  minWidth: 120,
                }}
                onClick={() => {
                  setAmenitiesModalOpen(true);
                }}
              >
                Amenities
              </Button>
          </Box>
        </Popover>
      </Box>

      {/* Place Dialogs here, outside the Box/Popover */}
      <Dialog
        open={descModalOpen}
        onClose={() => setDescModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: '#023047d4',
            color: 'white',
            position: 'relative',
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: 'white', pr: 5 }}>
          Description
          <IconButton
            aria-label="close"
            onClick={() => setDescModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ color: 'white', fontSize: 18, mb: 4 }}>
          <div style={{ whiteSpace: 'pre-line' }}>{description || 'No description available.'}</div>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={amenitiesModalOpen} 
        onClose={() => setAmenitiesModalOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            background: '#023047d4',
            color: 'white',
            position: 'relative',
          }
        }}
      >
        <DialogTitle>Amenities</DialogTitle>
        <IconButton
            aria-label="close"
            onClick={() => setAmenitiesModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
            }}
          >
            <CloseIcon />
        </IconButton>
        <DialogContent>
          {amenities.length === 0 ? (
            <div>No amenities available.</div>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              {amenities.map((a, idx) => (
                <Box key={a.id || idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  {a.image && (
                    <img
                      src={a.image}
                      alt={a.name}
                      style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 8, cursor: a.vr_url ? 'pointer' : 'default', border: '2px solid #219ebc', background: '#fff' }}
                      onClick={() => a.vr_url && window.open(a.vr_url, '_blank')}
                    />
                  )}
                  <Box sx={{ mt: 1, color: 'white', fontWeight: 500, fontSize: 18, textAlign: 'center' }}>{a.name}</Box>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingMenu; 