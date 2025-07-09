import React, { useEffect, useState } from "react";
import { useNavigate,useParams } from 'react-router-dom';
import styled from "styled-components";
import axiosInstance from '../../Utility/axios';
import { arrowUp, view_360 } from "../../Data/images/AmenitiesSvgs";

function Amenities() {
  const { project,tower } = useParams();
  const [loading, setLoading] = useState(true);
  const [amenities, setAmenities] = useState([
    {
      id: 0,
      image: '',
      vr_url: ''
    }
  ]);
  const [amenitiesPopupOpen, setAmenitiesPopupOpen] = useState(false);

  useEffect(() => {
    const fetchBuildingData = async () => {
      if (!project || !tower) return;
      
      try {
        const response = await axiosInstance.get(`/app/amenities/${project}/${tower}`);
        
        if (Array.isArray(response.data)) {
          setAmenities(response.data);
        }
        setLoading(false);        

      } catch (err) {
        console.error("Error fetching building data:", err);
      }
    };

    fetchBuildingData();
  }, [project,tower]);

  return (
    <Style>
      <div className="col flex j-end svelte-9mhvmf">
        <div className="amenities">
          <div
            className={`amenities__button ${amenitiesPopupOpen ? "active" : ""}`}
            onClick={() => setAmenitiesPopupOpen((old) => !old)}
          >
            {arrowUp}
            <span className="amenities__button--text">Amenities</span>
          </div>
          {
            <div
            className={`amenities__popup slide-up ${
                amenitiesPopupOpen ? " active" : ""
              }`}
            >
              {amenities.map((amenity, id) => {
                return (
                  <a href={amenity.vr_url}>
                    <div key={id} className="amenities__popup--item">
                      <div className="amenities__popup--item-image">
                        <img src={amenity.image} alt="" />
                      </div>{" "}
                      <span className="item--name">{amenity.name}</span>{" "}
                      <div className="item--shadow"></div>{" "}
                      <div className="item--smoothBorder"></div>{" "}
                      <div className="item--floor">VR Tour</div>{" "}
                      <div className="item--helper">{view_360}</div>{" "}
                    </div>
                  </a>
                );
              })}
            </div>
          }
        </div>
      </div>
    </Style>
  );
}

export default Amenities;

