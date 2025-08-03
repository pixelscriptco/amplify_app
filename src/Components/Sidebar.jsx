import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { LocationIcon } from '../Data/icons';
import { view_360 } from '../Data/images/AmenitiesSvgs';
import axiosInstance from '../Utility/axios';
import { useParams } from 'react-router-dom';
import { smart_world_site_1 } from '../Data/Screen1PageSvg';

// Simple SVG placeholders for Description and Construction Updates
const DescriptionIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="20" height="16" rx="2" fill="currentColor"/>
    <rect x="10" y="12" width="12" height="2" rx="1" fill="#fff"/>
    <rect x="10" y="16" width="8" height="2" rx="1" fill="#fff"/>
  </svg>
);
const ConstructionIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="currentColor"/>
    <rect x="14" y="8" width="4" height="10" rx="2" fill="#fff"/>
    <rect x="12" y="20" width="8" height="4" rx="2" fill="#fff"/>
  </svg>
);
const AmenitiesIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="currentColor"/>
    <rect x="10" y="14" width="12" height="4" rx="2" fill="#fff"/>
    <rect x="14" y="10" width="4" height="4" rx="2" fill="#fff"/>
  </svg>
);

// Custom Location icon (pin/marker)
const CustomLocationIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 29C16 29 26 20.5 26 13.5C26 8.25329 21.7467 4 16.5 4C11.2533 4 7 8.25329 7 13.5C7 20.5 16 29 16 29Z" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    <circle cx="16.5" cy="13.5" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

// Custom 360 view icon (circular arrow)
const Custom360Icon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="20" rx="10" ry="4" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M16 6V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 6C20.4183 6 24 9.58172 24 14" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M16 6C11.5817 6 8 9.58172 8 14" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M20 10L24 14L20 18" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const iconData = [
  { Icon: DescriptionIcon, label: 'Description' },
  { Icon: CustomLocationIcon, label: 'Location' },
  { Icon: AmenitiesIcon, label: 'Amenities' },
  { Icon: ConstructionIcon, label: 'Construction Updates' },
  { Icon: Custom360Icon, label: 'Project Tour' },
];

