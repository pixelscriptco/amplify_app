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
        const currentOrigin = window.location.origin;
        const response = await axiosInstance.get(`/app/user?url=${currentOrigin}`);
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
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 20.5937, lng: 78.9629 }, // Default India center
          zoom: 2,
        });

        const bounds = new window.google.maps.LatLngBounds();

        clients.forEach((client) => {
          const lat = parseFloat(client.latitude);
          const lng = parseFloat(client.longitude);

          if (!lat || !lng) return; // skip invalid coords

          let base64_img = 'data:image/png;base64,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';

          // Circular marker with logo
          const customIcon = {
  url: 'https://static.vecteezy.com/system/resources/previews/015/553/968/non_2x/resort-icon-free-vector.jpg',
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
                      <div class="img_wrapw_map">
                          <img class="img_blockqwe" height="auto" width="204" src=" https://fra1.digitaloceanspaces.com/evometa-backend-production/cubix.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=DO00G84QRB9ZBP6JJJZX%2F20250823%2Ffra1%2Fs3%2Faws4_request&X-Amz-Date=20250823T132501Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=0d3ac0f240135c442b6c2962761590bf259687265a5f5ded3ef61f294b82df9b" alt="">
                      </div>
                      <div>
                          <p class="par_textqw">Welcome to CUBIX Residences, an innovative development that mixes comfort with convenience. The building features a unique L shaped design that maximizes natural light, creating bright and inviting spaces throughout Experience life lived in refinement and substance.</p>
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
          <div
            ref={mapRef}
            style={{ width: "100%", height: "100vh" }}
          />
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
