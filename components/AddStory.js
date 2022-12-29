import {BsPlusCircleFill} from "react-icons/bs"
import styled from '@emotion/styled'
import DisplayStatus from './DisplayStatus'
import {useEffect, useState} from "react"
import { db } from "../firebase"
import { collection,  orderBy, query,doc } from "firebase/firestore";

import { useDocument,useCollection } from "react-firebase-hooks/firestore"
import Image from "next/image"

const AddStory =   ({user}) => {

  const ref = doc(db,"users",user);
  const [snap] = useDocument(ref)



    const display = ()=>{
        document.getElementById("status").style.display="flex";
    }
const [Show,setShow] = useState(false)

const userRef = collection(db,"users");
const colRef = query(collection(userRef,(user),"status"),orderBy("posted","asc"));

const [storySnap] =  useCollection(colRef)




  return  <>
   {Show&&<Wrap>
      <DisplayStatus set={setShow}/>
    </Wrap>}
    <Wrapper border ={storySnap?.empty?"none":"purple"} >
      <Image fill src={snap?.data().photoURL} alt={snap?.data().displayName} onClick={()=>setShow(true)} />
      <Addicon onClick={display}/>
    </Wrapper>
    </>
}

export default AddStory



const Wrapper = styled.li`
  border: 2px solid ${prop=>prop.border};
  padding: 2px;
  width: 100%;
  min-width: 40px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  display: grid;
  cursor: pointer;
  position:relative;
  
  img {
    border-radius: 50%;
    ${prop=>prop.border==="none"?"pointer-events":null}:none;
    background: #272727;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
 
`;

const Addicon = styled(BsPlusCircleFill)`
    position:absolute;
    left:-25%;
    border:2px solid white;
    border-radius:50%;
    background:white;
    color: #26b960;
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