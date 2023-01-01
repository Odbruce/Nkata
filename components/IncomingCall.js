import styled from "@emotion/styled";
import React from "react";

const IncomingCall = ({ msg }) => {
  const handle = (e) => {
    if (e.target.textContent === "accept") {
    }

    return;
  };

  return (
    <Wrapper>
      <p>{msg}</p>
      {/* <p>call from odera</p> */}
      <div>
        <button onClick={handle}>decline</button>
        <button onClick={handle}>accept</button>
      </div>
    </Wrapper>
  );
};

export default IncomingCall;

const Wrapper = styled.div`
  padding: 0.4rem;
  position: fixed;
  font-family: "Segoe UI";
  font-size: clamp(9px, calc(7px + 0.5vw), 16px);
  letter-spacing: 1px;
  z-index: 5;
  right: 0;
  left: 0;
  top: 20px;
  margin: 0 auto;
  background: whitesmoke;
  width: max(20vw, 150px);
  text-align: center;
  box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  transition-property: opacity top;

  p {
    font-size: 13px;
    margin-bottom: 0.5rem;
  }
  div {
    display: flex;
    justify-content: center;
    gap: 0.5rem;

    button {
      padding: 0.2rem;
    }

    button:nth-of-type(1) {
      background: transparent;
      border-color: transparent;
    }
  }
`;
