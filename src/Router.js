import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Loading from "./Components/Atoms/Loading";
// import Navigator from "./Components/Molecules/Navigator";
// import AdminOnlyPage from "./Components/Molecules/AdminOnlyPage";
// import { useInventories } from "./Hooks";
// import Apartment from "./Pages/Apartment";
// import Inventories from "./Pages/Inventories";
import Floor from "./Pages/Floor";
// import DwarkaExpresswayMap from "./Pages/DwarkaExpresswayMap";
import Tower from "./Pages/Tower";
// import { useBookings } from "./Hooks/booking";
// import Bookings from "./Pages/Bookings";
// import Users from "./Pages/Users";
import Unit from "./Pages/Unit";
import VRTour from "./Pages/VRTour";
// import PaymentSuccess from "./Pages/PaymentSuccess";
// import DelhiMap from "./Pages/DelhiMap";
import Building from "./Pages/Building";
// import IndiaMap from "./Pages/IndiaMap";
import Loader from "./Components/Atoms/Loader";
// import RotateTower from "./Pages/RotateTower";
import IntroVideoPage from "./Pages/IntroVideoPage";


function Router(props) {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route
          path="/"
          element={
            <UserOnlyPage>
              <IntroVideoPage />
            </UserOnlyPage>
          }
        /> */}
        <Route
          path="/:project"
          element={
              <Building />
          }
        />
        <Route
          path="/:project/tower/:tower"
          element={
              <Tower />
          }
        />
        <Route
          path="/:project/tower/:tower/floor/:floor"
          element={
              <Floor />
          }
        />
        <Route
          path="/:project/tower/:tower/floor/:floor/unit/:unit"
          element={
              <Unit />
          }
        />
        <Route
          path="/:project/tower/:tower/floor/:floor/unit/:unit/VR-tour"
          element={
              <VRTour />
          }
        />
      </Routes>
    </BrowserRouter>
  // ) 
  // : (
  //   <BrowserRouter>
  //     <Loader />
  //   </BrowserRouter>
  );
}

export default Router;
