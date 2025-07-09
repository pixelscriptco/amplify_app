import React from "react";
import { Carousel as ReactCarousel } from "react-responsive-carousel";
import styled from "styled-components";

function Carousel({ children, titleList = [], onChange, currentItemIndex }) {
  const PrevArrow = (onClick, hasPrev) => (
    <div
      onClick={onClick}
      className="carousel-trigger prev-btn disable-text-selection no-select"
      style={{
        // this style requires to prevent tippy to show up while sliding to next carousel
        opacity: hasPrev ? "1" : "0",
        cursor: hasPrev ? "pointer" : "default",
      }}
    >
      <img alt="prev-arrow" src={`/up_arrow.svg`} />
      {titleList.length > 0 && (
        <div className="btn-label">
          {currentItemIndex > 0 && titleList[currentItemIndex - 1]}
        </div>
      )}
    </div>
  );

  const NextArrow = (onClick, hasNext) => {
    return (
      <div
        onClick={onClick}
        className="carousel-trigger next-btn disable-text-selection no-select"
        style={{
          // this style requires to prevent tippy to show up while sliding to next carousel
          opacity: hasNext ? "1" : "0",
          cursor: hasNext ? "pointer" : "default",
        }}
      >
        {hasNext && titleList.length > 0 && (
          <div className="btn-label">
            {currentItemIndex < titleList.length - 1 &&
              titleList[currentItemIndex + 1]}
          </div>
        )}
        <img alt="next-arrow" src={`/up_arrow.svg`} />
      </div>
    );
  };
  return (
    <CarouselStyle>
      <ReactCarousel
        style={{ height: "100vw", width: "100vw", display: "flex" }}
        renderArrowNext={NextArrow}
        renderArrowPrev={PrevArrow}
        showIndicators={false}
        showThumbs={false}
        showStatus={false}
        selectedItem={currentItemIndex}
        onChange={onChange}
      >
        {children}
      </ReactCarousel>
    </CarouselStyle>
  );
}

export default Carousel;

const CarouselStyle = styled.section`
  width: 100%;
  height: 100vh;
  position: relative;
  .item {
    width: 100%;
    height: 100vh;
    background: #044104;
  }

  .carousel-trigger {
    z-index: 200;
    height: 40px;
    width: fit-content;
    padding: 0 0.5rem;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--blue-theme);
    box-shadow: 0px 0px 2px rgba(29, 15, 15);
    top: 85%;
    transform: translateY(-50%);
    border-radius: 6px;
    /* padding: 0.6rem 0.2rem; */
    cursor: pointer;
    .btn-label {
      font-size: 1rem;
      font-weight: 500;
      color: #f6f8ed;
      width: 0;
      overflow: hidden;
      transition: all 100ms linear;
      padding: 0;
    }
    :hover {
      .btn-label {
        padding: 0 0.5rem;
        width: 110px;
      }
    }
    img {
      width: 100%;
      height: 70%;
      object-fit: contain;
    }
  }

  .prev-btn {
    left: 5px;
    img {
      transform: rotate(-90deg);
    }
    .btn-label {
      transform: translateX(-1.2rem);
    }
  }

  .next-btn {
    right: 5px;
    img {
      transform: rotate(90deg);
    }
  }

  @media screen and (max-height: 480px) {
    .carousel-trigger {
      height: 35px;
    }
  }
`;
