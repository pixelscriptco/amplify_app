import { useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import styled from "styled-components";
import { TOWERS, TOWERS_LIST } from "../../Data";
import { getFormalNameFromNumber } from "../../Utility/function";
import axiosInstance from "../../Utility/axios";

function FloorSelector({
  currentTower,
  currentFloor,
  selectedFloor,
  setSelectedFloor,
  selectedTower,
  setSelectedTower,
}) {
  const { project } = useParams();
  const [isOpen, setIsOpen] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableFloorsToggle, setAvailableFloorsToggle] = useState(false);
  const [projectData, setProjectData] = useState({});
  const floorsOneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const floorsElevenToTwenty = [11, 12, 14, 15, 16, 17, 18, 19, 20];
  const floors21To30 = [21, 22, 23, 24, 25, 26, 27, 28, 29];


  useEffect(() => {
    const fetchProjectData = async () => {
      try {        
        setLoading(true);
        const response = await axiosInstance.get(`/app/project/${project}`);

        const { id, name,status } = response.data;
        // const {plan,area,type,cost} = response.data.unit_plans;
        
        setProjectData({
          id,
          name,
          status,
          // area,
          // type,
          // cost,
          // image_url:plan
        })

        setLoading(false);  
      }catch(err){
        console.error('Error fetching floor SVG:', err);
        setError('Failed to load floor visualization');
      } finally {
        setLoading(false);
      }
    }

    fetchProjectData();
  }, [project]);


  const handleSelectedFloor = (e, floor) => {
    // to prevent event delegation
    e.stopPropagation();
    setSelectedFloor(floor);
  };

  const handleAvailableFloorsToggle = () => {
    setAvailableFloorsToggle(!availableFloorsToggle);
  };

  const navigate = useNavigate();

  const totalFloors = [
    ...floorsOneToTen,
    ...floorsElevenToTwenty,
    ...floors21To30,
  ];

  return (
    <Style>
      <div class="body info svelte-9mhvmf">
        {" "}
        <div class="floor-switcher-wrapper">
          <div class="panel floor-switcher svelte-1shyvx4">
            <div class="title svelte-1shyvx4">
              <h2 class="titleFloor" slot="title">
                {currentTower + " TOWER"}{" "}
                {getFormalNameFromNumber(currentFloor)}
                <span>{` FLOOR`}</span>
              </h2>
            </div>{" "}
            <div
              class={
                isOpen
                  ? "body active svelte-1shyvx4 body--margin"
                  : "body svelte-1shyvx4 body--margin"
              }
            >
              <div slot="body" class="floor__wrap svelte-6keq0u">
                <div class="inputs-container">
                  <div class="notBack">
                    <div class="input-group">
                      <label class="input-group-label">
                        <span></span>{" "}
                        <input
                          type="text"
                          regex="/\D/"
                          name="floor_number"
                          placeholder={
                            selectedFloor !== currentFloor ||
                            selectedTower !== currentTower
                              ? ` ${selectedTower.toUpperCase()} Tower ${getFormalNameFromNumber(
                                  selectedFloor
                                )} Floor`
                              : "Enter or select a floor"
                          }
                          class={`${
                            selectedFloor !== currentFloor ||
                            selectedTower !== currentTower
                              ? "input-floor floor-selected"
                              : "input-floor"
                          }`}
                          onChange={(e) => {
                            if (e.key !== "Enter")
                              setSelectedFloor(e.target.value);
                          }}
                          autocomplete="off"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setSelectedFloor(e.target.value);
                              e.target.value = "";
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>{" "}
                  <div class="notBack">
                    {/* <div class="input-group">
                      <label class="fake-checkbox-label">
                        <input name="available" type="checkbox" />{" "}
                        <div
                          onClick={handleAvailableFloorsToggle}
                          class={`fake-checkbox toggle-button ${
                            availableFloorsToggle
                              ? "toggle-button--checked"
                              : ""
                          }`}
                        ></div>{" "}
                        <span>Only available</span>
                      </label>
                    </div> */}
                  </div>
                  <div className="towers-container">
                    <div className="section-title">Towers</div>
                    <div className="towers">
                      {TOWERS_LIST.map((tower) => (
                        <div
                          className={`tower ${
                            tower === selectedTower ? " active" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTower(tower);
                          }}
                        >
                          {TOWERS[tower].title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>{" "}
                <div className="section-title">Floors</div>
                <div class="floor__buttons svelte-6keq0u">
                  <div
                    class={`floors__group notBack svelte-6keq0u ${
                      availableFloorsToggle ? "hide-ground-floor" : ""
                    }`}
                  >
                    {/* <div
                      class={`floors__group--item ground-floor color_retails available svelte-6keq0u`}
                    >
                      <button class="button__gf">GF</button>
                    </div> */}
                  </div>{" "}
                  <div class="floors__group svelte-6keq0u">
                    <div class="floors__group--numbers svelte-6keq0u">
                      1 - 10
                    </div>
                    {floorsOneToTen.map((floor) => {
                      return (
                        <div
                          onClick={(e) => handleSelectedFloor(e, floor)}
                          class={`floors__group--item notBack svelte-6keq0u available ${
                            selectedFloor == floor ? "selected" : ""
                          }`}
                        >
                          <button
                            value={floor}
                            class={`floors__group--button notBack svelte-6keq0u ${
                              selectedFloor == floor ? "selected" : ""
                            }`}
                          >
                            {floor}
                          </button>{" "}
                        </div>
                      );
                    })}{" "}
                  </div>{" "}
                  <div class="floors__group svelte-6keq0u">
                    <div class="floors__group--numbers svelte-6keq0u">
                      11 - 20
                    </div>{" "}
                    {floorsElevenToTwenty.map((floor) => {
                      return (
                        <div
                          onClick={(e) => handleSelectedFloor(e, floor)}
                          class={`floors__group--item notBack svelte-6keq0u available ${
                            selectedFloor == floor ? "selected" : ""
                          }`}
                        >
                          <button
                            value={floor}
                            class="floors__group--button notBack svelte-6keq0u"
                          >
                            {floor}
                          </button>{" "}
                        </div>
                      );
                    })}{" "}
                  </div>
                  <div class="floors__group svelte-6keq0u">
                    <div class="floors__group--numbers svelte-6keq0u">
                      21 - 30
                    </div>{" "}
                    {floors21To30.map((floor) => {
                      return (
                        <div
                          onClick={(e) => handleSelectedFloor(e, floor)}
                          class={`floors__group--item notBack svelte-6keq0u available ${
                            selectedFloor == floor ? "selected" : ""
                          }`}
                        >
                          <button
                            value={floor}
                            class="floors__group--button notBack svelte-6keq0u"
                          >
                            {floor}
                          </button>{" "}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div class="alwaysVisible">
              <div slot="alwaysVisible">
                <div class="">
                  <button
                    class={`button active toggleButton svelte-ynf51n ${
                      selectedFloor !== currentFloor ||
                      selectedTower !== currentTower
                        ? "explore"
                        : isOpen
                        ? "close"
                        : "select-floor"
                    } `}
                    value=""
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        selectedFloor !== currentFloor ||
                        selectedTower !== currentTower
                      )
                        navigate(
                          `/${project}/tower/${selectedTower}/floor/${selectedFloor}`
                        );
                      else setIsOpen(!isOpen);
                    }}
                  >
                    {selectedFloor !== currentFloor ||
                    selectedTower !== currentTower
                      ? "Explore"
                      : isOpen
                      ? "Close"
                      : "Select floor"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
    </Style>
  );
}
export default FloorSelector;

const Style = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  transition: all 800ms linear;
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  .body {
    z-index: 100;
  }
  .interface.svelte-9mhvmf .info.svelte-9mhvmf {
    z-index: 100;
  }
  @media (max-width: 767px) {
    .body.info.svelte-9mhvmf.svelte-9mhvmf {
      margin-left: 0;
    }
  }

  .section-title {
    color: #023047;
    font-size: 11px;
    font-weight: 500;
    text-align: center;
    padding: 10px 0;
  }
  .towers-container {
    border-bottom: solid 1px #3e3e3e;
    margin-bottom: 10px;
    .towers {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      width: fit-content;
      margin: auto;
      flex-wrap: wrap;
      .tower {
        background-color: var(--background_panel);
        color: var(--color_text);
        border: 1px solid #ffb703;
        width: 30px;
        border-radius: 4px;
        text-align: center;
        margin: 0 2px;
        margin-bottom: 10px;
        cursor: pointer;
        padding: 0.2rem;
        font-size: 12px;
      }
      .tower.active {
        background-color: var(--yellow-theme);
        border-color: var(--blue-theme);
        color:var(--blue-theme);
      }
    }
  }

  // overlay of body
  .body.info.svelte-9mhvmf.svelte-9mhvmf {
    /* margin-left: 10px; */
    display: flex;
    position: absolute;
    /* top: 220px; // initialy 130px */
    /* left: 1rem; // initialy 200px */
    top: 0;
    left: 0;
  }
  .panel.svelte-1shyvx4.svelte-1shyvx4 {
    display: flex;
    flex-direction: column;
    background: var(--panel_background);
    border-radius: var(--radius);
    padding: var(--panel_padding);
    width: 100%;
    /* max-width: var(--panel_max_width); */
    max-width: 14rem;
    min-width: var(--panel_min_width);

    transition: opacity var(--transition);
    pointer-events: all;
    z-index: 13;
    position: relative;
  }
  .panel.svelte-1shyvx4 .title.svelte-1shyvx4 {
    font-size: 9px;
    text-transform: uppercase;
    text-align: center;
    color: var(--panel_title_color);
  }
  .floor-switcher > .title {
    margin-bottom: 15px;
  }
  .titleFloor {
    font-size: 13px;
    line-height: 15px;
    text-align: center;
    margin-top: 5px;
    color: #ffff;
  }
  .panel.svelte-1shyvx4 .body--margin.svelte-1shyvx4 {
    margin-top: 10px;
  }
  .panel.svelte-1shyvx4 .body.svelte-1shyvx4 {
    flex-shrink: 0;
  }
  .floor-switcher > .body {
    transition: all 200ms linear;
    height: 0;
    flex-shrink: 1 !important;
    overflow-y: scroll;
    margin-bottom: 18px;
    margin-top: 0 !important;
    /* max-height: 350px; */
  }

  .floor-switcher > .body.active {
    height: 350px;
  }
  .floor-switcher .floor__wrap.svelte-6keq0u.svelte-6keq0u {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 0px 15px;
    min-height: 369px;
    max-height: 369px;
  }
  @media (max-width: 767px) {
    .floor__wrap.svelte-6keq0u.svelte-6keq0u {
      padding: 7px 0;
    }
  }
  /* Works on Firefox */
  .body {
    scrollbar-width: thin;
    scrollbar-color: #636363 #636363;
  }
  /* Works on Chrome, Edge, and Safari */
  .body::-webkit-scrollbar {
    width: 2px;
  }
  .body::-webkit-scrollbar-track {
    background: #636363;
  }
  .body::-webkit-scrollbar-thumb {
    background-color: #636363;
    border-radius: 20px;
    border: 0px solid #636363;
  }
  @media (max-width: 767px) {
    .input-group {
      margin-bottom: 15px;
    }
  }
  .input-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  label {
    color: var(--input_label_text_color);
    width: 100%;
  }
  .inputs-container input[type="text"] {
    border: 1px solid #929292;
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 11px;
  }
  .floor-switcher input[name="floor_number"] {
    max-width: 150px;
    margin: 0 auto;
    display: block;
  }
  .floor-switcher-wrapper input[name="floor_number"] {
    background-color: #313030;
  }
  .input-group input {
    margin-top: 5px;
  }
  input[type="text"],
  input[type="number"],
  input[type="email"],
  input[type="password"],
  select,
  textarea {
    background: #333;
    color: var(--color_back);
    padding: 8px 14px;
    border-radius: 4px;
    border: var(--input_border);
    margin-top: 5px;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-user-select: text;
    transition: border var(--transition);
  }
  input {
    border: 0;
    border-radius: 0;
    width: 100%;
    outline: 0;
    margin: 0;
  }
  * {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
    user-drag: none;
    -webkit-touch-callout: none;
  }
  .floor-switcher-wrapper .input-group {
    margin-bottom: 13px;
  }
  @media (max-width: 767px) {
    .input-group {
      margin-bottom: 15px;
    }
  }
  .floor-switcher .fake-checkbox-label {
    font-size: 11px;
    color: #a4d486 !important;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    max-width: 130px;
    margin: 0 auto;
  }
  .input-group label {
    color: var(--input_label_text_color);
    position: relative;
  }
  .fake-checkbox-label {
    cursor: pointer;
  }
  label {
    display: block;
  }
  input[type="checkbox"] {
    display: none;
  }
  input[type="checkbox"] + .fake-checkbox {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    background-color: transparent;
    border: var(--input_radio_border);
    transition: var(--transition);
  }
  .fake-checkbox {
    display: inline-block;
    cursor: pointer;
  }
  .fake-checkbox {
    width: 24px !important;
    border-radius: 20px !important;
    background: #4a4a4a !important;
    border: none !important;
    height: 12px !important;
    position: relative;
    transition: var(--transition);
  }
  .fake-checkbox.toggle-button--checked {
    background: #77a641 !important;
    ::before {
      transform: translateY(-50%) translateX(100%);
      background: #333;
    }
  }
  .fake-checkbox::before {
    content: "";
    transition: var(--transition);
    width: 8px;
    height: 8px;
    border-radius: 20px;
    background: #fff;
    position: absolute;
    top: 50%;
    inset-inline-start: 3px;
    transform: translateY(-50%);
  }
  .floor__buttons.svelte-6keq0u.svelte-6keq0u {
    width: 100%;
    margin: 0 0 7px;
    padding: 0px !important;
  }
  .floor__buttons.svelte-6keq0u .floors__group.svelte-6keq0u:not(:last-child) {
    border-bottom: solid 1px #3e3e3e;
  }
  .floor__buttons.svelte-6keq0u .floors__group--item.available.svelte-6keq0u {
    cursor: pointer;
    pointer-events: all;
    background-color: #023047;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.svelte-6keq0u:nth-child(-n + 2) {
    margin-bottom: 10px;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.ground-floor.svelte-6keq0u {
    width: 100%;
    border: 1px solid #3e3e3e;
    box-sizing: border-box;
    border-radius: 4px;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 11px;
    line-height: 13px;
    margin: 0 !important;
  }
  .floor-switcher .inputs-container .floor-selected {
    max-width: 150px;
    background-color: rgba(119, 166, 65, 0.05) !important;
    border-color: var(--blue-theme); !important;
    color: #93bbf8;
  }
  .input-floor {
    background-color: #333;
  }
  .input-floor.floor-selected {
    background-color: #95c55e;
    border: 2px solid #77a641;
    ::placeholder {
      /* Chrome, Firefox, Opera, Safari 10.1+ */
     color: #93bbf8;
      opacity: 1; /* Firefox */
    }
    :-ms-input-placeholder {
      /* Internet Explorer 10-11 */
     color: #93bbf8;
    }
    ::-ms-input-placeholder {
      /* Microsoft Edge */
     color: #93bbf8;
    }
  }
  //ground-floor hidden
  .ground-floor .color_retails .button__gf {
    opacity: 0;
    height: 0px;
    margin-top: -30px;
    line-height: 0px;
  }
  .floors__group.svelte-6keq0u.hide-ground-floor {
    opacity: 0;
    height: 0px;
    margin-top: 0px;
    line-height: 0px;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.available.color_retails.svelte-6keq0u
    button {
    color: #e3b22e;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.ground-floor.svelte-6keq0u
    button {
    width: 100%;
    height: 25px;
    background: transparent;
    color: #3e3e3e;
  }
  input,
  button,
  select,
  textarea {
    font-family: "Roboto", sans-serif;
    font-size: inherit;
    -webkit-padding: 0.4em 0;
    padding: 0.4em;
    margin: 0 0 0.5em 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 2px;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.svelte-6keq0u:nth-last-child(-n + 4) {
    margin-bottom: 0px;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.svelte-6keq0u:nth-child(4n + 4) {
    margin-left: 0px;
  }
  .floor__buttons.svelte-6keq0u .floors__group--numbers.svelte-6keq0u {
    width: 65px;
    height: 25px;
    color: #023047;
    font-size: 11px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .floor__buttons.svelte-6keq0u .floors__group--item.active.svelte-6keq0u {
    background-color: var(--blue-theme);
    border-color: var(--blue-theme);;
  }
  .floor__buttons.svelte-6keq0u .floors__group.svelte-6keq0u {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;
    justify-content: flex-start;
    padding-bottom: 15px;
  }
  .floor__buttons.svelte-6keq0u .floors__group--button.svelte-6keq0u {
    font-size: 11px;
    font-weight: 500;
    background: transparent;
    color: #3e3e3e;
    padding: 0px;
  }
  .floor__buttons.svelte-6keq0u .floors__group--item.selected.svelte-6keq0u {
    background-color: var(--blue-theme);
    border-color: var(--blue-theme);;
    .floors__group--button.svelte-6keq0u {
      color: #fff;
    }
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.available
    .floors__group--button.svelte-6keq0u {
    color: var(--blue-theme);
  }
  button {
    border: 0;
    border-radius: 0;
    padding: 5px 10px;
    background-color: #006fff;
    color: #fff;
    flex-shrink: 0;
    cursor: pointer;
    margin: 0;
  }
  button {
    color: #333;
    background-color: #f4f4f4;
    outline: none;
  }
  .floor-switcher.alwaysVisible {
    width: 140px;
    margin: 0 auto;
  }
  .alwaysVisible {
    padding: 0px 15px;
  }
  //close button || Select floor
  .button.active {
    background: var(--button_background_active);
    box-shadow: var(--button_shadow_active);
    color: var(--button_color_active);
    font-weight: 500;
  }
  .button:last-child {
    margin-bottom: 0;
  }
  .floor-switcher-wrapper.toggleButton {
    background: #dadada !important;
  }
  .button {
    display: inline-block;
    border: none;
    width: 100%;
    padding: var(--paddings);
    background: var(--button_background);
    box-shadow: var(--button_shadow);
    border-radius: var(--radius);
    margin-bottom: 5px;
    font-size: 13px;
    line-height: 1.2;
    color: var(--button_color);
    text-align: center;
    pointer-events: auto;
    cursor: pointer;
    color: #bdbdbd;
    transition: var(--transition);
  }
  .floor__buttons.svelte-6keq0u .floors__group--item.active.svelte-6keq0u {
    background-color: var(--blue-theme);
    border-color: var(--blue-theme);;
  }
  .floor__buttons.svelte-6keq0u .floors__group--item.available.svelte-6keq0u {
    cursor: pointer;
    pointer-events: all;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.svelte-6keq0u:nth-child(-n + 2) {
    margin-bottom: 10px;
  }
  .floor__buttons.svelte-6keq0u .floors__group--item.svelte-6keq0u {
    width: 30px;
    height: 25px;
    border: 1px solid #3e3e3e;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    transition: var(--transition);
    margin-left: 5px;
    pointer-events: none;
    /* :hover {
      background-color: var(--blue-theme);
      .floors__group--button.svelte-6keq0u {
        color: #fff;
      }} */
    /* .selected {
      background-color: var(--blue-theme);
      .floors__group--button.svelte-6keq0u {
        color: #fff;
      }
    }  */
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.active.available.svelte-6keq0u
    button {
    color: #edff9f;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.active
    .floors__group--button.svelte-6keq0u {
    color: #edff9f;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.available
    .floors__group--button.svelte-6keq0u {
    color: #ffff;
  }
  .button.toggleButton {
    font-size: 11px;
    padding: 7px 0px;
  }
  .button.toggleButton.select-floor {
    background-color: #5f5f5f;
    color: #fff;
  }
  .button.toggleButton.isOpen {
    background-color: #fff;
    color: #333;
  }
  .button.toggleButton.explore {
    background-color: var(--blue-theme);
    color: #fff;
  }
`;