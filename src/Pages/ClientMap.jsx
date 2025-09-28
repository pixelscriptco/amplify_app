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
        console.log(response.data);
        setClients(response.data); // API returns an array
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
    if (!loading && clients.length > 0) {
      const initMap = () => {
        const KERALA_BOUNDS = {
          north: 12.80,   // ~12°47'40" N
          south: 8.29,    // ~8°17'30" N
          west: 74.46,    // ~74°27'47" E
          east: 77.62     // ~77°37'12" E
        };
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 20.5937, lng: 78.9629 }, // Default India center
          zoom: 7,
          minZoom : 5,
          // gestureHandling: 'cooperative',
          restriction: { latLngBounds: KERALA_BOUNDS, strictBounds: true }
        });

        const bounds = new window.google.maps.LatLngBounds();

        clients.forEach((client) => {
          const lat = parseFloat(client.latitude);
          const lng = parseFloat(client.longitude);

          if (!lat || !lng) return; // skip invalid coords
          // Circular marker with logo
          const customIcon = {
  url: client.logo,
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
                          <h4 class="cap_map">${client.title || 'Location'} </h4>
                      </div>
                      <div class="img_wrapw_map">
                          <img class="img_blockqwe" height="auto" width="204" src="${client.location_image}" alt="">
                      </div>
                      <div>
                          <p class="par_textqw">${client.location_description || 'No description available'}</p>
                      </div>
                      <div>
                          <button class="button_block" onclick="window.open('${client.url}', '_blank')">
                              Explore Project
                          </button>
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
