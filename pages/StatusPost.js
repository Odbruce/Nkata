import styled from '@emotion/styled';
import {ImBin2} from "react-icons/im"
import React from 'react'
import { useState,useEffect } from 'react';
import { GrClose } from 'react-icons/gr';
import {  deleteDoc, doc } from 'firebase/firestore';
import {  db } from '../firebase';
import { deleteObject, ref } from 'firebase/storage';
import Image from 'next/image';
import TimeAgo from 'timeago-react';


const StatusPost = ({set,data,prop,id} ) => {
  const [count,setCount] = useState(0);

  const postRef = doc(db,"users",prop.user.uid,"status",id)

//   const storageref = ref(storage,data.name)
  
  const del = async ()=>{
      await deleteDoc(postRef);  
    //   deleteObject(storageref).then(()=>{
    //     return;
    //   }).catch((err)=>{
    //     alert(err)
    //   })
  }

    useEffect(()=>{

        // const ref = doc(db,"users",prop.uid,"status",id)

        // if(prop.uid){
        //     setDoc(ref,{
        //         views:arrayUnion()
        //     },merge=true)
        // }

        const timed = setTimeout(()=>{
          if(count>=prop.length-1){
            set(false)
          }
          else{
            setCount(prev=>prev + 1);
          }
        },5000)
      
        return ()=>{clearTimeout(timed)}

        // eslint-disable-next-line
      },[count])

  return (
    <StatusConc multiple={count} >
        <Header>
          <Image width={50} height={50} src={data?.photoURL} alt="status" />
          <div>
            <p>{data?.userName} </p>
            <p>
            {data.posted?.toDate() ? (
                    <TimeAgo datetime={data.posted?.toDate().getTime()} />
                  ) : null}
            </p>
          </div>
        <Close onClick={()=>set(false)}/>
       {!prop.uid&&<Bin onClick={del}/>}
        </Header>
        <Screen style={{backgroundColor:data?.background}}>
        {data?.type.includes("image") ? (
          <Image fill src={data.data} alt={data?.name} />
        ) : data?.type.includes("video") ? (
          <video id="str_video" autoPlay playsInline loop muted>
            <source type="video/mp4" src={data?.data} />
            your brower doesnt support html video
          </video>
        ) : (
          <h2>{data?.Text}</h2>
        )}
        </Screen>
        <Caption>{data?.caption}</Caption>
      </StatusConc>
  )
}

export default StatusPost


const StatusConc = styled.div`
  max-width: 600px;
  display:block;
  position: relative;
  height: 80vh;
  top:10%;
  bottom:10%;
  width: 100vw;
  background:white;
  translate:${prop=>prop.multiple*(-100)}%;
  transition:0.8s ease-in-out;
  
  `;

const Header = styled.div`
  display: flex;
  position: absolute;
  gap: 1rem;
  padding: 0.5rem 1rem;
  width: 100%;
  z-index: 10;

  > div {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    justify-content: center;
  }

  img {
    object-fit: cover;
    border-radius: 50%;
    width: 50px;
    background: grey;
    aspect-ratio: 1/1;
  }
`;

const Close = styled(GrClose)`
position:absolute;
right:2%;
z-index:10;
cursor:pointer;
`

const Bin = styled(ImBin2)`
position:absolute;
top:50%;
right:2%;
z-index:10;
cursor:pointer;
`

const Caption = styled.div`
  position: absolute;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 70px;
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Screen = styled.div`
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;

  background: white;
  top: 0;
  width: 100%;
  height: 100%;
  left: 0;
  position: relative;
  display: flex;
  flex-direction: center;
  justify-content: center;
  align-items: center;
  display:block;

  h2 {
    width: 100%;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size: 20px;
    outline: none;
    padding: 1em;
    border: none;
    text-align: center;
    position:absolute;
    margin:0 auto;

    ::placeholder {
      font-size: 48px;
    }
  }
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  video {
    // object-fit: cover;
    height: 100%;
    width: 100%;
  }
`;