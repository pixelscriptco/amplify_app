import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../Utility/axios"; // adjust path
import styled from "styled-components";

function ClientMap(props) {
  const { project } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { url } = useParams();
  const mapRef = useRef(null);
  const [infow, setinfow] = useState(false);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        let currentOrigin = window.location.origin;
        if (currentOrigin.includes("localhost")) {
          currentOrigin = "https://moon.proptour.live";
        }
        const response = await axiosInstance.get(
          `/app/user?url=${currentOrigin}`
        );
        // console.log(response.data);
        let projs = (response.data && response.data.projects) ? response.data.projects : [];
        setClients(projs); // API returns an array
        setLoading(false);
      } catch (err) {
        console.error("Error fetching client data:", err);
        setError("Failed to load client data");
        setLoading(false);
      }
    };
    fetchClientData();
  }, []);

  useEffect(() => {
    console.log(loading,clients)
    if (!loading && clients.length > 0) {
      const initMap = () => {
        const KERALA_BOUNDS = {
          north: 12.80,   // ~12°47'40" N
          south: 8.29,    // ~8°17'30" N
          west: 74.46,    // ~74°27'47" E
          east: 77.62     // ~77°37'12" E
        };
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 9.9659, lng: 76.2421 }, // Default India center
          zoom: 14,
          minZoom : 5,
          // gestureHandling: 'cooperative',
          maxZoom: 22,
          restriction: { latLngBounds: KERALA_BOUNDS }
        });

        const bounds = new window.google.maps.LatLngBounds();

        clients.forEach((client) => {
          const lat = parseFloat(client.latitude);
          const lng = parseFloat(client.longitude);

          if (!lat || !lng) return; // skip invalid coords
          // Circular marker with logo
          const customIcon = {
            url: "https://static.vecteezy.com/system/resources/previews/015/553/968/non_2x/resort-icon-free-vector.jpg",
            scaledSize: new window.google.maps.Size(50, 50),
          };

          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map,
            icon: customIcon,
            title: client.name,
          });

          // Info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div class="main_popover_wrap">
                 <div class="pos_relye">
                      <div>
                          <h4 class="cap_map">CUBIX RESIDENCES </h4>
                      </div>
                      <div class="infowrper">
                        <div class="img_wrapw_map">
                            <img class="img_blockqwe" height="auto" width="204" src=" https://fra1.digitaloceanspaces.com/evometa-backend-production/cubix.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=DO00G84QRB9ZBP6JJJZX%2F20250823%2Ffra1%2Fs3%2Faws4_request&X-Amz-Date=20250823T132501Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=0d3ac0f240135c442b6c2962761590bf259687265a5f5ded3ef61f294b82df9b" alt="">
                        </div>
                        <div>
                            <p class="par_textqw">Welcome to CUBIX Residences, an innovative development that mixes comfort with convenience. The building features a unique L shaped design that maximizes natural light, creating bright and inviting spaces throughout Experience life lived in refinement and substance.</p>
                        </div>
                      </div>
                      <div>
                          <div role="button" class="button_block">
                              Explore Projects
                          </div>
                      </div>
                  </div> 
              </div>`,
          });

          marker.addListener("click", () => {
            infoWindow.close();
            infoWindow.open(map, marker);
          });

          bounds.extend({ lat, lng });
        });

        map.fitBounds(bounds); // adjust map to show all markers

        window.google.maps.event.addListenerOnce(map, 'bounds_changed', function () {
          const maxZoom = 15; // Adjust the Zoom Level
          if (map.getZoom() > maxZoom) {
            map.setZoom(maxZoom);
          }
        });
      };

      if (!window.google) {
        const apiKey = "AIzaSyABTBMLtdgrZhfDYpv1skj1WS54pcQLfdY"; // replace with your key
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.onload = initMap;
        document.body.appendChild(script);
      } else {
        initMap();
      }
    }
  }, [loading, clients]);

  return (
    <Style id="client-page-map">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div>
          <div className="infobtnnn" onClick={() => setinfow(true)}>
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="info-circle"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
              <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" />
            </svg>
          </div>
          <div className="infoWindow" style={{
            display : (infow) ? 'block' : 'none'
          }}>
            <div className="qube-card">
              <span className="qube-close-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  onClick={() => setinfow(false)}
                >
                  <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.42L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z" />
                </svg>
              </span>
              <img src="https://propbuilding.s3.ap-south-1.amazonaws.com/location/1758824117267-507106187.jpg" alt="QUBE Development Logo" className="qube-logo" />
              <p className="qube-text">
                QUBE focus is delivering high-quality residential and commercial spaces,
                quick project completion, reliability, durability, and lasting value.
              </p>
              <p className="qube-text">
                <span className="qube-highlight">30-year</span> legacy of expertise
                <br />
                <span className="qube-highlight">15,000+</span> satisfied clients
                <br />
                <span className="qube-highlight">Prime locations:</span> JVC, Business
                Bay, Studio City, and Meydan
              </p>
            </div>
          </div>
          <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
        </div>
      )}
    </Style>
  );
}

export default ClientMap;



const Style = styled.main`
  height: 100vh;
  overflow: hidden;
  width: 100%;
  background-position: center;

  svg {
    height: 100%;
    width: 100%;
  }

  .navigator {
    position: absolute;
    top: 0rem;
    left: 0rem;
    margin: 2rem;
    width:97%;
  }

  .right-btn-group {
    margin: 1rem;
    .icon-btn {
      margin: 1rem;
    }
  }

  .compass-fullscreen-wrapper {
    padding: 1rem;
    padding-right: 2rem;
  }

  .loading, .error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.2rem;
    color: #333;
  }

  .error {
    color: #ff0000;
  }

  .tower-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .tower-header {
    margin-bottom: 8px;
  }

  .tower-title {
    display: flex;
    align-items: left;
    margin-bottom: 0;
  }

  .location-icon {
    margin-right: 8px;
  }

  .tower-stats {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .stat-box {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 12px;
    border-radius: 4px;
  }


`;
