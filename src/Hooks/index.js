import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../Contexts/AppContext";
import { PAGES, UNIT_STATUS, USER_TYPES } from "../Data";
import api from '../config/api';
import axiosInstance from  "../Utility/axios";

export const useMapFilter = () => {
  const { activeMapFilterIds, setActiveMapFilterIds } = useContext(AppContext);

  const isFilterActive = (id) => activeMapFilterIds.includes(id);

  return {
    activeMapFilterIds,
    setActiveMapFilterIds,
    isFilterActive,
  };
};

export const useLandmark = () => {
  // used to select a landmark from landing page
  const { selectedLandmarkId, setSelectedLandmarkId } = useContext(AppContext);
  const { activeMapFilterIds } = useMapFilter();
  useEffect(() => {
    if (!activeMapFilterIds.includes("map-filter-landmarks")) {
      setSelectedLandmarkId(null);
    }
  }, [activeMapFilterIds]);

  return {
    selectedLandmarkId,
    setSelectedLandmarkId,
  };
};

export const useBlackout = () => {
  const { blackout, setBlackout } = useContext(AppContext);

  return {
    blackout,
    setBlackout,
  };
};

export const useInventories = () => {
  const { inventories, setInventories, inventoriesList, setInventoriesList } =
    useContext(AppContext);

  const updateInventory = async (id, property, property_value) => {
    try {
      await api.patch(`/inventories/${id}`, {
        [property]: property_value
      });
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  };

  const fetchInventories = async (setLoading = () => {}) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/app/inventories');
      setInventories(response.data);
    } catch (error) {
      console.error('Error fetching inventories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!inventories) return;
    const inventoryArrays = [];
    Object.keys(inventories).forEach((flat_id) => {
      if (inventories[flat_id].id)
        inventoryArrays.push({
          ...inventories[flat_id],
        });
    });
    setInventoriesList(inventoryArrays);
  }, [inventories]);

  const getAllUnitsInFloor = (towerName, floorNumber) => {
    if (!inventories) {
      return;
    }

    return getAllUnitsInTower(towerName)
      .filter(
        (unit) =>
          (floorNumber === "G" && unit["FloorNumber"] === "G") ||
          unit["FloorNumber"] === parseInt(floorNumber)
      )
      .sort(
        (a, b) =>
          a["FlatNumber"] == "G" ||
          b["FlatNumber"] == "G" ||
          a["FlatNumber"].substring(2, a["FlatNumber"].length) -
            b["FlatNumber"].substring(2, b["FlatNumber"].length)
      );
  };

  const getMinMaxTotalCostInTower = (towerName) => {
    const units = getAllUnitsInTower(towerName);
    const totalCosts = units.map((unit) => unit["TotalCost"]);
    const minTotalCost = Math.min(...totalCosts);
    const maxTotalCost = Math.max(...totalCosts);
    return [minTotalCost, maxTotalCost];
  };

  const getMinMaxTotalCostInFloor = (towerName, floorNumber) => {
    const units = getAllUnitsInFloor(towerName, floorNumber);
    const totalCosts = units.map((unit) => unit["TotalCost"]);
    const minTotalCost = Math.min(...totalCosts);
    const maxTotalCost = Math.max(...totalCosts);
    return [minTotalCost, maxTotalCost];
  };

  const getMinMaxSBUInTower = (towerName) => {
    const units = getAllUnitsInTower(towerName);
    const sbus = units.map((unit) => unit["SBU"]);
    const minSBU = Math.min(...sbus);
    const maxSBU = Math.max(...sbus);
    return [minSBU, maxSBU];
  };

  const getMinMaxSBUInFloor = (towerName, floorNumber) => {
    const units = getAllFlatsInFloor(towerName, floorNumber);
    const sbus = units.map((unit) => unit["SBU"]);
    const minSBU = Math.min(...sbus);
    const maxSBU = Math.max(...sbus);
    return [minSBU, maxSBU];
  };

  const getAllAvailableUnitsInFloor = (towerName, floorNumber) => {
    return getAllUnitsInFloor(towerName, floorNumber).filter(
      (flat) => flat["Status"] === UNIT_STATUS.AVAILABLE
    );
  };

  const getAllUnitStatusInFloor = (towerName, floorNumber) => {
    return getAllUnitsInFloor(towerName, floorNumber).map(
      (flat) => flat["Status"]
    );
  };

  const getAllAvailableUnitsInTower = (towerName) =>
    getAllUnitsInTower(towerName).filter(
      (flat) => flat["Status"] === UNIT_STATUS.AVAILABLE
    );

  const getAllBookedUnitsInTower = (towerName) =>
    getAllUnitsInTower(towerName).filter(
      (flat) => flat["Status"] === UNIT_STATUS.BOOKED
    );

  // returns list of all flats in tower
  const getAllUnitsInTower = (towerName) =>
    inventoriesList.filter(
      (inventory) => inventory["TowerName"] === towerName.toUpperCase()
    );

  const getAllFloorsInTower = (towerName) => [
    ...new Set(
      getAllUnitsInTower(towerName)
        .map((flat) => flat["FloorNumber"])
        .sort((a, b) => a == "G" || b == "G" || parseInt(a) - parseInt(b))
    ),
  ];

  const getAllUnitTypesInTower = (towerName) => [
    ...new Set(
      getAllUnitsInTower(towerName)
        .map((unit) => unit["UnitType"])
        .sort((a, b) => parseInt(a) - parseInt(b))
    ),
  ];

  const getAllFlatsInFloor = (towerName, floorNumber) =>    
    getAllUnitsInTower(towerName.toUpperCase())
      .filter((inventory) => inventory["TowerName"] === towerName.toUpperCase())
      .filter((inventory) => inventory["FloorNumber"] === parseInt(floorNumber))
      .sort((a, b) => a["FlatNumber"] - b["FlatNumber"]);

  return {
    inventories,
    setInventories,
    inventoriesList,
    fetchInventories,
    updateInventory,
    getAllFloorsInTower,
    getAllUnitsInTower,
    getAllUnitsInFloor,
    getAllAvailableUnitsInFloor,
    getAllAvailableUnitsInTower,
    getAllBookedUnitsInTower,
    getAllFlatsInFloor,
    getMinMaxTotalCostInFloor,
    getMinMaxSBUInFloor,
    getAllUnitTypesInTower,
    getAllUnitStatusInFloor,
    getMinMaxSBUInTower,
    getMinMaxTotalCostInTower,
  };
};

export const useAuth = () => {
  const { user, setUser } = useContext(AppContext);

  return { user, setUser };
};
