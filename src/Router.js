import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Floor from "./Pages/Floor";
import ClientMap from "./Pages/ClientMap";
import Tower from "./Pages/Tower";
import Unit from "./Pages/Unit";
import VRTour from "./Pages/VRTour";
import Building from "./Pages/Building";

function Router(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
              <ClientMap />
          }
        />
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
  );
}

export default Router;