const Sidebar = () => {
  const iconRefs = useRef([]);
  const [showDescription, setShowDescription] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);
  const [showConstructionUpdates, setShowConstructionUpdates] = useState(false);
  const { project } = useParams();
  const [description, setDescription] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [project_updates, setProjectUpdates] = useState([]);

  useEffect(() => {
    iconRefs.current.forEach((ref, idx) => {
      if (ref) {
        tippy(ref, {
          content: iconData[idx].label,
          placement: 'right',
          animation: 'shift-away',
          arrow: true,
          theme: 'light',
        });
      }
    });
    // Cleanup tippy instances on unmount
    return () => {
      iconRefs.current.forEach(ref => {
        if (ref && ref._tippy) ref._tippy.destroy();
      });
    };
  }, []);

  useEffect(() => {
    if (!project) return;
    axiosInstance.get(`/app/project/${project}/details`)
      .then(response => {
        const {description, project_url, amenities ,project_updates} = response.data;
        setDescription(description || '');
        setProjectUrl(project_url || '');
        setAmenities(amenities || []);
        setProjectUpdates(project_updates || []);
      })
      .catch(error => {
        console.error('API error:', error);
      });
  }, [project]);

  const handleIconClick = idx => {
    setShowDescription(false);
    setShowLocation(false);
    setShowAmenities(false);
    setShowConstructionUpdates(false);
    if (idx === 0) setShowDescription(true);
    if (idx === 1) setShowLocation(true);
    if (idx === 2) setShowAmenities(true);
    if (idx === 3) setShowConstructionUpdates(true);
    // Add more handlers for other icons if needed
  };

  // Add this helper to determine which icon is active
  const getActiveIdx = () => {
    if (showDescription) return 0;
    if (showLocation) return 1;
    if (showAmenities) return 2;
    if (showConstructionUpdates) return 3;
    return -1;
  };

  return (
    <>
      <SidebarContainer className="sidebar">
        <div className="sidebar-icons">
          {iconData.map(({ Icon }, idx) => (
            <div
              className={`sidebar-icon-item${getActiveIdx() === idx ? ' active' : ''}`}
              key={idx}
              ref={el => (iconRefs.current[idx] = el)}
              tabIndex={0}
              style={{ outline: 'none' }}
              onClick={() => handleIconClick(idx)}
            >
              <Icon />
            </div>
          ))}
        </div>
      </SidebarContainer>
      <SlidePanel open={showDescription}>
        <div className="slide-panel-content">
          <button className="close-btn" onClick={() => setShowDescription(false)}>&times;</button>
          {/* <h2>Description</h2> */}
          <div style={{marginTop: 50}} dangerouslySetInnerHTML={{ __html: description }} ></div>
        </div>
      </SlidePanel>
      <SlidePanel open={showLocation}>
        <div className="slide-panel-content">
          <button className="close-btn" onClick={() => setShowLocation(false)}>&times;</button>
          <div style={{ width: '100%', height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <svg
              viewBox="0 0 1920 1080"
              width="100%"
              height="100%"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            >
              {smart_world_site_1}
            </svg>
          </div>
        </div>
      </SlidePanel>
      <SlidePanel open={showAmenities}>
        <div className="slide-panel-content">
          <button className="close-btn" onClick={() => setShowAmenities(false)}>&times;</button>
          <h2>Amenities</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 24 }}>
            {amenities.length === 0 ? (
              <div>No amenities available.</div>
            ) : (
              amenities.map((a, idx) => (
                <div key={a.id || idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 160 }}>
                  {a.image && (
                    <img
                      src={a.image}
                      alt={a.name}
                      style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, cursor: a.vr_url ? 'pointer' : 'default', border: '2px solid #219ebc', background: '#fff' }}
                      onClick={() => a.vr_url && window.open(a.vr_url, '_blank')}
                    />
                  )}
                  <div style={{ marginTop: 8, color: 'white', fontWeight: 500, fontSize: 16, textAlign: 'center' }}>{a.name}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </SlidePanel>
      <SlidePanel open={showConstructionUpdates}>
        <div className="slide-panel-content">
          <button className="close-btn" onClick={() => setShowConstructionUpdates(false)}>&times;</button>
          <h2>Construction Updates</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 24 }}>
            {project_updates.length === 0 ? (
              <div>No construction updates available.</div>
            ) : (
              project_updates.map((a, idx) => (
                <div key={a.id || idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 160 }}>
                  {a.image && (
                    <img
                      src={a.image}
                      alt={a.name}
                      style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, cursor: a.vr_url ? 'pointer' : 'default', border: '2px solid #219ebc', background: '#fff' }}
                      onClick={() => a.vr_url && window.open(a.vr_url, '_blank')}
                    />
                  )}
                  <div style={{ marginTop: 8, color: 'white', fontWeight: 500, fontSize: 16, textAlign: 'center' }}>{a.name}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </SlidePanel>
    </>
  );
};

export default Sidebar;

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
//   left: 50px;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,0); /* fully transparent */
  z-index: 10;
  display: flex;
  align-items: center;
  pointer-events: none; /* so it doesn't block interaction */
  box-shadow: inset 20px 20px 100px 20px rgb(0 0 0 / 82%), 0px 0px 60px rgba(0, 0, 0, 0.2);
  .sidebar-icons {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    pointer-events: all;
    margin-left: 20px;
  }
  .sidebar-icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    pointer-events: all;
    user-select: none;
    cursor: pointer;
    transition: color 0.2s;
  }
  .sidebar-icon-item svg {
    width: 40px;
    height: 40px;
    margin-bottom: 4px;
    display: block;
    transition: color 0.2s, filter 0.2s;
    color: inherit;
  }
  .sidebar-icon-item{
  color:#bdbdbd;
  }
  .sidebar-icon-item:hover,
  .sidebar-icon-item:focus {
    color: #ffb703; /* hover color */
  }
  .sidebar-icon-item.active {
    color: #bc5f00; /* active color */
  }
`;

const SlidePanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 600px;
  background: #1d1d1ddb;
  color: #fff;
  z-index: 2000;
  box-shadow: -4px 0 24px 0 rgba(0,0,0,0.25);
  transform: translateX(${props => (props.open ? '0' : '100%')});
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  .slide-panel-content {
    padding: 2rem 1.5rem;
    height: 100%;
    overflow-y: auto;
    position: relative;
  }
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: #fff;
    font-size: 2rem;
    cursor: pointer;
    z-index: 10;
  }
`;