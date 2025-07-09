import React, { useEffect } from "react";
import { screen2PageMapFilters, screen1PageMapFilters } from "../../Data";
import { useLandmark, useMapFilter } from "../../Hooks";

function Screen2PageMapFilter(props) {
  const { setActiveMapFilterIds, isFilterActive, activeMapFilterIds } =
    useMapFilter();

  const isAllFiltersActive = () =>
    activeMapFilterIds.length == screen2PageMapFilters.length;

  const onShowAllClicked = () => {
    if (isAllFiltersActive()) {
      setActiveMapFilterIds([]);
    } else
      setActiveMapFilterIds([
        ...screen2PageMapFilters.map((filter) => filter.id),
      ]);
  };

  const handleFilterClick = (id) => {
    if (isFilterActive(id)) {
      // should be deactivated
      if (isAllFiltersActive()) {
        setActiveMapFilterIds([
          ...screen2PageMapFilters
            .map((filter) => filter.id)
            .filter((_id) => _id !== id),
        ]);
      } else setActiveMapFilterIds((old) => old.filter((_id) => _id !== id));
    } else {
      // if (activeMapFilterIds.length == hartlnadPageMapFilters.length - 1)
      setActiveMapFilterIds((old) => [...old, id]);
    }
  };

  useEffect(() => {
    setActiveMapFilterIds(["map-filter-landmarks", "map-filter-highways"]);
  }, []);

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
          {screen2PageMapFilters.map((filter) => (
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

export default Screen2PageMapFilter;
