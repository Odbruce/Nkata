import React from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Story from "./Story";
import AddStory from "./AddStory";
import styled from "@emotion/styled";
import UploadStory from "./UploadStory";

const Status = ({ userUid }) => {
  const acceptedFriends = query(
    collection(db, "chat"),
    where("user", "array-contains", userUid),
    where("request", "==", "accepted")
  );
  const [acceptedFriendsSnap] = useCollection(acceptedFriends);

  return (
    <>
      <InputStoryWrap id="status">
        <UploadStory />
      </InputStoryWrap>
        <AddStory user={userUid}/>
      {acceptedFriendsSnap?.docs.map((frd) => {
        const uid = frd.data().user.filter((item) => item !== userUid)[0];
        return <Story key={frd.id} uid={uid} />;
      })}
    </>
  );
};

export default Status;

const InputStoryWrap = styled.section`
  background: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  display: none;
  justify-content: center;
  backdrop-filter: blur(3px);
  top: 0;
  left: 0;
  z-index: 10;
`;
