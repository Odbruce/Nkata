import styled from "@emotion/styled";
import {keyframes} from "@emotion/react"
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import StatusPost from "../pages/StatusPost";


const DisplayStatus = ({set,uid}) => {

  const [user] =  useAuthState(auth);
  const ref = collection(db,"users");
  const colRef = query(collection(ref,(uid||user.uid),"status"),orderBy("posted","asc"));

  const [snap] =  useCollection(colRef)

  return (
    <Wrap>
    <Wrapper>
      {
        snap?.docs.map((post,index)=>{
          return <StatusPost key={post.id} id={post.id} prop={{index,user,uid,length:snap?.docs.length}} set={set} data={post.data()}/>
        })
      }
      <StatusProgress>
        
         { snap?.docs.map((post,index)=>{
          return <Div key={index} count={index}></Div>
         })
        }
        
      </StatusProgress>
     
    </Wrapper>
    </Wrap>
  );
};

export default DisplayStatus;

const Wrapper = styled.div`
  overflow:hidden;
  width:100vw;
  max-width:600px;
  display: grid;
  grid-auto-columns: 100%;
  position:relative;
  grid-auto-flow: column;
 
`;

const track = keyframes`
to{
  width:100%;
}

`

const StatusProgress = styled.div`
position:absolute;
top:70px;
height:1px;
width:100%;
z-index:10;
display:flex;
gap:10px;

`
const Div = styled.div`
background:black;
  height:100%;
  width:100%;
  position:relative;
  
  :after{
    content:"";
    transition:0.5s;
    position:absolute;
    background:white;
    width:0;
    height:100%;
    left:0;
    animation: ${track} 5s ${prop=>prop.count*5}s forwards ;
  }

`
const Wrap = styled.section`
  background: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  display: flex;
  justify-content: center;
  backdrop-filter: blur(3px);
  top: 0;
  left: 0;
  z-index: 10;
`;

