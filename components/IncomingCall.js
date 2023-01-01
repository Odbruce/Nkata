import styled from "@emotion/styled";
import { setDoc } from "firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const IncomingCall = ({ msg, localConn, localStream, recipient }) => {
  const [user] = useAuthState(auth);

  console.log(localStream);

  const handle = async (e) => {
    if (e.target.textContent === "accept") {
      const answer = await localConn.createAnswer();
      localConn.setLocalDescription(answer);
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: { facingMode: "user" } })
        .then(async (stream) => {
          document.getElementById("userstream").srcObject = stream;
        });
      await setDoc(
        doc(db, "users", recipient?.uid),
        {
          type: "answer",
          typeData: JSON.stringify(answer),
          from: user?.uid,
          fromName: user?.displayName,
        },
        { merge: true }
      );

      document.getElementById("videoChat").style.display = "flex";
      localConn.ontrack = (e) => {
        if (
          document.getElementById("recipientstream").srcObject !== e.streams[0]
        )
          document.getElementById("recipientstream").srcObject = e.streams[0];
      };
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
