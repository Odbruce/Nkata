import styled from "@emotion/styled";
import Image from "next/image";
import React, { useEffect, useRef } from "react";

const Messages = ({chat,messages}) => {
const msgRef = useRef(null)
const options = {
  // dateStyle: 'short',
  // timeStyle: 'full',
  hour12: true,
  day: 'numeric',
  // month: 'long',
  // year: '2-digit',
  hour: "2-digit",
  minute: '2-digit',
  // second: '2-digit',
};

const date = new Date(messages?.posted);
const currentDate = new Date()


// console.log("posted:",new Intl.DateTimeFormat('en-US',options).format(date),"today",new Intl.DateTimeFormat('en-US',options).format(currentDate))
useEffect(()=>{
msgRef.current?.scrollIntoView({behavior:"smooth"})
},[messages])

if(messages?.type?.includes("video")){
  return<>
  <MediaWrap>
   <video
   autoPlay
   playsInline
   loop
      controls
    >
      <source type="video/mp4" src={messages?.url} />
      your brower doesnt support html video
      </video>
  </MediaWrap>
  <p ref={msgRef}>{messages?.message}</p>
  </>
}
if(messages?.type?.includes("image")){
  return<>
  <MediaWrap>
  <a download={'NK\u00C1T\u00C0_custom.jpg'} href={messages?.url} title={messages?.fileName}>
   <Image width={300} height={300} src={messages?.url} alt={messages?.fileName}   />
    </a>
  </MediaWrap>
  <p ref={msgRef}>{messages?.message}</p>
  </>
}
  return (
    <>
 
    <p ref={msgRef}>
     {messages?.message}
     
    </p>
    </>
  );
};

export default Messages;

const MediaWrap=styled.div`


video{
  width:100%;
}
img{
  width:100%;
  height:100%;
  object-fit:cover;
}
`