const Style = styled.div`
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  user-select: none;
  -webkit-user-drag: none;

  .flex.j-end.svelte-9mhvmf.svelte-9mhvmf {
    justify-content: flex-end;
  }
  .col.svelte-9mhvmf.svelte-9mhvmf {
    flex-direction: column;
  }
  .flex.svelte-9mhvmf.svelte-9mhvmf {
    display: flex;
  }
  .amenities {
    -webkit-margin-end: 20px;
    margin-inline-end: 20px;
    pointer-events: none;
    position: relative;
    cursor: pointer;
    z-index: 1;
  }
  .amenities__button:hover:not(.mobile) {
    background: #dadada;
    color: #232323;
  }

  .amenities__button.active {
    background-color: var(--background_panel);
    color: #e9e8e8;
  }
  .amenities__button {
    pointer-events: all;
    background-color: var(--background_panel);
    color: var(--color_text);
    border-radius: 50px;
    max-width: 116px;
    z-index: 2;
    padding: 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: var(--transition);
  }

  .amenities__button.active svg {
    transform: scaleY(-1);
  }

  .amenities__button svg {
    width: 16px;
    height: 16px;
    transition: var(--transition);
  }
  .amenities__button:hover:not(.mobile) svg path {
    stroke: #232323;
  }

  .amenities__button.active svg path {
    color: #e9e8e8;
  }
  .amenities__button--text {
    -webkit-margin-start: 10px;
    margin-inline-start: 10px;
    font-size: 14px;
    font-weight: 500;
  }
  @media (min-width: 768px) and (max-width: 1279px) {
    .amenities__popup {
      max-height: calc(calc(100vh - 130px - 90px));
    }
  }

  /* Works on Firefox */
  .amenities__popup {
    scrollbar-width: thin;
    scrollbar-color: var(--secondary_bg) var(--secondary_bg);
  }

  /* Works on Chrome, Edge, and Safari */
  .amenities__popup::-webkit-scrollbar {
    width: 2px;
  }

  .amenities__popup::-webkit-scrollbar-track {
    background: var(--secondary_bg);
  }

  .amenities__popup::-webkit-scrollbar-thumb {
    background-color: var(--secondary_bg);
    border-radius: 20px;
    border: 0px solid var(--secondary_bg);
  }

  .amenities__popup {
    position: absolute;
    right: 0px;
    bottom: 82px;
    z-index: -1;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 0;
    pointer-events: all;
    margin-right: -10px;
    padding-right: 10px;
    transition: var(--transition);
    transition: all 0.4s ease-in-out;
  }

  .amenities__popup.active {
    max-height: 350px;
  }

  .amenities__popup--item-image {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
  .amenities__popup--item .item--name {
    position: absolute;
    bottom: 15px;
    left: 10px;
    color: white;
    z-index: 2;
    font-size: 13px;
    font-weight: 700;
    line-height: 15px;
    transition: opacity var(--transition);
  }
  .amenities__popup--item .item--shadow {
    background: linear-gradient(
      0deg,
      #000000 17.38%,
      rgba(0, 0, 0, 0.44) 30.18%,
      rgba(0, 0, 0, 0) 42.3%
    );
    position: absolute;
    top: 26px;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 40%;
    border-radius: 8px;
  }
  .amenities__popup--item .item--smoothBorder {
    position: absolute;
    top: 10px;
    bottom: 0;
    left: 0;
    right: 0;
    box-shadow: inset 0 0 0px 2px rgb(0 0 0 / 20%);
    border-radius: 8px;
  }
  .amenities__popup--item .item--helper {
    position: absolute;
    opacity: 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(12, 12, 12, 0.5);
    transition: var(--transition);
    box-shadow: inset 0 0 0px 2px white;
    border-radius: 8px;
    :hover {
      opacity: 1;
    }
  }
  .amenities__popup--item .item--helper svg {
    width: 60px;
    height: 61px;
  }

  svg {
    width: 100%;
    height: 100%;
  }
  .amenities__popup--item-image {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
  .amenities__popup--item .item--name {
    position: absolute;
    bottom: 15px;
    left: 10px;
    color: white;
    z-index: 2;
    font-size: 13px;
    font-weight: 700;
    line-height: 15px;
    transition: opacity var(--transition);
  }

  .amenities__popup--item-image img {
    -o-object-fit: cover;
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }

  .amenities__popup--item .item--shadow {
    background: linear-gradient(
      0deg,
      #000000 17.38%,
      rgba(0, 0, 0, 0.44) 30.18%,
      rgba(0, 0, 0, 0) 42.3%
    );
    position: absolute;
    top: 26px;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 40%;
    border-radius: 8px;
  }
  .amenities__popup--item .item--smoothBorder {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    box-shadow: inset 0 0 0px 2px rgb(0 0 0 / 20%);
    border-radius: 8px;
  }
  .amenities__popup--item .item--floor {
    position: absolute;
    top: 0%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 5px 15px;
    background: #fff;
    border-radius: 86px;
    font-size: 13px;
    font-weight: 500;
    z-index: 3;
    opacity: 0;
    pointer-events: none;
    transition: var(--transition);
    white-space: nowrap;
  }
  .amenities__popup--item {
    cursor: pointer;
    pointer-events: all;
    width: 170px;
    height: 100px;
    border-radius: 8px;
    position: relative;
    margin-top: 15px;
    :hover {
      .item--floor {
        position: absolute;
        top: 0%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 5px 15px;
        background: #fff;
        border-radius: 86px;
        font-size: 13px;
        font-weight: 500;
        z-index: 2;
        opacity: 1;
        pointer-events: none;
        transition: var(--transition);
        white-space: nowrap;
      }
    }
  }
`;
