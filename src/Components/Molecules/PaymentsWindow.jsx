import { Modal } from "antd";
import React from "react";
import styled from "styled-components";

function PaymentsWindow({
  showPaymentsPopup,
  setShowPaymentsPopup,

  flat,
}) {
  return (
    <Style>
      {showPaymentsPopup && (
        <div
          id="payment-popup"
          style={{
            display: showPaymentsPopup ? "flex" : "none",
          }}
        >
          <Modal
            title={`Payment for ${flat.id}`}
            visible={showPaymentsPopup}
            footer={false}
            onCancel={() => setShowPaymentsPopup(false)}
            style={{ top: "5vh", maxWidth: "100vw" }}
            wrapClassName="payment-modal"
          >
            <div
              style={{
                maxHeight: "80vh",
                overflowY: "auto",
              }}
              id="payment-body"
            />
          </Modal>
        </div>
      )}
    </Style>
  );
}

export default PaymentsWindow;

const Style = styled.div``;
