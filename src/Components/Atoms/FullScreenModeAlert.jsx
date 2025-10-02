import React from "react";

export function getFullscreenElement() {
  return (
    document.fullscreenElement || //standard property
    document.webkitFullscreenElement || //safari/opera support
    document.mozFullscreenElement || //firefox support
    document.msFullscreenElement
  ); //ie/edge support
}

export function toggleFullscreen() {
  if (getFullscreenElement()) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen().catch(console.log);
  }
}

function FullScreenModeAlert() {
  let fulscr = localStorage.getItem("fullscr");
  console.log(fulscr);
  const [show, setShow] = React.useState(!fulscr);

  const handleYes = () => {
    toggleFullscreen();
    setShow(false);
  };

  const handleNo = () => {
    setShow(false);
    localStorage.setItem("fullscr", "no");
  };

  return show ? (
    <>
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          height: "100vh",
          width: "100vw",
          position: "absolute",
          top: "0px",
          left: "0px",
          zIndex: "200",
        }}
      ></div>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          position: "absolute",
          top: "0px",
          left: "0px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "10vh",
          zIndex: "200",
        }}
      >
        <div
          style={{
            width: "fit-content",
            display: "flex",
            flexDirection: "column",
            color: "black",
            backgroundColor: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center", padding: "10px 5px" }}></div>

          <div
            style={{
              textAlign: "center",
              lineHeight: "30px",
              fontSize: "1.2rem",
            }}
          >
            For Better Experience <br />
            Enter Fullscreen Mode ?
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "20px 60px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "var(--blue-theme)",
                color: "white",
                padding: "5px 10px",
                cursor: "pointer",
                borderRadius: "3px",
              }}
              onClick={handleYes}
            >
              Yes
            </div>
            <div
              style={{
                backgroundColor: "var(--blue-theme)",
                color: "white",
                padding: "5px 10px",
                cursor: "pointer",
                borderRadius: "3px",
                marginLeft: "20px",
              }}
              onClick={handleNo}
            >
              No
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
}

export default FullScreenModeAlert;
