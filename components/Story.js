import React from 'react'
import styled from "@emotion/styled";
import { collection,  orderBy, query,doc } from "firebase/firestore";
import {db} from "../firebase"
import { useCollection,useDocument } from "react-firebase-hooks/firestore";
import DisplayStatus from "./DisplayStatus"
import {useState} from "react"


const Story = ({uid}) => {

  const ref = doc(db,"users",uid);
  const [snap] = useDocument(ref)
const [Show,setShow] = useState(false)

const userRef = collection(db,"users");
const colRef = query(collection(userRef,(uid),"status"),orderBy("posted","asc"));

const [storySnap] =  useCollection(colRef)


if(storySnap?.empty){
  return null;
}else{
  return  <>
   {Show&&<Wrap>
      <DisplayStatus uid={uid} set={setShow}/>
    </Wrap>}
    <Wrapper  >
      <img src={snap?.data().photoURL} alt="" onClick={()=>setShow(true)} />
    </Wrapper>
    </>
}
}

export default Story

const Wrapper = styled.li`
  border: 2px solid purple;
  padding: 2px;
  width: 100%;
  min-width: 40px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  display: grid;
  cursor: pointer;

  img {
    border-radius: 50%;
    background: #272727;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;


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


