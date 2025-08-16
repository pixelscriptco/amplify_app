import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { LocationIcon } from "../Data/icons";
import nothing_found from "../Data/images/nothing.jpg";
import { view_360 } from "../Data/images/AmenitiesSvgs";
import axiosInstance from "../Utility/axios";
import { useParams } from "react-router-dom";
import { smart_world_site_1 } from "../Data/Screen1PageSvg";
import Err from "./Atoms/Error";

// Simple SVG placeholders for Description and Construction Updates
const DescriptionIcon = () => (
  <svg
    width="22px"
    height="22px"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
  >
    <path d="M272 112C272 85.5 293.5 64 320 64C346.5 64 368 85.5 368 112C368 138.5 346.5 160 320 160C293.5 160 272 138.5 272 112zM224 256C224 238.3 238.3 224 256 224L320 224C337.7 224 352 238.3 352 256L352 512L384 512C401.7 512 416 526.3 416 544C416 561.7 401.7 576 384 576L256 576C238.3 576 224 561.7 224 544C224 526.3 238.3 512 256 512L288 512L288 288L256 288C238.3 288 224 273.7 224 256z" />
  </svg>
);
const ConstructionIcon = () => (
  <svg
    width="22px"
    height="22px"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
  >
    <path d="M525.2 82.9C536.7 88 544 99.4 544 112L544 528C544 540.6 536.7 552 525.2 557.1C513.7 562.2 500.4 560.3 490.9 552L444.3 511.3C400.7 473.2 345.6 451 287.9 448.3L287.9 544C287.9 561.7 273.6 576 255.9 576L223.9 576C206.2 576 191.9 561.7 191.9 544L191.9 448C121.3 448 64 390.7 64 320C64 249.3 121.3 192 192 192L276.5 192C338.3 191.8 397.9 169.3 444.4 128.7L491 88C500.4 79.7 513.9 77.8 525.3 82.9zM288 384L288 384.2C358.3 386.9 425.8 412.7 480 457.6L480 182.3C425.8 227.2 358.3 253 288 255.7L288 384z" />
  </svg>
);
const AmenitiesIcon = () => (
  <svg
    width="20px"
    height="20px"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 512"
  >
    <path d="M624 448h-80V113.45C544 86.19 522.47 64 496 64H384v64h96v384h144c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM312.24 1.01l-192 49.74C105.99 54.44 96 67.7 96 82.92V448H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h336V33.18c0-21.58-19.56-37.41-39.76-32.17zM264 288c-13.25 0-24-14.33-24-32s10.75-32 24-32 24 14.33 24 32-10.75 32-24 32z" />
  </svg>
);

// Custom Location icon (pin/marker)
const CustomLocationIcon = () => (
  <svg
    width="22px"
    height="22px"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
  >
    <path d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z" />
  </svg>
);

// Custom 360 view icon (circular arrow)
const Custom360Icon = () => (
  <svg
    width="22px"
    height="22px"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
  >
    <path d="M320 64C355.3 64 384 92.7 384 128C384 163.3 355.3 192 320 192C284.7 192 256 163.3 256 128C256 92.7 284.7 64 320 64zM288 224L352 224C387.3 224 416 252.7 416 288L416 336C416 353.7 401.7 368 384 368L382.2 368L371.1 467.5C369.3 483.7 355.6 496 339.3 496L300.6 496C284.3 496 270.6 483.7 268.8 467.5L257.7 368L255.9 368C238.2 368 223.9 353.7 223.9 336L223.9 288C223.9 252.7 252.6 224 287.9 224zM476.4 464.2C460.3 460 441.6 456.6 421 454L426.3 406.3C449 409.2 470 413 488.4 417.8C510.8 423.6 531 431.1 546.2 441.1C560.9 450.7 576 466 576 488.1C576 510.2 560.9 525.5 546.2 535.1C531 545 510.7 552.6 488.4 558.4C443.3 570.1 383.1 576.2 320 576.2C256.9 576.2 196.7 570.1 151.6 558.4C129.2 552.4 109 544.9 93.8 535C79.1 525.4 64 510.1 64 488C64 465.9 79.1 450.6 93.8 441C109 431.1 129.3 423.5 151.6 417.7C170.1 412.9 191.1 409.1 213.7 406.2L219 454C198.4 456.6 179.7 460.1 163.6 464.2C107 478.8 107 497.1 163.6 511.7C203.5 522 259.4 527.9 320 527.9C380.6 527.9 436.5 522 476.4 511.7C533 497.1 533 478.8 476.4 464.2z" />
  </svg>
);

