import styled from "@emotion/styled";
import Image from "next/image";
import React from "react";
import { RiSendPlaneFill } from "react-icons/ri";

const AddMediaToChat = () => {
  const handled = () => {};

  return (
    <Wrapper>
      <Image fill src="" alt="" />
      <form onSubmit={handled}>
        <input type="text" name="" id="up_text" />
        <label htmlFor="up_text">
          <RiSendPlaneFill />
        </label>
      </form>
    </Wrapper>
  );
};

export default AddMediaToChat;

const Wrapper = styled.div`
  height: min(100vh, 450px);
  transform-origin: center bottom;
  transform: scaleY(0) scaleX(0) translateY(10%);
  transition: 0.4s;
  width: 100vw;
  max-width: 400px;
  background: red;
  position: absolute;
  margin: 0 auto;
  left: 0;
  right: 0;
  border-radius: 45px;
  background: linear-gradient(145deg, #f5f5f5, #cecece);
  box-shadow: 5px 5px 20px #b9b9b9, -5px -5px 20px #ffffff;

  img {
    width: 100%;
    height: 100%;
    background: #272727;
    object-fit: cover;
  }
  form {
    height: 30px;
    width: 100%;
    left: 0;
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    background: whitesmoke;
    padding: 0.1em 0.4em;

    input {
      background: none;
      width: 100%;
      height: 100%;
      outline: none;
      border: none;
      padding: 0.1em 0.3em;
      letter-spacing: 1px;
    }
  }
`;
