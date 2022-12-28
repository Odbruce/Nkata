import styled from "@emotion/styled";
import React from "react";

const Messages = ({chat,messages}) => {

  console.log(messages)
  return (
    <>
    <p>
     {messages?.message}
      {/* Messages ... wjkd Lorem, ipsum dolor sit amet consectetur adipisicing
      elit. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident? */}
    </p>
    </>
  );
};

export default Messages;

