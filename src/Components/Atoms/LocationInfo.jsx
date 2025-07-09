import React from "react";
import styled from "styled-components";
import { useLandmark } from "../../Hooks";

function LocationInfo({ className, landmarks_with_routes }) {
  const { selectedLandmarkId } = useLandmark();

  const { landmark_name, details, img } =
    landmarks_with_routes?.[selectedLandmarkId]?.routeDetails || {};
  return selectedLandmarkId ? (
    <Style className={className + " overlay-can-hide"}>
      <div class="image svelte-1v2lona">
        <img
          src={`${process.env.PUBLIC_URL}/landmarks/${selectedLandmarkId}.jpg`}
          alt="Burj Khalifa"
          class="svelte-1v2lona"
        />{" "}
      </div>{" "}
      <div class="content svelte-1v2lona">
        <div class="title svelte-1v2lona">{landmark_name}</div>{" "}
        <div class="description">{details}</div>
      </div>
    </Style>
  ) : (
    <></>
  );
}

export default LocationInfo;

const Style = styled.div`
  border: 1px solid #fff;
  display: flex;
  justify-content: center;
  max-width: 500px;
  min-height: 108px;
  background: var(--background_panel);
  border-radius: var(--radius_panel);
  overflow: hidden;
  align-self: start;
  .image.svelte-1v2lona.svelte-1v2lona {
    max-width: 170px;
    min-width: 170px;
    position: relative;
  }
  img.svelte-1v2lona.svelte-1v2lona {
    display: block;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    width: 100%;
  }

  .content.svelte-1v2lona.svelte-1v2lona {
    color: var(--interface_location_info_color);
    font-size: 13px;
    padding: 10px 15px;
  }

  .title.svelte-1v2lona.svelte-1v2lona {
    color: var(--interface_location_info_title_color);
    font-weight: 500;
    font-size: 15px;
    margin-bottom: 6px;
  }
`;
