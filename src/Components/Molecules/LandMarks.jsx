import React from "react";
import { useEffect } from "react";
import { useLandmark } from "../../Hooks";
import DrawLine from "../Atoms/DrawLine";
import LandMark from "../Atoms/LandMark";
import SVG from "../Atoms/SVG";

function LandMarks({ landmarks = [] }) {
  const { selectedLandmarkId, setSelectedLandmarkId } = useLandmark();

  useEffect(() => {
    // blackout setup
    const blackout = document.getElementById("blackout");
    if (!blackout) return;
    if (selectedLandmarkId) blackout.style.display = "block";
    else
      setTimeout(() => {
        blackout.style.display = "none";
      }, [400]);
  }, [selectedLandmarkId]);

  if (!landmarks.length > 0) return <g></g>;

  return (
    <g style={{ transition: "none" }}>
      <rect
        id="blackout"
        style={{ transition: "all 300ms linear" }}
        onClick={() => setSelectedLandmarkId(false)}
        width="1920"
        height="1080"
        fill="#282626"
        fill-opacity={selectedLandmarkId ? "0.59" : "0"}
      />
      {selectedLandmarkId && (
        <>
          {/* blackout */}
          {landmarks?.find((landMark) => landMark.id === selectedLandmarkId)
            ?.route && (
            <>
              <DrawLine
                path={
                  landmarks?.find(
                    (landMark) => landMark.id === selectedLandmarkId
                  )?.route
                }
                duration={1200}
              />
              <SVG
                renderer={
                  landmarks?.find(
                    (landMark) => landMark.id === selectedLandmarkId
                  )?.routeDetails.icon
                }
              />
            </>
          )}
        </>
      )}
      {landmarks?.map((landMark) => (
        <LandMark landmark={landMark.icon} id={landMark.id} />
      ))}
      {/* {landmarks?.length > 0 && selectedLandmarkId && (
        <LandMark
          landmark={
            landmarks.find((landMark) => landMark.id === selectedLandmarkId)
              .icon
          }
          id={selectedLandmarkId}
          route={
            landmarks.find((landMark) => landMark.id === selectedLandmarkId)
              .route
          }
        />
      )} */}
    </g>
  );
}

export default LandMarks;
