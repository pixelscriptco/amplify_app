import React, { useState } from "react";
import styled from "styled-components";
import { CloseButton } from "../../Data/images/EnquireNowPopupSvgs";
import Price from "../Atoms/Price";
import { Select } from "antd";

const RadioInput = ({ label, value, checked, setter }) => {
  return (
    <div class="input-group">
      <label class="fake-radio-label">
        <input
          class="input-radio"
          type="radio"
          checked={checked == value}
          onChange={() => setter(value)}
        />{" "}
        <div class="fake-radio"></div>
        <span>{label}</span>
      </label>
    </div>
  );
};

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
const validateName = (name) => {
  console.log(name.match(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/));
  
  return name.match(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/);
};

function BookNow({ isOpen, setIsOpen, unitDetails, handleBooking }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const ref = React.useRef();

  const handleFormSubmit = (userDetails) => {
    handleBooking(unitDetails.id, userDetails);
  };

  if (!isOpen) return null;
  return (
    <Style onClick={(e) => setIsOpen(false)}>
      <div class={`${"form-wrapper svelte-tipeeb"}`} ref={ref}>
        <div class="background svelte-tipeeb"></div>{" "}
        <div class="content svelte-tipeeb" dir="">
          <div
            class="enquiry-form  svelte-tipeeb"
            onClick={(e) => e.stopPropagation()}
          >
            {" "}
            <h2 class="form-title svelte-tipeeb">Book Now</h2>{" "}
            <div
              onClick={(e) => {
                // e.preventDefault();
                // e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              class="close-popup svelte-tipeeb"
            >
              <CloseButton />
            </div>{" "}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsOpen(false);
                handleFormSubmit({
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  mobile:
                    document.getElementById("booking_form_phone_code").value +
                    phoneNumber,
                  flatId: unitDetails.id,
                });
              }}
            >
              <div class="description svelte-tipeeb">
                <div class="description-secondary boookkkk svelte-tipeeb">
                  <span class="svelte-tipeeb">
                    <span class="title svelte-tipeeb">Unit Number:</span>{" "}
                    {unitDetails?.name}
                  </span>{" "}
                  <span class="svelte-tipeeb">
                    <span class="title svelte-tipeeb">Unit Type:</span>{" "}
                    {unitDetails?.type}
                  </span>{" "}
                  <span class="svelte-tipeeb">
                    <span class="title svelte-tipeeb">Total Area:</span>{" "}
                    <span class="area svelte-wv78a7">{unitDetails?.area}</span>{" "}
                    <span class="area-change svelte-wv78a7">Sq. Ft.</span>
                  </span>{" "}
                  <span class="svelte-tipeeb">
                    <span class="title svelte-tipeeb">Total Cost:</span>{" "}
                    <Price price={unitDetails?.cost} />
                  </span>
                </div>
              </div>{" "}
              <div class="gender-group svelte-tipeeb">
              </div>{" "}
              <div class="form-row">
                <div class="input-group">
                  <label class="input-group-label">
                    <span>First Name</span>{" "}
                    <input
                      type="text"
                      regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
                      name="first_name"
                      placeholder=""
                      onChange={(e) => setFirstName(e.target.value)}
                      value={firstName}
                    />
                  </label>
                </div>{" "}
                <div class="input-group">
                  <label class="input-group-label">
                    <span>Last Name</span>{" "}
                    <input
                      type="text"
                      regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
                      name="last_name"
                      placeholder=""
                      onChange={(e) => setLastName(e.target.value)}
                      value={lastName}
                    />
                  </label>
                </div>
              </div>{" "}
              <div class="form-row">
                <div class="input-group">
                  <label>
                    <span>Email</span>{" "}
                    <input
                      name="email"
                      type="email"
                      placeholder=""
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                  </label>
                </div>{" "}
                <div class="input-group">
                  <label class="combo-input">
                    <span>Phone Number</span>
                    <div class="row">
                      <div class="code-input" style={{ marginRight: "5px" }}>
                        <select name="phone_code" id="booking_form_phone_code">
                          <option value="+91">+91</option>
                          <option value="+971">+971</option>
                          <option value="+973">+973</option>
                          <option value="+944">+944</option>
                        </select>
                      </div>{" "}
                      <div class="phone-input">
                        <input
                          type="text"
                          name="phone_number"
                          placeholder=""
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          value={phoneNumber}
                          style={{ marginTop: "7px" }}
                        />
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              <div class="form-row">
                <div class="input-group payment-info">
                  Please note that the Unit will be blocked for 48 hours. To confirm your
                  booking, please contact our Sales Team now.
                </div>
              </div>{" "}
              <div class="submit-btn svelte-tipeeb">
                <button
                  class={`button submit brook_now svelte-ynf51n ${
                    validateName(firstName) &&(lastName) &&
                    validateEmail(email) &&
                    phoneNumber.length === 10
                      ?"enabled"
                      : "disabled"
                  } `}
                  value=""
                  style={{ paddings: "5px 8px" }}
                >
                  Book Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Style>
  );
}

