export function toggleFullScreen(elem = document.body) {
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (
      (document.fullScreenElement !== undefined &&
        document.fullScreenElement === null) ||
      (document.msFullscreenElement !== undefined &&
        document.msFullscreenElement === null) ||
      (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
      (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)
    ) {
      if (elem.requestFullScreen) {
        elem.requestFullScreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }
  
  export const toogleHideOverlays = (showOverlays) => {
    const eles_to_hide = document.getElementsByClassName("overlay-can-hide");
    const eles_to_fade_out = document.getElementsByClassName(
      "overlay-can-fade-out"
    );
    if (!showOverlays) {
      for (let i = 0; i < eles_to_hide.length; i++) {
        const el = eles_to_hide[i];
        el.style.opacity = "0";
      }
      for (let i = 0; i < eles_to_fade_out.length; i++) {
        const el = eles_to_fade_out[i];
        el.style.opacity = "0.1";
      }
    } else {
      for (let i = 0; i < eles_to_hide.length; i++) {
        const el = eles_to_hide[i];
        el.style.opacity = "1";
      }
      for (let i = 0; i < eles_to_fade_out.length; i++) {
        const el = eles_to_fade_out[i];
        el.style.opacity = "1";
      }
    }
  };
  
  export const getFormalNameFromNumber = (num) => {
    if (num === -1) return "Upper basement";
    if (num === "G") return "Ground";
    if (num === "1" || num === 1) return "1st";
    if (num === "2" || num === 2) return "2nd";
    if (num === "3" || num === 3) return "3rd";
    else return `${num}th`;
  };
  
  export const jsonToFormalObject = (data) => {
    const getAllFlatsInTower = (tower) =>
      data.filter((flat) => flat["Tower Name"] === tower);
    const Towers = ["A", "B", "C"];
    const json = {};
    json.inventories = {};
    Towers.forEach((tower) => {
      json.inventories[tower] = {};
      getAllFlatsInTower(tower).forEach((flat) => {
        const flat_num =
          typeof flat["Flat Number"] == "string" &&
          flat["Flat Number"].includes("G")
            ? flat["Flat Number"]
            : parseInt(flat["Flat Number"].toString().replace(",", ""));
        json.inventories[tower][flat_num] = {
          UnitType: flat["Unit Type"],
          Direction: flat["Direction"],
          TowerName: flat["Tower Name"],
          FloorNumber: flat["Floor Number"],
          SBU: flat["SBU"],
          TotalCost: flat["Total Cost"],
          Status: "Available",
        };
      });
    });
  };
  
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  
  export const getDateFromTimestamp = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return `${date.getDate()}-${MONTHS[date.getMonth()]}-${date.getFullYear()}`;
  };
  
  export const getTimeFromTimestamp = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return `${date.getHours()}:${date.getMinutes()}`;
  };
  
  export function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }
  
  export const getFormalCurrencyFromNum = (num) => {
    if(num){
      let num_str = num.toString();
  
      if (num_str.length <= 3) return num;
    
      let unit = "";
      switch (num.toString().length) {
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
        case 4:
          unit = " k";
          break;
        case 5:
          unit = " k";
          break;
        case 6:
          unit = " lakh";
          break;
        case 7:
          unit = " lakh";
          break;
        case 8:
          unit = " cr";
          break;
        case 9:
          unit = " cr";
          break;
        default:
          break;
      }
    
      if (num_str.length % 2 !== 0)
        return num_str.slice(0, 2) + "." + num_str.slice(2, 4) + unit;
    
      return num_str.slice(0, 1) + "." + num_str.slice(1, 3) + unit;
    }    
  };
  
  export const getUniquId = () =>
    Date.now() + Math.random().toString(36).substr(2, 9);
  
  export const getSVGID = (id) => id.split("_")[0];
  
  export const getCombinedTowerName = (tower) => {
    switch (tower.toLowerCase()) {
      case "a":
      case "b":
        return "a-b";
      case "c":
      case "d":
        return "c-d";
      case "e":
      case "f":
        return "e-f";
      case "g":
      case "h":
        return "g-h";
      default:
        return tower;
    }
  };
  