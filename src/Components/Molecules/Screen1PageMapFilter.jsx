import React, { useEffect } from "react";
import { screen1PageMapFilters } from "../../Data";
import { useLandmark, useMapFilter } from "../../Hooks";

function Screen1PageMapFilter(props) {
  const { selectedLandmarkId, setSelectedLandmarkId } = useLandmark();

  const { setActiveMapFilterIds, isFilterActive, activeMapFilterIds } =
    useMapFilter();

  const isAllFiltersActive = () =>
    activeMapFilterIds.length == screen1PageMapFilters.length;

  const onShowAllClicked = () => {
    if (isAllFiltersActive()) {
      setActiveMapFilterIds([]);
    } else
      setActiveMapFilterIds([
        ...screen1PageMapFilters.map((filter) => filter.id),
      ]);
  };

  useEffect(() => {
    setActiveMapFilterIds(["map-filter-landmarks", "map-filter-highways"]);
    // setSelectedLandmarkId("rajiv_chowk");
  }, []);

  const handleFilterClick = (id) => {
    if (isFilterActive(id)) {
      if (id == "map-filter-landmarks" && selectedLandmarkId)
        setSelectedLandmarkId(false);
      // should be deactivated
      if (isAllFiltersActive()) {
        setActiveMapFilterIds([
          ...screen1PageMapFilters
            .map((filter) => filter.id)
            .filter((_id) => _id !== id),
        ]);
      } else setActiveMapFilterIds((old) => old.filter((_id) => _id !== id));
    } else {
      // if (activeMapFilterIds.length == landingPageMapFilters.length - 1)
      setActiveMapFilterIds((old) => [...old, id]);
    }
  };

  return (
    <>
      <div>
        <button
          class={`button button-show_all ${
            isAllFiltersActive() ? "active" : ""
          }`}
          value=""
          style={{ padding: "5px 8px" }}
          onClick={onShowAllClicked}
        >
          Show All
        </button>
        <div class="button-group">
          {screen1PageMapFilters.map((filter) => (
            <button
              class={`button ${
                isFilterActive(filter.id) ? "active" : ""
              } button-icon ${filter.className}`}
              value=""
              style={{ padding: "5px 8px" }}
              onClick={() => handleFilterClick(filter.id)}
            >
              {filter.title}
              <div class="icon">{filter.icon}</div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default Screen1PageMapFilter;
