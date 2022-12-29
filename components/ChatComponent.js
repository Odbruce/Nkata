import React from "react";
import styled from "@emotion/styled";
import AddMediaToChat from "./AddMediaToChat";
import Messages from "./Messages";
import { BiImageAdd } from "react-icons/bi";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { ImAttachment } from "react-icons/im";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { BsEmojiSmileUpsideDown } from "react-icons/bs";
import { BsThreeDots } from "react-icons/bs";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import TimeAgo from "timeago-react";
import Image from "next/image";

const ChatComponent = ({ chat, recipient, messages }) => {
  const [user] = useAuthState(auth);
  const route = useRouter();

  const chatRef = collection(db, "chat");

  const [messageSnap] = useCollection(
    query(
      collection(chatRef, route.query.id, "message"),
      orderBy("posted", "asc")
    )
  );

  console.log(messageSnap);
  const getMessages = () => {
    if (messageSnap) {
      return messageSnap.docs.map((msg,index) => {
        if (msg.data().uid !== recipient?.uid) {
          return (
            <MsgWrapRight key={index}>
              <Messages user={recipient.uid} messages={msg.data()} />
              <p>
                {msg.data().posted?.toDate() ? (
                  <TimeAgo datetime={msg.data().posted?.toDate()} />
                ) : null}
              </p>
            </MsgWrapRight>
          );
        } else {
          return (
            <LeftWrap key={index}>
              <div className="msg_cont">
              <Image fill src={msg.data().photoURL} alt={msg.data().displayName} />
              </div>
              <MsgWrapLeft>
                <Messages user={recipient.uid} messages={msg.data()} />
                <p>
                  {msg.data().posted?.toDate() ? (
                    <TimeAgo datetime={msg.data().posted?.toDate()} />
                  ) : null}
                </p>
              </MsgWrapLeft>
            </LeftWrap>
          );
        }
      });
    } else {
      return JSON.parse(messages).map((msg,index) => {
        if (msg.uid !== recipient?.uid) {
          return (
            <MsgWrapRight key={index}>
              <Messages user={recipient.uid} messages={msg} />
              <p>
                {msg.posted?.toDate() ? (
                  <TimeAgo datetime={msg.posted?.toDate()} />
                ) : null}
              </p>
            </MsgWrapRight>
          );
        } else {
          return (
            <LeftWrap key={index}>
              <div className="msg_cont">
              <Image fill src={msg.photoURL} alt={msg.displayName} />
              </div>
              <MsgWrapLeft>
                <Messages user={recipient.uid} messages={msg} />
                <p>
                  {msg.posted?.toDate() ? (
                    <TimeAgo datetime={msg.posted?.toDate()} />
                  ) : null}
                </p>
              </MsgWrapLeft>
            </LeftWrap>
          );
        }
      });
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    setDoc(
      doc(db, "users", user?.uid),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );

    await addDoc(collection(chatRef, route.query.id, "message"), {
      posted: serverTimestamp(),
      message: e.target[0].value,
      uid: user?.uid,
      photoURL: user?.photoURL,
      displayName: user?.displayName,
      type: "text",
    }).then((e.target[0].value = ""));
  };

  return (
    <Wrapper>
      <ChatHeader>
        <ProfileWrap>
          <div>
            <IoIosArrowBack />
            <h6 onClick={() => route.push("/chat/_blank_")}>back</h6>
          </div>
          <ImgWrapper>
            <Image fill src={recipient?.photoURL} alt={recipient?.displayName} />
          </ImgWrapper>
          <p>
            last seen :{" "}
            {recipient?.lastSeen?.toDate() ? (
              <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
            ) : null}
          </p>
        </ProfileWrap>
        <ChatIcons>
          <BsThreeDots />
        </ChatIcons>
      </ChatHeader>
      <ChatDisplay>
        {getMessages()}
        <AddMediaToChat />
      </ChatDisplay>
      <InputWrapper>
        <MediaWrap id="attach">
          <label htmlFor="img_chat">
            <ImageAdd />
          </label>
          <input type="file" hidden accept="image/*" id="img_chat" />
          <label htmlFor="video_chat">
            <VideoaAdd />
          </label>
          <input type="file" hidden accept="video/*" id="video_chat" />
        </MediaWrap>
        <ImAttachment
          onClick={() =>
            document.getElementById("attach").classList.toggle("active")
          }
        />
        <ChatForm onSubmit={sendMessage}>
          <input type="text" placeholder="write a message ..." name="" id="" />
          <button hidden></button>
        </ChatForm>
        <BsEmojiSmileUpsideDown />
        <MdOutlineKeyboardVoice />
      </InputWrapper>
    </Wrapper>
  );
};

export default ChatComponent;

const Wrapper = styled.section`
  height: 100vh;
  flex: 2;
  position: sticky;
  top: 0;
`;
const ChatHeader = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 1rem;
  height: var(--display_nav);
`;

const ProfileWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  div:nth-of-type(1) {
    display: flex;

    h6 {
      cursor: pointer;
    }

    @media (min-width: 820px) {
      display: none;
    }
  }

  p {
    font-size: 9px;
    color: grey;
    letter-spacing: 0.5px;
    font-family: "segoe UI";
    align-self: flex-end;
  }
`;
const ImgWrapper = styled.div`
  height: calc(var(--display_nav) - 0.6rem);
  aspect-ratio: 1/1;
  border-radius: 50%;
  padding: 2px;
  border: 2px solid purple;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position:relative;

  img{
    object-fit: cover;
    height: calc(40px - 0.6rem);
    aspect-ratio: 1/1;
    border-radius: 50%;
    background: grey;
  }
`;
const ChatIcons = styled.div`
  display: flex;
`;
const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.1em 0.3em;
  position: sticky;
  bottom: 0;
  height: var(--display_scrn);
  font-size: clamp(12px, calc(8px + 2vw), 20px);

  .active {
    transform: scaleX(1) scaleY(1);
    opacity: 1;
  }
  `;
  const MediaWrap = styled.div`
  position: absolute;
  top: -60px;
  transition: 0.5s;
  transform-origin: left bottom;
  width: 100px;
  height: 60px;
  background: whitesmoke;
  font-size: 25px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.3em;
  border-radius: 45px;
  background: linear-gradient(145deg, #f5f5f5, #cecece);
  box-shadow: 5px 5px 20px #b9b9b9, -5px -5px 20px #ffffff;
  transform: scaleX(0) scaleY(0);
  opacity: 0;
`;

const VideoaAdd = styled(AiOutlineVideoCameraAdd)`
  cursor: pointer;
  transition: 0.2s;
  transition-property: transform;
  :hover {
    transform: translateY(-10%) scale(1.1);
  }
`;

const ImageAdd = styled(BiImageAdd)`
  cursor: pointer;
  transition: 0.2s;
  transition-property: transform;
  :hover {
    transform: translateY(-10%) scale(1.1);
  }
`;

const ChatForm = styled.form`
  width: 90%;
  display: flex;
  height: 100%;

  input {
    border: none;
    padding: 0 0.4em;
    background: transparent;
    outline: none;
    font-family: "Segoe UI";
    width: 100%;
  }
`;
const ChatDisplay = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem 0rem 1rem;
  height: calc(100% - calc(var(--display_scrn) + var(--display_nav)));
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  overflow: auto;
  scrollbar-width: none;
  background: rgba(0, 0, 0, 0.1);
  &::-webkit-scrollbar {
    display: none;
  }
`;

const MsgWrap = styled.div`
  width: fit-content;
  max-width: 60%;
  word-break: break;
  border-radius: 5px;
  padding: 0.3em;
  position: relative;
  margin-bottom: 1.2rem;
`;

const LeftWrap = styled.div`
  display: flex;
  align-items: center;

  .msg_cont{
    width: calc(var(--display_nav) - 1rem);
    height:calc(var(--display_nav) - 1rem);
    position:relative;
    border-radius: 50%;
    margin-right: 0.5rem;


    img {
      border-radius: 50%;
      object-fit: cover;
      background: black;
    }
  }

`;
const MsgWrapLeft = styled(MsgWrap)`
  background: #979797;
  color: #272727;
  position: relative;

  p:nth-of-type(2) {
    position: absolute;
    bottom: -1.3em;
    font-size: 11px;
    left: 0;
    min-width: 100px;
  }
`;

const MsgWrapRight = styled(MsgWrap)`
  align-self: flex-end;
  background: rgb(128, 0, 128, 0.8);
  background: black;
  background: linear-gradient(73deg, #861657, #ffa69e);
  color: whitesmoke;
  opacity: 0.7;

  p:nth-of-type(2) {
    min-width: 100px;
    text-align: end;
    position: absolute;
    bottom: -1.3em;
    color: #272727;
    font-size: 11px;
    right: 0;
  }
`;

const MsgWrapDate = styled(MsgWrap)`
  background: rgba(0, 0, 0, 0.2);
  align-self: center;
`;
