import "./App.css";
import Router from "./Router";
import "./css/Attributes.css";
import "./css/index.css";
import "./css/Global.css";
import "tippy.js/dist/tippy.css";
import { AppContextProvider } from "./Contexts/AppContext";
import Blackout from "./Components/Atoms/Blackout";
import { useEffect, useState } from "react";
import { getDateFromTimestamp, jsonToFormalObject } from "./Utility/function";
import RotateInstruction from "./Components/Atoms/RotateInstruction";
import HoverInfo from "./Components/Molecules/HoverInfo";
import FullScreenModeAlert from "./Components/Atoms/FullScreenModeAlert";

function App() {
  return (
    <AppContextProvider>
      <FullScreenModeAlert /> 
      <RotateInstruction />     
      <Router />
      <Blackout />
    </AppContextProvider>
  );
}

export default App;