const iconData = [
  { Icon: DescriptionIcon, label: "Description" },
  { Icon: CustomLocationIcon, label: "Location" },
  { Icon: AmenitiesIcon, label: "Amenities" },
  { Icon: ConstructionIcon, label: "Construction Updates" },
  { Icon: Custom360Icon, label: "Project Tour" },
];

const Sidebar = () => {
  const iconRefs = useRef([]);
  const [showDescription, setShowDescription] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showConstructionUpdates, setShowConstructionUpdates] = useState(false);
  const { project } = useParams();
  const [description, setDescription] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [project_updates, setProjectUpdates] = useState([]);
  const [resorcetype, setResorcetype] = useState("image");
  const [location, setLocation] = useState({});

  // useEffect(() => {
  //   iconRefs.current.forEach((ref, idx) => {
  //     if (ref) {
  //       tippy(ref, {
  //         content: iconData[idx].label,
  //         placement: 'right',
  //         animation: 'shift-away',
  //         arrow: true,
  //         theme: 'light',
  //       });
  //     }
  //   });
  //   // Cleanup tippy instances on unmount
  //   return () => {
  //     iconRefs.current.forEach(ref => {
  //       if (ref && ref._tippy) ref._tippy.destroy();
  //     });
  //   };
  // }, []);

  useEffect(() => {
    if (!project) return;
    axiosInstance
      .get(`/app/project/${project}/details`)
      .then((response) => {
        let { description, vr_url , amenities, project_updates } =
          response.data;
        console.log(response.data);
        // project_updates = [];
        setDescription(description || "");
        setProjectUrl(vr_url  || "");
        setAmenities(amenities || []);
        setProjectUpdates(project_updates || []);
        // console.log(project_url);
        if (
          response.data &&
          response.data.latitude &&
          response.data.longitude
        ) {
          setLocation({
            lat: response.data.latitude,
            lng: response.data.longitude,
          });
        }
      })
      .catch((error) => {
        console.error("API error:", error);
      });
  }, [project]);

  const handleIconClick = (idx) => {
    setShowDescription(false);
    setShowLocation(false);
    setShowAmenities(false);
    setShowTour(false);
    setShowConstructionUpdates(false);
    if (idx === 0) setShowDescription(true);
    if (idx === 1) setShowLocation(true);
    if (idx === 2) setShowAmenities(true);
    if (idx === 3) setShowConstructionUpdates(true);
    if (idx === 4) setShowTour(true);
    // Add more handlers for other icons if needed
  };

  // Add this helper to determine which icon is active
  const getActiveIdx = () => {
    if (showDescription) return 0;
    if (showLocation) return 1;
    if (showAmenities) return 2;
    if (showConstructionUpdates) return 3;
    if (showTour) return 4;
    return -1;
  };

  return (
    <>
      <SidebarContainer className="sidebar">
        <div className="nav_outer_boxx_ui">
          <div className="main_block_nav">
            {iconData.map(({ Icon, label }, idx) => (
              <div
                className={`nav_icon ${
                  getActiveIdx() === idx ? " active" : ""
                }`}
                key={idx}
                ref={(el) => (iconRefs.current[idx] = el)}
                tabIndex={0}
                style={{ outline: "none" }}
                onClick={() => handleIconClick(idx)}
              >
                <div className="min_wid_35px">
                  <Icon />
                </div>
                <span class="label_tip"> {label}</span>
              </div>
            ))}
          </div>
        </div>
      </SidebarContainer>
      <SlidePanel open={showDescription}>
        <div className="slide-panel-content">
          <button
            className="close-btn"
            onClick={() => setShowDescription(false)}
          >
            &times;
          </button>
          {/* <h2>Description</h2> */}
          {!description ? (
            <div className="no_data_wrap">
              <div className="no_data_block">
                <img src={nothing_found} alt="no data" />
              </div>
              <span className="text_amentyies">No description available.</span>
            </div>
          ) : (
            <div
              style={{ marginTop: 10 }}
              dangerouslySetInnerHTML={{ __html: description }}
            ></div>
          )}
        </div>
      </SlidePanel>
      <SlidePanel open={showLocation}>
        <div className="slide-panel-content">
          <button className="close-btn" onClick={() => setShowLocation(false)}>
            &times;
          </button>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!location || !location.lat ? (
              <div className="no_data_wrap">
                <div className="no_data_block">
                  <img src={nothing_found} alt="no data" />
                </div>
                <span className="text_amentyies">
                  No location available for the project.
                </span>
              </div>
            ) : (
              <div className="construction_uopdated mappp">
                <iframe
                  src={`https://www.google.com/maps?q=${location.lat},${location.lng}&hl=en&z=14&output=embed`}
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map"
                ></iframe>

                {/*<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3416.893646136412!2d76.95014987426298!3d8.487050397238326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05bb3396d78f9f%3A0x96658c7f686832ec!2sTrivandrum%20Central%20Railway%20Station!5e1!3m2!1sen!2sin!4v1755103997087!5m2!1sen!2sin"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>*/}
              </div>
            )}
          </div>
        </div>
      </SlidePanel>
      <SlidePanel open={showAmenities}>
        <div className="slide-panel-content">
          <button className="close-btn" onClick={() => setShowAmenities(false)}>
            &times;
          </button>
          <h2>Amenities</h2>
          <div
          className="grid_amen"
            style={{
              gap: 24,
              marginTop: 24,
            }}
          >
            {amenities.length === 0 ? (
              <div className="no_data_wrap">
                <div className="no_data_block">
                  <img src={nothing_found} alt="no data" />
                </div>
                <span className="text_amentyies">No amenities available.</span>
              </div>
            ) : (
              amenities.map((a, idx) => (
                <div
                  className="AMENITIES_OUTER"
                  onClick={() => a.vr_url && window.open(a.vr_url, "_blank")}
                >
                  <div className="img_blockqe">
                    <img src={a.image} alt={a.name} className="IMG_amenite" />
                  </div>

                  <div className="text_amenties">{a.name}</div>

                  <div className="shadow_outer"></div>

                  <div className="outer_grad">
                    <svg
                      width="61"
                      height="61"
                      viewBox="0 0 61 61"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.7">
                        <path
                          d="M18.5895 18.1107C22.3212 17.3051 26.4573 16.9149 30.6881 16.9149C34.9189 16.9149 38.9399 17.4108 42.6716 18.2164L44.8881 18.7526C47.184 19.3669 49.4696 20.0919 51.3789 21.0032C56.6745 23.5307 59.5693 27.05 59.5693 30.4964C59.5693 33.9427 56.4032 37.5653 51.1051 40.0927C49.1957 41.0041 47.0611 41.7693 44.7653 42.3836L42.5487 42.9198C38.817 43.7254 34.7295 44.1533 30.4987 44.1533C26.2679 44.1533 23.3578 43.8412 19.6235 43.0331C19.7617 43.6398 19.8155 43.8185 19.9767 44.4026C23.6061 45.1251 26.4547 45.475 30.4987 45.475C34.5427 45.475 38.4664 45.0949 42.0957 44.3724L44.3481 43.8664C47.0739 43.1917 49.6001 42.3131 51.8397 41.2457C57.7469 38.4262 61 34.6073 61 30.4938C61 26.3804 57.7469 22.5615 51.8397 19.742C49.6027 18.6746 47.0739 17.796 44.3481 17.1213L42.0957 16.6153C38.4664 15.8928 34.5401 15.5127 30.4987 15.5127C26.4573 15.5127 22.5311 15.8928 18.9017 16.6153L16.6494 17.1213C13.9236 17.796 11.3974 18.6746 9.15782 19.742C3.2531 22.564 0 26.3829 0 30.4989C0 34.6148 3.25309 38.4312 9.16036 41.2508C9.58012 41.4496 10.0127 41.6409 10.4503 41.8298L10.9341 40.566C10.5783 40.4125 10.22 40.2589 9.87957 40.0978C4.58402 37.5703 1.44611 33.9301 1.44611 30.4838C1.44611 27.0374 4.58402 23.3998 9.87957 20.8723C11.7889 19.961 14.0771 19.2662 16.3704 18.6519L18.5895 18.1107Z"
                          fill="white"
                        />
                        <path
                          d="M11.7585 38.5269L15.3795 42.4988C15.4909 42.6084 15.4352 42.8002 15.2681 42.8276L10.1156 43.7319C9.97637 43.7593 9.83709 43.6223 9.89279 43.4854L11.4243 38.6091C11.48 38.4722 11.675 38.4174 11.7585 38.5269Z"
                          fill="white"
                        />
                        <path
                          d="M44.8003 40.9333C45.5349 37.3636 45.7294 34.4736 45.7294 30.4961C45.7294 26.5186 45.4862 23.5908 44.7516 20.0211C44.1553 19.8625 43.8405 19.7316 43.2236 19.5957C44.0452 23.2661 44.337 26.355 44.337 30.5162C44.337 34.6775 44.0939 37.7261 43.2723 41.399C43.8891 41.2606 44.2065 41.0919 44.8003 40.9333Z"
                          fill="white"
                        />
                        <path
                          d="M17.8652 42.3516C17.0436 38.6812 16.6085 34.6609 16.6085 30.4996C16.6085 26.3384 16.78 23.252 17.6016 19.5791C16.9848 19.715 16.7263 19.8661 16.1299 20.0247C15.3953 23.5944 15.2725 26.5221 15.2725 30.4996C15.2725 34.4772 15.6589 38.3364 16.3935 41.906L16.908 44.1214C17.5939 46.8024 18.4872 49.2871 19.5724 51.4898C22.439 57.3 26.3217 60.4997 30.5039 60.4997C34.6861 60.4997 38.5688 57.3 41.4354 51.4898C42.5207 49.2896 43.4114 47.749 44.0999 45.0679C43.4933 45.2139 43.1349 45.3524 42.5104 45.4783C41.8859 47.7364 41.1078 48.8894 40.1813 50.7673C37.6116 55.9759 34.0104 59.2334 30.5065 59.2334C27.0026 59.2334 23.3143 55.9784 20.7446 50.7673C19.8181 48.8894 19.04 46.7898 18.4155 44.5317L17.8652 42.3516Z"
                          fill="white"
                        />
                        <path
                          d="M41.4321 9.50983C38.5655 3.69964 34.6827 0.5 30.5006 0.5C26.3184 0.5 22.4357 3.69964 19.569 9.50983C18.4838 11.71 17.7237 13.2507 17.0352 15.9318C17.6418 15.7857 18.0052 15.6473 18.6323 15.5214C19.2568 13.2633 19.9043 12.1103 20.8309 10.2323C23.4006 5.02379 26.9966 1.98779 30.5006 1.98779C34.0045 1.98779 37.6441 4.89792 40.2138 10.1065C40.3955 10.4765 40.567 10.8617 40.7385 11.2468L41.967 10.6603C41.793 10.2676 41.6164 9.8824 41.4321 9.50983Z"
                          fill="white"
                        />
                        <path
                          d="M43.7983 10.1728L43.0904 15.462C43.0784 15.6165 42.8942 15.6998 42.7642 15.5929L38.7119 12.3349C38.6001 12.2488 38.6151 12.0556 38.7571 12.008L43.5173 9.97684C43.6592 9.92924 43.8284 10.0391 43.7983 10.1728Z"
                          fill="white"
                        />
                      </g>
                      <path
                        d="M25.7245 31.6707C25.7245 32.45 25.4587 33.0574 24.9271 33.4928C24.4352 33.8977 23.8044 34.1002 23.0347 34.1002C22.2809 34.1002 21.662 33.913 21.178 33.5387C20.6226 33.1108 20.3409 32.4958 20.333 31.6936H21.8802C21.904 32.4042 22.2889 32.7594 23.0347 32.7594C23.7964 32.7594 24.1773 32.3812 24.1773 31.6249C24.1773 30.8762 23.7806 30.5018 22.9871 30.5018H22.761V29.2069H22.9871C23.7012 29.2069 24.0583 28.8669 24.0583 28.187C24.0583 27.4917 23.7131 27.1441 23.0228 27.1441C22.3643 27.1441 22.0151 27.4726 21.9755 28.1297H20.4282C20.4441 27.4192 20.702 26.85 21.2018 26.4222C21.6858 26.0096 22.2928 25.8033 23.0228 25.8033C23.7766 25.8033 24.3955 26.0211 24.8795 26.4565C25.3635 26.892 25.6055 27.4535 25.6055 28.1411C25.6055 28.5613 25.5143 28.9127 25.3318 29.1954C25.1652 29.4552 24.9311 29.6615 24.6296 29.8142C24.9628 29.9823 25.2207 30.2077 25.4032 30.4904C25.6174 30.8189 25.7245 31.2123 25.7245 31.6707Z"
                        fill="white"
                      />
                      <path
                        d="M32.1512 31.5561C32.1512 32.343 31.8973 32.9657 31.3894 33.4241C30.9054 33.8748 30.2786 34.1002 29.5089 34.1002C28.7393 34.1002 28.1125 33.8825 27.6285 33.447C27.1206 32.9886 26.8667 32.366 26.8667 31.579C26.8667 31.2429 26.9382 30.88 27.081 30.4904C27.1365 30.3299 27.2119 30.1504 27.3071 29.9518C27.3706 29.8142 27.4618 29.6309 27.5809 29.4017L29.3661 25.8721H31.0562L29.2947 29.2413C29.4693 29.1725 29.6795 29.1381 29.9255 29.1381C30.5285 29.1381 31.0443 29.352 31.4728 29.7799C31.925 30.2383 32.1512 30.8303 32.1512 31.5561ZM30.6039 31.5676C30.6039 30.773 30.2389 30.3758 29.5089 30.3758C28.779 30.3758 28.414 30.773 28.414 31.5676C28.414 32.3621 28.779 32.7594 29.5089 32.7594C30.2389 32.7594 30.6039 32.3621 30.6039 31.5676Z"
                        fill="white"
                      />
                      <path
                        d="M38.5659 31.6707C38.5659 32.4194 38.312 33.0192 37.8042 33.4699C37.3201 33.8901 36.7171 34.1002 35.9951 34.1002C35.273 34.1002 34.67 33.8901 34.186 33.4699C33.6703 33.0192 33.4124 32.4194 33.4124 31.6707V28.2328C33.4124 27.4841 33.6703 26.8844 34.186 26.4336C34.67 26.0134 35.273 25.8033 35.9951 25.8033C36.7171 25.8033 37.3201 26.0134 37.8042 26.4336C38.312 26.8844 38.5659 27.4841 38.5659 28.2328V31.6707ZM37.0186 28.2557C37.0186 27.5147 36.6774 27.1441 35.9951 27.1441C35.3048 27.1441 34.9596 27.5147 34.9596 28.2557V31.6593C34.9596 32.3927 35.3048 32.7594 35.9951 32.7594C36.6774 32.7594 37.0186 32.3927 37.0186 31.6593V28.2557Z"
                        fill="white"
                      />
                      <path
                        d="M44.2546 27.8202C44.2546 28.4009 44.0403 28.8975 43.6119 29.31C43.1913 29.7226 42.6756 29.9288 42.0646 29.9288C41.4616 29.9288 40.9459 29.7226 40.5174 29.31C40.0889 28.8975 39.8747 28.4009 39.8747 27.8202C39.8747 27.232 40.0889 26.7316 40.5174 26.319C40.9459 25.9065 41.4616 25.7002 42.0646 25.7002C42.6677 25.7002 43.1834 25.9065 43.6119 26.319C44.0403 26.7316 44.2546 27.232 44.2546 27.8202ZM43.0049 27.8202C43.0049 27.2091 42.6875 26.9035 42.0527 26.9035C41.4338 26.9035 41.1244 27.2091 41.1244 27.8202C41.1244 28.4314 41.4378 28.737 42.0646 28.737C42.6915 28.737 43.0049 28.4314 43.0049 27.8202Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </SlidePanel>
      <SlidePanel open={showConstructionUpdates}>
        <div className="slide-panel-content">
          <button
            className="close-btn"
            onClick={() => setShowConstructionUpdates(false)}
          >
            &times;
          </button>
          <h2>Construction Updates</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              marginTop: 24,
            }}
          >
            {project_updates.length === 0 ? (
              <div className="no_data_wrap">
                <div className="no_data_block">
                  <img src={nothing_found} alt="no data" />
                </div>
                <span className="text_amentyies">
                  No construction updates available.
                </span>
              </div>
            ) : (
              <div className="construction_uopdated">
              <div className="videO_block">
                  <div 
                  onClick={() => setResorcetype('image')}
                   className={`img_vid_wrap ${resorcetype === "image" ? "Aciver_btn" : ""}`}>
                    <span className="dd_flex">
                      <svg
                        width="20px"
                        height="20px"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 640"
                      >
                        <path d="M160 144C151.2 144 144 151.2 144 160L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 160C496 151.2 488.8 144 480 144L160 144zM96 160C96 124.7 124.7 96 160 96L480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160zM224 192C241.7 192 256 206.3 256 224C256 241.7 241.7 256 224 256C206.3 256 192 241.7 192 224C192 206.3 206.3 192 224 192zM360 264C368.5 264 376.4 268.5 380.7 275.8L460.7 411.8C465.1 419.2 465.1 428.4 460.8 435.9C456.5 443.4 448.6 448 440 448L200 448C191.1 448 182.8 443 178.7 435.1C174.6 427.2 175.2 417.6 180.3 410.3L236.3 330.3C240.8 323.9 248.1 320.1 256 320.1C263.9 320.1 271.2 323.9 275.7 330.3L292.9 354.9L339.4 275.9C343.7 268.6 351.6 264.1 360.1 264.1z" />
                      </svg>
                    </span>
                    <span className="text_ft">Images</span>
                  </div>

                  <div 
                  onClick={() => setResorcetype('video')}                  
                  className={`img_vid_wrap ${resorcetype === "video" ? "Aciver_btn" : ""}`}>
                    <span className="dd_flex">
                      <svg
                        width="20px"
                        height="20px"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 640"
                      >
                        <path d="M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM276.5 211.5C269.1 207 259.8 206.8 252.2 211C244.6 215.2 240 223.3 240 232L240 408C240 416.7 244.7 424.7 252.3 428.9C259.9 433.1 269.1 433 276.6 428.4L420.6 340.4C427.7 336 432.1 328.3 432.1 319.9C432.1 311.5 427.7 303.8 420.6 299.4L276.6 211.4zM362 320L288 365.2L288 274.8L362 320z" />
                      </svg>
                    </span>
                    <span className="text_ft">Videos</span>
                  </div>
                </div>
                <div className="grid_block-wrapper">
                {project_updates.map((a, idx) => (
                  <div 
                  style={{
                    display : (
                      (resorcetype == 'image' && !a.image_url?.toLowerCase().endsWith(".mp4")) ||
                      (resorcetype == 'video' && a.image_url?.toLowerCase().endsWith(".mp4"))
                    ) ? 'block' : 'none'
                  }}
                  className="main_tab_img_block" key={a.id || idx}>
                    <div className="img_block_video">
                      {a.image_url?.toLowerCase().endsWith(".mp4") ? (
                        <video
                          width="100%"
                          height="240"
                          controls
                          // onClick={() => a.vr_url && window.open(a.vr_url, "_blank")}
                          style={{ cursor: a.vr_url ? "pointer" : "default" }}
                        >
                          <source src={a.image_url} type="video/mp4" />
                          <source
                            src={a.image_url.replace(/\.mp4$/, ".ogg")}
                            type="video/ogg"
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={a.image_url}
                          alt={a.name}
                          // onClick={() => a.vr_url && window.open(a.vr_url, "_blank")}
                        />
                      )}
                    </div>
                    <div style={{ display: 'none' }}>
                      <span className="main_text_blk">{a.name}</span>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </SlidePanel>
      <div
        className="wrap_iframe_box"
        style={{ display: showTour ? "block" : "none" }}
      >
      {
        projectUrl ? (
        <div className="main_se_wrap_box">
          <video width="100%" height="100%" controls>
            <source src={projectUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>) : (<Err msg="Couldn't find Project tour details." />)
      }
        <div
          className="cose_btn"
          onClick={() => setShowTour(false)}
          style={{ cursor: "pointer" }}
        >
          <svg
            viewBox="0 0 24 24"
            height="24"
            width="24"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
          >
            <title>close-refreshed</title>
            <path
              d="M11.9998 13.4L7.0998 18.3C6.91647 18.4833 6.68314 18.575 6.3998 18.575C6.11647 18.575 5.88314 18.4833 5.6998 18.3C5.51647 18.1167 5.4248 17.8833 5.4248 17.6C5.4248 17.3167 5.51647 17.0833 5.6998 16.9L10.5998 12L5.6998 7.09999C5.51647 6.91665 5.4248 6.68332 5.4248 6.39999C5.4248 6.11665 5.51647 5.88332 5.6998 5.69999C5.88314 5.51665 6.11647 5.42499 6.3998 5.42499C6.68314 5.42499 6.91647 5.51665 7.0998 5.69999L11.9998 10.6L16.8998 5.69999C17.0831 5.51665 17.3165 5.42499 17.5998 5.42499C17.8831 5.42499 18.1165 5.51665 18.2998 5.69999C18.4831 5.88332 18.5748 6.11665 18.5748 6.39999C18.5748 6.68332 18.4831 6.91665 18.2998 7.09999L13.3998 12L18.2998 16.9C18.4831 17.0833 18.5748 17.3167 18.5748 17.6C18.5748 17.8833 18.4831 18.1167 18.2998 18.3C18.1165 18.4833 17.8831 18.575 17.5998 18.575C17.3165 18.575 17.0831 18.4833 16.8998 18.3L11.9998 13.4Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
//   left: 50px;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,0); /* fully transparent */
  z-index: 10;
  display: flex;
  align-items: center;
  pointer-events: none; /* so it doesn't block interaction */
  box-shadow: inset 20px 20px 100px 20px rgb(0 0 0 / 82%), 0px 0px 60px rgba(0, 0, 0, 0.2);
  .sidebar-icons {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    pointer-events: all;
    margin-left: 20px;
  }
  .sidebar-icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    pointer-events: all;
    user-select: none;
    cursor: pointer;
    transition: color 0.2s;
  }
  .sidebar-icon-item svg {
    width: 40px;
    height: 40px;
    margin-bottom: 4px;
    display: block;
    transition: color 0.2s, filter 0.2s;
    color: inherit;
  }
  .sidebar-icon-item{
  color:#bdbdbd;
  }
  .sidebar-icon-item:hover,
  .sidebar-icon-item:focus {
    color: #ffb703; /* hover color */
  }
  .sidebar-icon-item.active {
    color: #bc5f00; /* active color */
  }
`;

const SlidePanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 600px;
  background: #1d1d1ddb;
  color: #fff;
  z-index: 2000;
  box-shadow: -4px 0 24px 0 rgba(0,0,0,0.25);
  transform: translateX(${(props) => (props.open ? "0" : "100%")});
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  .slide-panel-content {
    padding: 2rem 1.5rem;
    height: 100%;
    overflow-y: auto;
    position: relative;
  }
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: #fff;
    font-size: 2rem;
    cursor: pointer;
    z-index: 10;
  }
`;
