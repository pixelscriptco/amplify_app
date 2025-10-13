import React, { useState, useEffect} from "react";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useInventories } from "../Hooks";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import FloorSelector from "../Components/Molecules/FloorSelector";
import ApartmentsDetails from "../Components/Molecules/ApartmentsDetails";
import Compass from "../Components/Atoms/Compass";
import StaticIconButton from "../Components/Atoms/IconButton";
import { FullScreenIcon } from "../Icons";
import { getCombinedTowerName, toggleFullScreen } from "../Utility/function";
import Navigator from "../Components/Molecules/Navigator";
import Loading from "../Components/Atoms/Loading";
import ReturnToPrev from "../Components/Atoms/ReturnToPrev";
import { COMPASS_ANGLES } from "../Utility/Constants";
import axiosInstance from "../Utility/axios";
import Sidebar from '../Components/Sidebar';
import Err from "../Components/Atoms/Error";


function Unit() {
  const { project,floor, tower, unit:unit_str } = useParams();
  const { getAllFlatsInFloor } = useInventories();
  const navigate = useNavigate();
  const currentFloor = parseInt(floor);
  const currentTower = tower;
  const [selectedFloor, setSelectedFloor] = useState(currentFloor);
  const [selectedTower, setSelectedTower] = useState(currentTower);
  const flats = getAllFlatsInFloor(tower, floor);
  const [currentFlatIndex, setCurrentFlatIndex] = useState(
    flats.findIndex((flat) => flat["FlatNumber"] == unit_str)
  );
  const [error, setError] = useState(null);
  const [unitData, setUnitData] = useState({
    id: 0,
    name: '',
    status:1,
    area:0,
    type:'',
    cost:'',
    image_url: '',
    paths: [],
    balcony_images: [],
  });

  const { fetchInventories } = useInventories();

  const [loading, setLoading] = useState(false);

  const [showPaymentsPopup, setShowPaymentsPopup] = useState(false);
  const [showVRTour, setShowVRTour] = useState(false);
  const [selectedBalconyImage, setSelectedBalconyImage] = useState(null);

  useEffect(() => {
    const fetchFloorSvg = async () => {
      try {        
        setLoading(true);
        const response = await axiosInstance.get(`/app/unit/${project}/${tower}/${floor}/${unit_str}`);

        const { id, name,status } = response.data;
        const {plan,area,type,cost,svg_url,balcony_images} = response.data.unit_plans;
        
        let paths = [];
        
        // Fetch and parse SVG if svg_url is available
        if (svg_url) {
          try {
            const svgResp = await fetch(svg_url);
            const svgText = await svgResp.text();
            
            // Parse the SVG text and extract <path> elements
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
            
            paths = Array.from(svgDoc.querySelectorAll("path"));
          } catch (svgError) {
            console.error('Error fetching SVG:', svgError);
            // Continue without SVG paths if SVG fetch fails
          }
        }

        setUnitData({
          id,
          name,
          status,
          area,
          type,
          cost,
          image_url:plan,
          paths,
          balcony_images: balcony_images || []
        })

        setLoading(false);  
      }catch(err){
        console.error('Error fetching floor SVG:', err);
        setError('Failed to load floor visualization');
      } finally {
        setLoading(false);
      }
    }

    fetchFloorSvg();
  }, [project, tower,floor]);

  // Reset modal state when component unmounts or route changes
  useEffect(() => {
    return () => {
      setSelectedBalconyImage(null);
    };
  }, [project, tower, floor, unit_str]);

  // Clear modal if selectedBalconyImage becomes invalid
  useEffect(() => {
    if (selectedBalconyImage && !selectedBalconyImage.image_url) {
      setSelectedBalconyImage(null);
    }
  }, [selectedBalconyImage]);

  const handlePathClick = (pathId) => {
    console.log('Path clicked:', pathId);
    console.log('Available balcony images:', unitData.balcony_images);
    
    // Find balcony image by name matching the path ID
    const balconyImage = unitData.balcony_images.find(img => 
      img.name === pathId && img.image_url
    );
    
    console.log('Found balcony image:', balconyImage);
    
    if (balconyImage) {
      setSelectedBalconyImage(balconyImage);
    } else {
      console.log('No matching balcony image found for path:', pathId);
      toast.info('No image available for this area');
    }
  };

  const closeImageModal = () => {
    setSelectedBalconyImage(null);
  };

  const handleBooking = async (flatId, userDetails) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/app/unit/${project}/book`, userDetails);
      
      if (response.data.success) {
        console.log('success');
        
        toast.success('Booking request submitted successfully!');
      }
    } catch (err) {
      console.error('Error submitting booking:', err);
      // toast.error(err.response?.data?.message || 'Failed to submit booking request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CarouselPageStyle>
      {loading && <Loading />}

      <Navigator
        className="navigator"
        prevPages={[
          {
            title: `${project.toUpperCase()}`,
            path: `/${project}`,
          },
          {
            title: `${tower}`,
            path: `/${project}/tower/${tower}`,
          },
          {
            title: `Floor ${floor}`,
            path: `/${project}/tower/${tower}/floor/${floor}`,
          },
        ]}
        currentPage={{
          title: `${unit_str}`,
          path: `/${project}/tower/${tower}/floor/${floor}/apartment/${unit_str}`,
        }}
      />

      {/*<Sidebar />*/}
      <ReturnToPrev
        text="Return To Floor Plan"
        to={`${project}/tower/${tower}/floor/${floor}`}
      />
      {/* <div className="floor-selector">
        <FloorSelector
          currentFloor={currentFloor}
          selectedFloor={selectedFloor}
          setSelectedFloor={setSelectedFloor}
          currentTower={currentTower}
          selectedTower={selectedTower}
          setSelectedTower={setSelectedTower}
        />
      </div> */}
      <div className="compass-fullscreen-wrapper absolute bottom left flex row">
        <div className="col flex j-end">
          <Compass
            angle={COMPASS_ANGLES.TOWERS[getCombinedTowerName(tower)] - 25}
          />
        </div>
        <div className="col w-space flex j-end">
          <StaticIconButton
            icon={FullScreenIcon}
            tooltip="Fullscreen"
            activeTooltip="Close Fullscreen"
            onClick={() => toggleFullScreen()}
          />
        </div>
      </div>
      {unitData.image_url && (<ApartmentsDetails
        onVRClick={() => {
          // setShowVRTour(true)
          // navigate("VR-tour");
          window.open(window.location.href + '/VR-tour', '_blank');
        }}
        selectedUnit={unitData}
        handleBooking={handleBooking}
      />)}
      
      <FlatStyle className="no-select">
        <div
          style={{
            width: "100vw",
          }}
          className="img-wrapper untt"
        >
          {/* <div className="flat-number">{flatNumber}</div> */}
        {
          unitData.image_url ? (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img src={unitData.image_url} />
              {unitData.paths && unitData.paths.length > 0 && (
                <svg
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'auto'
                  }}
                  preserveAspectRatio="xMidYMid slice"
                  viewBox="0 0 1086 615"
                  fill="none"
                >
                  {unitData.paths.map((pathEl, index) => {
                    const id = pathEl.getAttribute("id") || `path-${index}`;
                    const d = pathEl.getAttribute("d");
                    const fill = pathEl.getAttribute("fill") || "#69F153";
                    const fillOpacity = "0.3";
                    const stroke = "rgba(0, 0, 0, 0.4)";
                    const strokeWidth = "0.1";
                    const className = pathEl.getAttribute("class") || "Available";

                    return (
                      <path
                        key={id}
                        id={id}
                        d={d || ""}
                        fill={fill}
                        fillOpacity={fillOpacity}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        className={className}
                        style={{
                          transition: "fill-opacity 0.3s ease",
                          cursor: "pointer",
                        }}
                        onClick={() => handlePathClick(id)}
                      />
                    );
                  })}
                </svg>
              )}
            </div>
          ) : (
            <Err msg="Couldn't find unit details" type='found' />
          )
        }
        
        </div>
      </FlatStyle>

      {/* Balcony Image Modal */}
      {selectedBalconyImage && selectedBalconyImage.image_url && (
        <div 
          key={selectedBalconyImage?.image_url || 'modal'}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
          onClick={closeImageModal}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              cursor: 'default'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
              onClick={closeImageModal}
            >
              ×
            </button>
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>
              {selectedBalconyImage.name}
            </h3>
            <img 
              key={selectedBalconyImage.image_url}
              src={selectedBalconyImage.image_url} 
              alt={selectedBalconyImage.name}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      )}
    </CarouselPageStyle>
  );
}

export default Unit;

const CarouselPageStyle = styled.section`
  background: rgb(48, 41, 32);
  background: linear-gradient(
    68deg,
    rgba(48, 41, 32, 1) 0%,
    rgba(124, 111, 91, 1) 15%,
    rgba(138, 124, 102, 1) 25%,
    rgba(134, 121, 99, 1) 32%,
    rgba(121, 109, 90, 1) 45%,
    rgba(92, 86, 74, 1) 100%
  );
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;

  .navigator {
    position: absolute;
    top: 0rem;
    left: 0rem;
    margin: 2rem;
    width:97%;
  }
  .compass-fullscreen-wrapper {
    padding: 1rem;
    padding-right: 2rem;
  }

  .floor-selector {
    position: absolute;
    top: 7rem;
    left: 2rem;
    /* right: 100%; */
  }
`;

const FlatStyle = styled.section`
  height: 100vh;
  width: 100%;
  /* margin-left: 8rem;
  margin-top: 2rem;
  */
  .flat-number {
    font-family: "Roboto", sans-serif;
    background-color: var(--panel_background);
    color: var(--color_text);
    width: fit-content;
    margin: auto;
    padding: 0.3rem 1rem;
    font-weight: 600;
    border-radius: 10px;
    font-size: 1.2rem;
    position: absolute;
    top: 0;
  }
  .img-wrapper {
    /* padding-top: 2rem; */
    transition: all 500ms;
    height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 6rem;
    padding-left: 20%;

    img {
      border-radius: 10px;
      width: auto;
      height: 85%;
      object-fit: contain;
    }
  }
  @media screen and (max-height: 480px) {
    .flat-number {
      font-size: 1rem;
    }
  }
`;
