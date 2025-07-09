import { createContext, useState } from "react";
import { screen1PageMapFilters, PAGES } from "../Data";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [activeMapFilterIds, setActiveMapFilterIds] = useState([]);
  const [flatFilterPriceValues, setFlatFilterPriceValues] = useState([]); // price range
  const [flatFilterSizeValues, setFlatFilterSizeValues] = useState([]); // size range

  const [selectedLandmarkId, setSelectedLandmarkId] = useState(null);
  const [blackout, setBlackout] = useState(false);
  const [user, setUser] = useState(null);
  const [inventories, setInventories] = useState(null);
  const [inventoriesList, setInventoriesList] = useState([]);
  const [bookings, setBookings] = useState(null);
  const [users, setUsers] = useState(null);

  return (
    <AppContext.Provider
      value={{
        inventoriesList,
        setInventoriesList,
        flatFilterPriceValues,
        flatFilterSizeValues,
        setFlatFilterPriceValues,
        setFlatFilterSizeValues,
        activeMapFilterIds,
        setActiveMapFilterIds,
        selectedLandmarkId,
        setSelectedLandmarkId,
        blackout,
        setBlackout,
        inventories,
        setInventories,
        bookings,
        setBookings,
        users,
        setUsers,
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
