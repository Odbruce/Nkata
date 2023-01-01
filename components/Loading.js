import styled from "@emotion/styled";
import React from "react";

const Loading = () => {
  return (
    <Wrapper>
      <div>
        <h1>{'NK\u00C1T\u00C0'}</h1>
      </div>
    </Wrapper>
  );
};

export default Loading;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #272727;

  h1 {
    font-size: 65px;
    letter-spacing: 7px;
    color: whitesmoke;
  }
`;
