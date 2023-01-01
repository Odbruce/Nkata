import styled from '@emotion/styled'
import React, { useState } from 'react'
import {MdCallEnd} from "react-icons/md"

const VideoChat = () => {

    const [id,setId] = useState({user:"userstream",rep:"recipientstream"})

   
// startcall();
    const swicth = ()=>{}
      


  return (
    <Wrapper id="videoChat">
        <VideoScreen>
            <UserStream muted autoPlay playsInline  src="" alt="userCall" id={id.user}/>

            <RecipientStream autoPlay playsInline src="" alt="repCall" id={id.rep}/>

        </VideoScreen>
        <Button onClick={swicth}>
            <EndCall>
                <MdCallEnd/>
            </EndCall>
        </Button>
    </Wrapper>
  )
}

export default VideoChat

const Wrapper = styled.section`
background: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  display: none;
  flex-direction:column;
  align-items:center;
  top: 0;
  left: 0;
  justify-content:space-around;
  z-index:10;
`

const Button = styled.div`
width:70px;
height:70px;
background:red;
border-radius:50%;
display:flex;
justify-content:center;
align-items:center;
position:absolute;
bottom:5%;

`
const EndCall =styled.button`
font-size:24px;
background:none;
color:whitesmoke;
border:none;
`

const UserStream = styled.video`
width:min(100vw,600px);
height:80vh;
background:#272727;

@media(max-width:820px){
    height:100%;
    object-fit:cover;
}
`

const RecipientStream = styled.video`
width:max(20vw,150px);
height:300px;
background:red;
@media(max-width:820px){
    position:absolute;
    height:200px;
    bottom:25%;
    right:10%;
    object-fit:cover;
}
`
const VideoScreen = styled.div`
display:flex;
align-items:center;
justify-content:center;
gap:1rem;

@media(max-width:820px){
    position:absolute;
    right:0;
    top:0;
    left:0;
    height:100vh;
}
`