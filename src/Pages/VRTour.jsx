import React, { useState, useEffect, useReducer, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Carousel from "../Components/Molecules/Carousel";
import { useInventories, useLandmark } from "../Hooks";
import Flat from "../Components/Molecules/Flat";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import FloorSelector from "../Components/Molecules/FloorSelector";
import ApartmentsDetails from "../Components/Molecules/ApartmentsDetails";
import Compass from "../Components/Atoms/Compass";
import IconButton from "../Components/Atoms/IconButton";
import { FullScreenIcon } from "../Icons";
import { getCombinedTowerName, toggleFullScreen } from "../Utility/function";
import Navigator from "../Components/Molecules/Navigator";
import { BOOKING_MODES, TOWERS, VR_TOUR_LINKS } from "../Data";
import Zoomable from "../Components/Molecules/Zoomable";
import { useBookings } from "../Hooks/booking";
// import { createOrder } from "../APIs/cashfree";
import { cashfreeSandbox } from "cashfree-dropjs";
import { message, Modal } from "antd";
import Loading from "../Components/Atoms/Loading";
import ReturnToPrev from "../Components/Atoms/ReturnToPrev";
import PaymentsWindow from "../Components/Molecules/PaymentsWindow";

function VRTour() {
  const { floor, tower, unit: unit_str } = useParams();
  const { getAllFlatsInFloor } = useInventories();
  const flats = getAllFlatsInFloor(tower, floor);
  const [currentFlatIndex, setCurrentFlatIndex] = useState(
    flats.findIndex((flat) => flat["FlatNumber"] == unit_str)
  );

  const { fetchInventories } = useInventories();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const paymentWrapperref = useRef();
  const { saveUserToDB } = useBookings();

  const [showPaymentsPopup, setShowPaymentsPopup] = useState(false);
  const [showVRTour, setShowVRTour] = useState(false);

  const handleBooking = async (flatId, userDetails) => {
    // const paymentId = "885594491";
    // const orderId = "order_2244182Eo24wxkRsyeBzKENw2uWSkM1lR";

    try {
      userDetails.mode = BOOKING_MODES.ONLINE;
      setLoading(true);

      const { mobile: phone, firstName, lastName, email } = userDetails;

      const user_id = await saveUserToDB(userDetails);

    //   const order_response = await createOrder(flatId, {
    //     name: firstName + " " + lastName,
    //     email,
    //     customer_id: user_id,
    //     phone,
    //   });

    //   if (!order_response) {
    //     setLoading(false);
    //     return;
    //   }

      setShowPaymentsPopup(true);
      // window.location.replace(order_response.payment_link);

      await saveUserToDB(userDetails);

    //   const { orderToken } = order_response;

      let testCashfree = new cashfreeSandbox.Cashfree();

      const dropConfig = {
        components: [
          "order-details",
          "card",
          "netbanking",
          "app",
          "upi",
          "paylater",
          "credicardemi",
          "cardlessemi",
        ],
        // orderToken,
        onSuccess: function (data) {
          message.success("Payment Successful");
          setShowPaymentsPopup(false);
          const paymentId = data.transaction.transactionId;
          const orderId = data.order.orderId;
          fetchInventories();
          navigate(
            `/smart-world/tower/${tower}/floor/${floor}/unit/${flatId}/payment-success/${orderId}/${paymentId}`
          );

          //on payment flow complete
        },
        onFailure: function (data) {
          console.log("onFailure", data);
          if (data?.order?.errorText) message.error(data.order.errorText);
          //on failure during payment initiation
        },
        style: {
          //to be replaced by the desired values
          backgroundColor: "#ffffff",
          color: "#11385b",
          fontFamily: "Lato",
          fontSize: "14px",
          errorColor: "#ff0000",
          theme: "light", //(or dark)
        },
      };

      setLoading(false);
      testCashfree.initialiseDropin(
        document.getElementById("payment-body"),
        dropConfig
      );
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <CarouselPageStyle>
      {loading && <Loading />}
      <PaymentsWindow
        flat={flats[currentFlatIndex]}
        setShowPaymentsPopup={setShowPaymentsPopup}
        showPaymentsPopup={showPaymentsPopup}
      />

      <div className="vr-tour">
        <iframe
          src={VR_TOUR_LINKS[flats[currentFlatIndex].UnitType]}
          allowFullScreen={true}
          width={"100%"}
          height={"100%"}
          title={"VR Tour"}
        />
      </div>

      <Navigator
        className="navigator"
        prevPages={[
          // { title: "Delhi", path: "" },
          // {
          //   title: "Dwarka Expressway",
          //   path: "",
          // },
          {
            title: `Tower ${TOWERS[tower].title}`,
            path: `/smart-world/tower/${getCombinedTowerName(tower)}`,
          },
          {
            title: `Floor ${floor}`,
            path: `/smart-world/tower/${tower}/floor/${floor}`,
          },
          {
            title: `Apartment ${flats[currentFlatIndex].FlatNumber}`,
            path: `/smart-world/tower/${tower}/floor/${floor}/unit/${flats[currentFlatIndex].id}`,
          },
        ]}
        currentPage={{
          title: `VR Tour`,
        }}
      />
      <ReturnToPrev
        text="Return To Apartment Plan"
        to={`/smart-world/tower/${tower}/floor/${floor}/unit/${flats[currentFlatIndex].id}`}
      />

      <div className="compass-fullscreen-wrapper absolute bottom right flex row">
        <div className="col flex j-end">
          <Compass />
        </div>
        <div className="col w-space flex j-end">
          <IconButton
            icon={FullScreenIcon}
            tooltip="Fullscreen"
            activeTooltip="Close Fullscreen"
            onClick={() => toggleFullScreen()}
          />
        </div>
      </div>
      <ApartmentsDetails
        onVRClick={() => setShowVRTour(true)}
        selectedUnit={flats[currentFlatIndex]}
        handleBooking={handleBooking}
      />
    </CarouselPageStyle>
  );
}

export default VRTour;

const CarouselPageStyle = styled.section`
  background: rgb(48, 41, 32);
  background: linear-gradient(
    68deg,
    rgba(48, 41, 32, 1) 0%,
    rgba(124, 111, 91, 1) 15%,
    rgba(138, 124, 102, 1) 25%,
    rgba(134, 121, 99, 1) 32%,
    rgba(121, 109, 90, 1) 45%,
    rgba(92, 86, 74, 1) 100%
  );
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;

  .interface--col.svelte-9mhvmf.svelte-9mhvmf {
    left: 2rem !important;
    top: 7rem !important;
  }

  #return-to-tower {
    left: 25% !important;
    top: unset !important;
    bottom: 2rem !important;
    width: fit-content !important;
    min-width: unset !important;
    padding: 0.5rem 1rem !important;
    font-size: 12px !important;
    margin: 0 !important;
  }

  .navigator {
    position: absolute;
    top: 0rem;
    left: 0rem;
    margin: 2rem;
  }
  .compass-fullscreen-wrapper {
    padding: 1rem;
    padding-right: 2rem;
  }

  .vr-tour {
    height: 100vh;
    width: 100%;
  }

  #payment-popup {
    /* position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 900;
    background: #3a373761; */
    /* display: flex; */
    /* justify-content: center; */
    /* align-items: center; */
    /* padding: 2rem; */
    iframe {
      max-width: 600px;
    }
  }
`;
