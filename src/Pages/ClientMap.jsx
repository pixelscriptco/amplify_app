import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../Utility/axios";

function ClientMap(props) {
  const { project } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { url } = useParams();
  const [clientData, setClientData] = useState({
    id: 0,
    name: "",
    url: "",
    location: "",
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const fetchClientData = async () => {
        try {
            
            const currentOrigin = window.location.origin; 
            const response = await axiosInstance.get(`/app/user?url=${currentOrigin}`);
            const { id, name, url: clientUrl, location, latitude, longitude } = response.data;
            setClientData({
                id,
                name,
                url: clientUrl,
                location,
                latitude,
                longitude,
            });
            setLoading(false);
        } catch (err) {
            console.error("Error fetching client data:", err);
            setError("Failed to load client data");
            setLoading(false);
        }
    };    
    fetchClientData();
  }, []);

  return (
    <Style id="client-page">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>

        </>
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
