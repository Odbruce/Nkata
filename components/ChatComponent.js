import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import AddMediaToChat from "./AddMediaToChat";
import Messages from "./Messages";
import { BiImageAdd } from "react-icons/bi";
import { AiOutlineVideoCameraAdd,AiOutlineSend } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { ImAttachment,ImBin } from "react-icons/im";
import { MdOutlineKeyboardVoice,MdSend } from "react-icons/md";
import { BsEmojiSmileUpsideDown,BsStopCircleFill,BsFillPlayFill,BsThreeDots } from "react-icons/bs";
// import { BsThreeDots } from "react-icons/bs";
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
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { auth, db,storage } from "../firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import TimeAgo from "timeago-react";
import Image from "next/image";

const ChatComponent = ({ chat, recipient, messages }) => {
  
  const [error, setError] = useState(false);
  
  
  const [user] = useAuthState(auth);

  const route = useRouter();


  const inputHandle = (e)=>{
    const vid_display = document.getElementById('vidd');
    const img_display = document.getElementById('imgg');
    const inputVid = document.getElementById("video_chat")
  const inputImg = document.getElementById("img_chat")


    if(e.target.files[0].type.includes("video")){
      
      if(e.target.files[0].size>2000000){
          inputVid.value="";
          inputImg.value="";
          setError(true);
          
          setTimeout(() => {
            setError(false);
          }, 4000);
      }
      else{
        vid_display.src=URL.createObjectURL(e.target.files[0])
     document.getElementById("addMediaToChat").style.transform="scaleY(1) scaleX(1) translateY(0)";
    vid_display.alt=e.target.files[0].name;
    vid_display.style.display="initial";
    img_display.style.display="none"}
  }
  else{
    img_display.src=URL.createObjectURL(e.target.files[0]);
    document.getElementById("addMediaToChat").style.transform="scaleY(1) scaleX(1) translateY(0)";
    img_display.alt=e.target.files[0].name;
    img_display.style.display="initial";
    vid_display.style.display="none";
  }
  document.getElementById("attach").classList.remove("active")

  }

  const chatRef = collection(db, "chat");

  const [messageSnap] = useCollection(
    query(
      collection(chatRef, route.query.id, "message"),
      orderBy("posted", "asc")
    )
  );

  const getMessages = () => {
    if (messageSnap) {
      return messageSnap.docs.map((msg,index) => {
        if (msg.data().uid !== recipient?.uid) {

          return (
            <MsgWrapRight id={msg.id} key={index}>
              <Messages user={recipient?.uid} messages={{...msg.data(),posted:msg.data().posted?.toDate().getTime()}} />
              <p>
                {msg.data().posted?.toDate() ? (
                  <TimeAgo datetime={msg.data().posted?.toDate().getTime()} />
                ) : null}
              </p>
            </MsgWrapRight>
          );
        } else {
          return (
            <LeftWrap key={index}>
              <div className="msg_cont">
              <Image size={50} fill src={msg.data()?.photoURL} alt={msg.data()?.displayName} />
              </div>
              <MsgWrapLeft id={msg.id}>
                <Messages user={recipient?.uid} messages={{...msg.data(),posted:msg.data().posted.toDate().getTime()}} />
                <p>
                  {msg.data().posted?.toDate() ? (
                    <TimeAgo datetime={msg.data().posted?.toDate().getTime()} />
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
            <MsgWrapRight id={msg.id} key={index}>
              <Messages user={recipient?.uid} messages={msg} />
              <p>
                {msg.posted ? (
                  <TimeAgo datetime={msg.posted} />
                ) : null}
              </p>
            </MsgWrapRight>
          );
        } else {
          return (
            <LeftWrap  key={index}>
              <div className="msg_cont">
              <Image size={50} fill src={msg?.photoURL} alt={msg?.displayName} />
              </div>
              <MsgWrapLeft id={msg.id}>
                <Messages user={recipient?.uid} messages={msg} />
                <p>
                  {msg.posted ? (
                    <TimeAgo datetime={msg.posted} />
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

  const audio = useRef("")
  const audioData = useRef([])
  const audRef = useRef(null)


const [recordd,setRecord] = useState("")

const displayCount = ()=>{

  let countdown = 0;
  
  let countdownTimer = document.getElementById("counter");
  
  let timer = setInterval(function() {
    countdown++;
  
    if (countdown === 60) {
      clearInterval(timer);
    }
  
    let minutes = Math.floor(countdown / 60);
    let seconds = countdown % 60;
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    let clock = minutes + ":" + seconds;
  
    countdownTimer.innerHTML = clock;
  }, 1000);
}

  const record = ()=>{
    
    setRecord("recording");


    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(async (stream) => {
     
      const mediaRecorder = new MediaRecorder(stream,{mimeType: 'audio/mpeg'});
      audio.current = mediaRecorder;

      mediaRecorder.start();

      displayCount();

      setTimeout(()=>mediaRecorder.state!=="inactive"?mediaRecorder.stop():null,60000);
      
      
      mediaRecorder.ondataavailable = function(e) {
        if (e.data && e.data.size > 0) {
          audioData.current = e.data
        }
        const aud = window.URL.createObjectURL(e.data)
        setRecord("pending");
         audRef.current.src=aud;
      }

    

      console.log("recorder started");
      
      
    })
  }
const click = ()=>{
  return audio.current.stop()
}

const delVn = ()=>{
  setRecord("");
  return audRef.current.src="";
}

const sendVn = ()=>{

  const storageRef = ref(storage,`new vn ${serverTimestamp()}` );

  const uploadTask = uploadBytesResumable(storageRef, audioData.current);
  uploadTask.on("state_changed", null, null, () => {
    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {

      setDoc(
        doc(db, "users", user?.uid),
        {
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );

      await addDoc(collection(chatRef,route.query.id,"message"),{
        posted: serverTimestamp(),
        message: "",
        uid: user?.uid,
        photoURL: user?.photoURL,
        displayName: user?.displayName,
        url:downloadURL,
        fileName:"audio",
        type:audioData.current.type,
      }
      ).then((delVn()))

    })})
  

  return;
}

  return (
    <Wrapper>
       <ErrorWrap>
            <div className={`issuccessModal ${error ? "success" : null}`}>
              <h4>File too large.</h4>
              <div>
              <Image width={25} height={25} src="https://emojipedia-us.s3.amazonaws.com/source/microsoft-teams/337/unamused-face_1f612.png" alt="smiley"/>
              <p>Its a demo</p>
              </div>
            </div>
    </ErrorWrap>
      <ChatHeader>
        <ProfileWrap>
          <div>
            <IoIosArrowBack />
            <h6 onClick={() => route.push("/chat/_blank_")}>back</h6>
          </div>
          <ImgWrapper>
            <Image fill size={50} src={recipient?.photoURL} alt={recipient?.displayName} />
          </ImgWrapper>
          <p>
            last seen :{" "}
            {recipient?.lastSeen?.toDate() ? (
              <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
            ) : null}
          </p>
        </ProfileWrap>
        <ChatIcons>
          <BsThreeDots onClick={()=>document.getElementById("recipientID").classList.add("active")}/>
        </ChatIcons>
      </ChatHeader>
      <ChatDisplay>
        {getMessages()}
        <AddMediaToChat chatRef={chatRef} user={user} />
      </ChatDisplay>
      <InputWrapper>
        <MediaWrap id="attach">
          <label htmlFor="img_chat">
            <ImageAdd />
          </label>
          <input type="file" onChange={inputHandle} hidden accept="image/*" id="img_chat" />
          <label htmlFor="video_chat">
            <VideoAdd />
          </label>
          <input type="file" onChange={inputHandle} hidden accept="video/*" id="video_chat" />
        </MediaWrap>
        <ImAttachment
          onClick={() =>
            document.getElementById("attach").classList.toggle("active")
          }
        />
        <ChatForm onSubmit={sendMessage}>
          <input type="text" placeholder="write a message ..." name="" id="" />
          <button> <AiOutlineSend/></button>
        </ChatForm>
        <MdOutlineKeyboardVoice onClick={record} />
       { recordd&&<Recorded id="recordDisplay">
          { recordd==="recording"?<div>
            <MdOutlineKeyboardVoice />
            <p id="counter">0:00</p>
          </div>
          :null
        }
        <audio controls src="" style={{visibility:recordd==="pending"?"visible":"hidden"}} ref={audRef}></audio>


          <div >
              {recordd==="recording"&&<Stop id="stop" onClick={click} />
             
              }
              {recordd==="pending"?<ImBin onClick={delVn}/>:null}
              {recordd==="pending"?<MdSend onClick={sendVn}/>:null}
          </div>


        </Recorded>}
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
  border-right:1px solid grey;

  @media(max-width:820px){
    border-right:none;
  }
`;

const ErrorWrap = styled.div`
  .issuccessModal {
    position: fixed;
    font-family: "Segoe UI";
    font-size: clamp(9px, calc(7px + 0.5vw), 16px);
    letter-spacing: 1px;
    z-index: 5;
    right: 0;
    left: 0;
    top: 50px;
    opacity: 0;
    margin: 0 auto;
    width: max(20vw, 150px);
    background: whitesmoke;
    text-align: center;
    padding: 1vw;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    transition-property: opacity top;
    font-weight: 500;
    color: var(--font_pri);

    h4{
      text-align:start;
      font-size:14px;
    }
    p{
      font-size:10px;
    }


    div{
      display:flex;
      align-items:flex-end;
      gap:10px;
    }
  }

  .success {
    top: 10px;
    opacity: 1;
  }
`;


const Recorded = styled.div`
position:absolute;
padding:0 0.5rem;
top:0;
width:100%;
height:100%;
display:flex;
justify-content:space-between;
background:whitesmoke;

left:0;
align-items:center;

div{
  display:flex;
  width:80px;
  justify-content:space-between;
  align-items:center;

  p{
    font-size:12px;
  }
}

audio{
  visibility:hidden;
  height: var(--display_scrn);
  width:100%;
}
`

const Stop = styled(BsStopCircleFill)`
color:#d0342c;
`

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

  @media(min-width:830px){
    display:none;
  }
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

const VideoAdd = styled(AiOutlineVideoCameraAdd)`
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
  position:relative;
  

  input {
    border: none;
    padding: 0 2vw 0 0.4em;
    background: transparent;
    outline: none;
    font-family: "Segoe UI";
    width: 100%;
  }

  button{
    position:absolute;
    border:none;
    background:transparent;
    top:50%;
    transform:translateY(-25%);
    right:2%;
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

  p{
    font-size:14px;
  }

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
  background: linear-gradient(73deg, #861657, #ffa69e);
  color: whitesmoke;
  opacity: 0.7;
  p{
    font-size:14px;
  }

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
