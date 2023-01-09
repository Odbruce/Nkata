import styled from "@emotion/styled";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import {GrFormClose} from "react-icons/gr"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";


const AddMediaToChat = ({user,chatRef}) => {
 
  const [error, setError] = useState(false);

  function setProgress(progress) {
    const progressElement = document.querySelector("#progressBar");
    progressElement.style.background = `conic-gradient(white ${(360*progress)/100}deg,#272727 0deg)`;
  }
  
  


  const route = useRouter()

  const inputVid = document.getElementById("video_chat")
  const inputImg = document.getElementById("img_chat")

  const Closed=()=>{
  document.getElementById("addMediaToChat").style.transform="scaleY(0) scaleX(0) translateY(10%)";
  inputVid.value="";
  inputImg.value="";
  }
  const handled = (e) => {
    e.preventDefault()
    const target = document.getElementById("up_text")
console.log(inputVid?.files[0]?.name||inputImg?.files[0].name)
          
try {
    const storageRef = ref(storage,inputVid?.files[0]?.name||inputImg?.files[0].name)

    const uploadTask = uploadBytesResumable(storageRef,inputImg?.files[0]||inputVid?.files[0])


    



    uploadTask.on("state_changed",snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(progress); 
    },null,()=>{

      getDownloadURL(uploadTask.snapshot.ref).then(
        async(downloadURL)=>{

          setDoc(
            doc(db, "users", user?.uid),
            {
              lastSeen: serverTimestamp(),
            },
            { merge: true }
          );

          await addDoc(collection(chatRef,route.query.id,"message"),{
            posted: serverTimestamp(),
            message: e.target[0]?.value||target.value,
            uid: user?.uid,
            photoURL: user?.photoURL,
            displayName: user?.displayName,
            url:downloadURL,
            fileName:inputVid?.files[0]?.name||inputImg?.files[0].name,
            type:inputVid?.files[0]?.type||inputImg?.files[0].type,
          }
          ).then((target.value="",Closed()))
        }
      )
    })
} 
catch(err){
  setError(err)
} };

  


  return (
    <>
    <ErrorWrap>
            <div className={`issuccessModal ${!!error ? "success" : null}`}>
              <p>{error}!</p>
            </div>
    </ErrorWrap>
    <Wrapper id="addMediaToChat">
       
      <Close onClick={Closed}>
        <GrFormClose/>
      </Close>
     <Image fill src='/#' id="imgg" alt="image to send" />
     <div id="progressBar">
     </div>

      <video id="vidd"
      controls
    >
      <source type="video/mp4" src='' />
      your brower doesnt support html video
      </video>
      
      <form onSubmit={handled}>
        <input type="text" name="text" id="up_text" />
        <label onClick={handled} htmlFor="up_text">
          <RiSendPlaneFill />
        </label>
      </form>
    </Wrapper>
    </>
  );
};

export default AddMediaToChat;

const Wrapper = styled.div`
  height: min(100vh, 450px);
  transform-origin: center bottom;
  transform: scaleY(0) scaleX(0) translateY(10%);
  transition: 0.4s;
  width: 100vw;
  max-width: 400px;
  background: red;
  position: absolute;
  margin: 0 auto;
  left: 0;
  right: 0;
  background: linear-gradient(145deg, #f5f5f5, #cecece);
  box-shadow: 5px 5px 20px #b9b9b9, -5px -5px 20px #ffffff;

  img {
    width: 100%;
    height: 100%;
    background: #272727;
    object-fit: cover;
  }

  video{
    width:100%;
    background:#272727;
    background:whitesmoke;
    height:100%;
  }

  #progressBar {
    position: absolute;
    width: 50px;
    top:50%;
    right:50%;
    translate:50% -50%;
    height: 50px;
    border-radius: 50%;
    background:conic-gradient(white 0deg,#272727 0deg);
    z-index:10;
    transition:0.5s;
    transition-property:background;  
    display:flex;
    align-items:center;
    justify-content:center;
   
    ::before{
      content:"";
      position:absolute;
      height:45px;
      width:45px;
      border-radius:50%;
      background:#272727;
    }
  }
  

  
  form {
    height: 30px;
    width: 100%;
    left: 0;
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    background: whitesmoke;
    padding: 0.1em 0.4em;

    input {
      background: none;
      width: 100%;
      height: 100%;
      outline: none;
      border: none;
      padding: 0.1em 0.3em;
      letter-spacing: 1px;
    }
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
  }

  .success {
    top: 10px;
    opacity: 1;
  }
`;

const Close = styled.div`
display:flex;
cursor:pointer;
justify-content:center;
align-items:center;
padding:0.3rem;
border:1px solid #272727;
background:whitesmoke;
position:absolute;
top:-10px;
right:0px;
z-index:20;
`