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
          zoom: 5,
        });

        const bounds = new window.google.maps.LatLngBounds();

        clients.forEach((client) => {
          const lat = parseFloat(client.latitude);
          const lng = parseFloat(client.longitude);

          if (!lat || !lng) return; // skip invalid coords

          // Circular marker with logo
          const customIcon = {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
                  <defs>
                    <clipPath id="circleView">
                      <circle cx="30" cy="30" r="28"/>
                    </clipPath>
                  </defs>
                  <image src="https://pickyassist.com/app/signup/img/slider1/logo.png" width="60" height="60" clip-path="url(#circleView)"/>
                  <circle cx="30" cy="30" r="28" stroke="white" stroke-width="2" fill="none"/>
                </svg>
              `),
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
            content: `<div><strong>${client.name}</strong><br/>${client.location}</div>`,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });

          bounds.extend({ lat, lng });
        });

        map.fitBounds(bounds); // adjust map to show all markers
      };

      if (!window.google) {
        const apiKey = "AIzaSyCgpHQrnEkIiNim-q5DfjhA4WfiCVBebk4"; // replace with your key
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
    <Style id="client-page">
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
