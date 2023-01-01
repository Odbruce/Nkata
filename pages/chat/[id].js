import Head from "next/head";
import styled from "@emotion/styled"
import ChatComponent from "../../components/ChatComponent"
import SideBar from "../../components/SideBar"
import RecipientProfile from "../../components/RecipientProfile"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../../firebase";
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import VideoChat from "../../components/VideoChat";
import { useEffect, useRef, useState } from "react";
import IncomingCall from "../../components/IncomingCall";


const Chat = ({chat,messages}) => {
  const [user] = useAuthState(auth);
  const recipientId = (prop)=>{
    return chat?.user?.find((item)=>item!==prop?.uid)
   }
  // const [localConn,setLocalConn] = useState("");
  const localConn = useRef("");
  const localStream = useRef("");
  const [callOffer,setCallOffer] = useState("");
  const [callmsg,setCallMsg] = useState("");


console.log(localConn)

const incoming = (msg)=>{
  return setCallMsg(msg);
}

  const handleCall =(msg)=>{
    console.log(`Message: ${msg?.type}`);
  console.log(localConn.current.setRemoteDescription);
  switch (msg?.type) {
    case "offer":
      navigator.mediaDevices.getUserMedia({ audio: true,  video: { facingMode: "user" } })
      .then(async (stream) => {
        localStream.current=stream;
        localConn.current.addStream(stream)
      })
      // Set the remote descp
      localConn.current.setRemoteDescription(new RTCSessionDescription(JSON.parse(msg?.typeData)));

      localConn.onicecandidate = function(event){
        if(event.candidate){
            setDoc(doc(db,"users",msg?.from),{
              type:"candidate",
              typeData:JSON.stringify(event.candidate),
              from:user?.uid,
              fromName:user?.displayName
            },{merge:true})
        }
        }

        localConn.ontrack = (e)=>{
          if(document.getElementById("recipientstream").srcObject!==e.streams[0]){
            document.getElementById("recipientstream").srcObject=e.streams[0]
          }
        }

      //display call
          incoming(`incoming call from ${msg?.fromName}`)



      // Create an answer
      // localConn.createAnswer().then((answer) => {
      //   console.log(`Answer: ${answer.sdp}`);
      //   // Set the local description
      //   localConn.setLocalDescription(answer).then(() => {
      //     // Send the answer to the other peer
      //     sendMessage(roomId, {
      //       type: "answer",
      //       sdp: answer.sdp,
      //     });
      //   });
      // });
      break;
    case "answer":
      // Set the remote description
      localConn.setRemoteDescription(new RTCSessionDescription(JSON.parse(msg?.typeData)));
      break;
    case "candidate":
      // Add the ICE candidate
      localConn.addIceCandidate(new RTCIceCandidate(JSON.parse(msg?.typeData))).catch((error) => {
        console.error(error);
      });
      break;
  }
  }

  useEffect(()=>{
    onSnapshot(doc(db,"users",user?.uid),(snap)=>{
      console.log(snap.data())
      return handleCall(snap.data())
    })
  },[])

  useEffect(()=>{
    const config = {
      iceServers:[{urls:"stun:stun2.1.google.com:19302"}]
    }
    const conn = new RTCPeerConnection(config);
    localConn.current = conn;
  },[])



  const userDetails = useDocument(doc(db,"users",recipientId(user)||"a"))

  const route = useRouter();

  


  return (
    <>
    <Head>
        <title>chat with {userDetails[0]?.data()?.displayName}</title>
        <meta name="description" content="Chat your experience" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <Wrapper>
      {callmsg&&<IncomingCall localConn={localConn.current} localStream={localStream.current} recipient={userDetails[0]?.data()} msg={callmsg}/>}
        <VideoChat />
        <SideBar messages={messages} />
        <ChatDisplayWrap display={route.query.id}>
         {recipientId(user)&&<>
            <ChatComponent chat={chat} recipient={userDetails[0]?.data()} messages={messages} />
             <RecipientProfile chat={chat} localConn={localConn.current}  recipient={userDetails[0]?.data()} messages={messages} />
            </> 
            }
            </ChatDisplayWrap>
    </Wrapper>
    </>
  )
}

export default Chat;

export async function getServerSideProps(context){

    const ref = collection(db,"chat");
    const messageRef = await getDocs(query(collection(ref,context.query.id,"message"),orderBy("posted","asc")));
    
    const messages = messageRef.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
    })).map((msg=>({
        ...msg,
        posted:msg.posted.toDate().getTime(),
    })))

 


    const chatRef = await getDoc(doc(ref,context.query.id));
    const chat = {
        uid:chatRef.id,
        ...chatRef.data()
    }

   
    return {
        props:{
            messages:JSON.stringify(messages),
            chat:chat,
        }
    }
}






const Wrapper = styled.section`
display:flex;
position:relative;
`

const ChatDisplayWrap = styled.section`
display:flex;
flex: 3;
over-flow:hidden;

@media (max-width: 820px) {
    display: ${(prop) => (prop.display === "_blank_" ? "none" : null)};
  }
`