export default BookNow;

const Style = styled.div`
  .channel_partner_select {
    color: white;
    margin-top: 0.5rem;
    .ant-select-selector {
      background: var(--input_background);
      color: var(--color_back);
      border: var(--input_border);
      outline: none;
    }
    .anticon.anticon-down.ant-select-suffix {
      color: var(--color_back);
    }
  }

  .payment-info {
    font-size: 14px;
    color: #c4bfbf;
    line-height: 1.6;
  }

  .form-wrapper.svelte-tipeeb.svelte-tipeeb {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    display: flex;
    justify-content: center;
    padding: 20px;
    overflow: auto;
  }
  .background.svelte-tipeeb.svelte-tipeeb {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(47, 47, 47, 0.7);
    z-index: 1;
  }
  // popup
  input[type="text"]:-webkit-autofill,
  input[type="text"]:-webkit-autofill:hover,
  input[type="text"]:-webkit-autofill:focus,
  input[type="text"]:-webkit-autofill:active,
  input[type="number"]:-webkit-autofill,
  input[type="number"]:-webkit-autofill:hover,
  input[type="number"]:-webkit-autofill:focus,
  input[type="number"]:-webkit-autofill:active,
  input[type="email"]:-webkit-autofill,
  input[type="email"]:-webkit-autofill:hover,
  input[type="email"]:-webkit-autofill:focus,
  input[type="email"]:-webkit-autofill:active,
  input[type="password"]:-webkit-autofill,
  input[type="password"]:-webkit-autofill:hover,
  input[type="password"]:-webkit-autofill:focus,
  input[type="password"]:-webkit-autofill:active,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus,
  select:-webkit-autofill:active,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  textarea:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #2a2a2a inset !important;
    -webkit-text-fill-color: #bdbdbd !important;
    border: 1px solid #5f5f5f;
  }
  input[type="radio"]:checked + .fake-radio + span {
    color: var(--input_radio_checked_color);
  }
  input[type="radio"]:checked + .fake-radio {
    background-color: var(--input_radio_checked_bg);
  }

  input[type="radio"] + .fake-radio {
    width: 11px;
    height: 11px;
    background-color: transparent;
    border-radius: 50%;
    border: var(--input_radio_border);
    transition: var(--transition);
    margin-right: 5px;
  }
  .fake-radio,
  .fake-radio-image {
    display: inline-block;
    cursor: pointer;
  }
  .input-group input {
    margin-top: 5px;
  }

  input[type="radio"] {
    display: none;
  }
  .input-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  .input-group label {
    color: var(--input_label_text_color);
    position: relative;
  }
  label {
    color: var(--input_label_text_color);
    width: 100%;
  }
  label {
    display: block;
  }
  .clearfix:after,
  .container:after,
  .container-fluid:after,
  .row:after {
    clear: both;
  }

  .clearfix:before,
  .clearfix:after,
  .container:before,
  .container:after,
  .container-fluid:before,
  .container-fluid:after,
  .row:before,
  .row:after {
    display: table;
    content: " ";
  }
  .code-input::after {
    content: "";
    position: absolute;
    right: 6px;
    bottom: 14px;
    width: 0px;
    height: 0px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: var(--input_select_arrow_bg);
  }
  .enquiry-form .code-input select {
    padding: 8px 11px;
  }
  .code-input select {
    border-radius: 4px 0 0 4px;
  }
  input[type="text"],
  input[type="number"],
  input[type="email"],
  input[type="password"],
  select,
  textarea {
    background: var(--input_background);
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
  .phone-input {
    width: 100%;
  }

  .code-input {
    position: relative;
    min-width: 62px;
    border-radius: 4px;
    border: var(--input_border);
  }
  .clearfix:before,
  .clearfix:after,
  .container:before,
  .container:after,
  .container-fluid:before,
  .container-fluid:after,
  .row:before,
  .row:after {
    display: table;
    content: " ";
  }
  .row {
    display: flex;
    align-items: center;
  }
  .button.btn-success {
    background: var(--button_background_form);
    box-shadow: var(--button_shadow_form);
    color: var(--button_color_form);
  }
  .enquiry-form.svelte-tipeeb.svelte-tipeeb {
    position: relative;
    max-width: 691px;
    min-width: 391px;
    min-height: 283px;
    width: 100%;
    padding: 35px;
    background-color: var(--form_background);
    border-radius: 10px;
    font-size: 13px;
    pointer-events: all;
  }
  .content.svelte-tipeeb.svelte-tipeeb {
    position: relative;
    z-index: 200;
    margin: auto;
  }
  .form-title.svelte-tipeeb.svelte-tipeeb {
    margin-bottom: 25px;
    text-align: center;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 13px;
    color: var(--form_text_color);
  }
  .close-popup.svelte-tipeeb.svelte-tipeeb {
    position: absolute;
    top: 35px;
    right: 35px;
    cursor: pointer;
    z-index: 2;
    pointer-events: all;
  }
  .enquiry-form .close-popup svg {
    width: 14px;
    height: 14px;
  }

  .close-popup svg {
    width: 13px;
    height: 13px;
  }
  svg {
    width: 100%;
    height: 100%;
  }
  .enquiry-form .close-popup svg path {
    font-size: 14px;
  }

  //1st part of form
  .description.svelte-tipeeb.svelte-tipeeb {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    padding: 15px 20px;
    margin-bottom: 25px;
    color: var(--color_text);
    font-size: 13px;
    background: var(--input_background);
    border-radius: 4px;
  }
  .description-main.svelte-tipeeb.svelte-tipeeb {
    display: flex;
    align-items: flex-start;
    /* flex-direction: column; */
  }
  .description-main.svelte-tipeeb span.svelte-tipeeb:first-child {
    margin-top: 0;
  }
  .description-main.svelte-tipeeb span.svelte-tipeeb {
    margin-top: 7px;
  }
  .description-main.svelte-tipeeb span.svelte-tipeeb {
    margin-top: 7px;
  }
  .description-secondary.svelte-tipeeb.svelte-tipeeb {
    width: 100%;
    display: flex;
    align-items: space-between;
    justify-content: space-between;
    /* align-items: flex-end; */
    /* flex-direction: column; */
  }
  .description-secondary.svelte-tipeeb span.svelte-tipeeb:first-child {
    margin-top: 0;
  }

  .description-secondary.svelte-tipeeb span.svelte-tipeeb:first-child {
    margin-top: 0;
  }

  .description-secondary.svelte-tipeeb span.title.svelte-tipeeb {
    color: #7f7f7f;
  }

  .area-change.svelte-wv78a7 {
    cursor: pointer;
  }
  .description-secondary.svelte-tipeeb span.svelte-tipeeb:first-child {
    margin-top: 0;
  }

  .description-secondary.svelte-tipeeb span.title.svelte-tipeeb {
    color: #7f7f7f;
  }

  //2nd part of form
  .gender-group.svelte-tipeeb.svelte-tipeeb {
    display: flex;
  }
  .gender-group.svelte-tipeeb .input-group {
    width: auto;
  }

  .input-group:not(:last-child) {
    margin-right: 25px;
  }
  .input-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  .input-group label {
    color: var(--input_label_text_color);
    position: relative;
  }

  .fake-radio-label,
  .fake-radio-image-label {
    cursor: pointer;
  }
  label {
    color: var(--input_label_text_color);
    width: 100%;
  }
  label {
    color: var(--input_label_text_color);
    width: 100%;
  }
  label {
    display: block;
  }
  .input-group input {
    margin-top: 5px;
  }

  input[type="radio"] {
    display: none;
  }
  input {
    border: 0;
    border-radius: 0;
    width: 100%;
    outline: 0;
    margin: 0;
  }
  input {
    border: 0;
    border-radius: 0;
    width: 100%;
    outline: 0;
    margin: 0;
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
  input[type="radio"]:checked + .fake-radio {
    background-color: var(--input_radio_checked_bg);
  }

  input[type="radio"] + .fake-radio {
    width: 11px;
    height: 11px;
    background-color: transparent;
    border-radius: 50%;
    border: var(--input_radio_border);
    transition: var(--transition);
    margin-right: 5px;
  }
  .fake-radio,
  .fake-radio-image {
    display: inline-block;
    cursor: pointer;
  }
  input[type="radio"]:checked + .fake-radio + span {
    color: var(--input_radio_checked_color);
  }
  .gender-group.svelte-tipeeb .input-group {
    width: auto;
  }

  .input-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  .input-group label {
    color: var(--input_label_text_color);
    position: relative;
  }

  .fake-radio-label,
  .fake-radio-image-label {
    cursor: pointer;
  }
  label {
    color: var(--input_label_text_color);
    width: 100%;
  }
  label {
    color: var(--input_label_text_color);
    width: 100%;
  }
  label {
    display: block;
  }
  .input-group input {
    margin-top: 5px;
  }

  input[type="radio"] {
    display: none;
  }
  input[type="radio"] + .fake-radio {
    width: 11px;
    height: 11px;
    background-color: transparent;
    border-radius: 50%;
    border: var(--input_radio_border);
    transition: var(--transition);
    margin-right: 5px;
  }

  .fake-radio,
  .fake-radio-image {
    display: inline-block;
    cursor: pointer;
  }

  .form-row {
    display: flex;
    flex-direction: row;
  }
  .input-group:not(:last-child) {
    margin-right: 25px;
  }

  .input-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
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
    background: var(--input_background);
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
  .select-input {
    position: relative;
  }
  input[type="text"],
  input[type="number"],
  input[type="email"],
  input[type="password"],
  select,
  textarea {
    background: var(--input_background);
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

  select {
    border: 0;
    border-radius: 0;
    width: 100%;
    outline: 0;
    margin: 0;
  }
  select {
    border-radius: 4px;
    border: 1px solid #5f5f5f;
  }
  select {
    border: 0;
    border-radius: 0;
    width: 100%;
    outline: 0;
    margin: 0;
  }
  .select-input::after {
    content: "";
    position: absolute;
    right: 14px;
    bottom: 14px;
    width: 0px;
    height: 0px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: var(--input_select_arrow_bg);
  }
  .submit-btn.svelte-tipeeb.svelte-tipeeb {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
  .button.submit.disabled {
    background: var(--button_submit_disabled_bg);
    color: var(--button_submit_disabled_color);
  }

  .submit-btn.svelte-tipeeb button {
    max-width: 180px;
    padding: 14px;
  }
  .button.disabled {
    background: var(--button_background_disabled);
    box-shadow: var(--button_shadow_disabled);
    color: var(--button_color_disabled);
    cursor: default;
    pointer-events: none;
  }
  .button.submit.enabled {
    background: var(--blue-theme);
    color: #fdfafa;
  }
  .button:last-child {
    margin-bottom: 0;
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
  button {
    border: 0;
    border-radius: 0;
    padding: 5px 10px;
    background-color: #006fff;
    color: #fff;
    flex-shrink: 0;
    cursor: pointer;
    margin: 0;
    /* font-size: 1.2rem; */
  }
  /* element.style {
    --paddings: 5px 8px;
} */
`;
