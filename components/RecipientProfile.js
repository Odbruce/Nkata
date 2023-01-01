import styled from '@emotion/styled'
import Image from 'next/image'
import React from 'react'
import TimeAgo from 'timeago-react'
import {MdContentCopy,MdAddIcCall} from "react-icons/md"
import {BsImages,BsCameraVideoFill} from "react-icons/bs"
import {FiVideo} from "react-icons/fi"
import {AiOutlineAudio} from "react-icons/ai"
import {GrFormClose} from "react-icons/gr"
import { collection, orderBy, query } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../firebase'

const RecipientProfile = ({recipient,messages}) => {
  const route = useRouter()
  const chatRef = collection(db, "chat");


  const [messageSnap] = useCollection(query(collection(chatRef,route.query.id,"message"),orderBy("posted","asc")));



  const copy = () => {
    const element = document.getElementById("span");
    navigator.clipboard.writeText(element.textContent);
    document.getElementById("p_copy").style.opacity=1;

    return setTimeout(()=>document.getElementById("p_copy").style.opacity=0,2000);
  };

  const filterByType = (type,messages)=>{
    if(messageSnap){
     return messageSnap.docs.filter((msg)=>msg.data().type?.includes(type)).map((msg)=>{return {...msg.data(),id:msg.id}})
    }
    else{return JSON.parse(messages).filter((msg)=>msg.type?.includes(type))}
  }



  const close = ()=>document.getElementById("recipientID").classList.remove("active")

  const scrollToMsg= (id,uid)=>{
    const initial = uid===recipient?.uid?"#979797":document.getElementById(id).style.background;
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
  close();
  document.getElementById(id).style.background="#272727";
return  setTimeout(()=>
  document.getElementById(id).style.background=initial
  ,1500)
}

  return (
    <Wrappper>
      <Wrap id="recipientID">
        <Close onClick={close}/>
      <ProfileWrap>
        <ImgWrapper>
        <Image width={70} height={70} src={recipient?.photoURL} alt={recipient?.displayName}/>
        </ImgWrapper>

        <NameWrap>
            <h4>{recipient?.displayName}</h4>
            <h7>{recipient?.email}</h7>
            <p>
            last seen :{" "}
            {recipient?.lastSeen?.toDate() ? (
              <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
            ) : null}
          </p>
        </NameWrap>
      </ProfileWrap>

      <CallWrap>
        <MdAddIcCall/>
        <BsCameraVideoFill/>
      </CallWrap>
            <Container>
              <h4 onClick={copy}>ID: <span id="span">{recipient?.uid}</span><MdContentCopy /></h4>
              <p id="p_copy">copied!</p>
            </Container>
            <ChatInfo>
              <div>
                <BsImages/>
                <Wrapped>
                <p>{filterByType("image",messages).length===0?"no image available":`${filterByType("image",messages).length} image${filterByType("image",messages).length>1?"s":""}`}</p>
                <MediaWrap>
                 
                  {filterByType("image",messages).map((msg)=>{
                    return <Image key={msg.id} onClick={()=>scrollToMsg(msg.id,msg.uid)} width={70} height={50} src={msg?.url} alt={msg?.displayName}/>
                  })}
                </MediaWrap>

                </Wrapped>
              </div>
              <div>
                <FiVideo/>
                <Wrapped>
                  <p>{filterByType("video",messages).length===0?"no video available":`${filterByType("video",messages).length} video${filterByType("video",messages).length>1?"s":""}`}</p>
                  <MediaWrap>
                    
                    {filterByType("video",messages).map((msg)=>{
                      return <video key={msg.id} onClick={()=>scrollToMsg(msg.id,msg.uid)} width={70} height={50} src={msg.url} alt={msg.displayName}/>
                    })}
                  </MediaWrap>
                </Wrapped>
              </div>
              <div>
                <AiOutlineAudio/>
               <p>1 audio</p>
              </div>
            </ChatInfo>
            </Wrap>
    </Wrappper>
  )
}

export default RecipientProfile


const MediaWrap = styled.div`
display: grid;
width:200px;
grid-auto-columns: 38%;
  grid-auto-flow: column;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  overflow: auto;
  scrollbar-width: none;
  position:relative;
  // background:whitesmoke;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  img{
    object-fit:cover;
    background:#272727;
    cursor:pointer;
  }
  video{
    background:#272727;
    cursor:pointer;
    object-fit:cover;
  }
  `

  const Wrapped =styled.div`
  
  display:flex;
  flex-direction:column;
  row-gap:0.2rem;
  `

const Wrappper = styled.div`
flex:1;
height:fit-content;

@media(max-width:820px){
  overflow:hidden;
  width:100vw;
  position:absolute;
  top:0;
  right:0;
  pointer-events:none;


  .active{
  translate:0%;
  pointer-events:initial;
  }
}
`

const Close=styled(GrFormClose)`
position:absolute;
top:20px;
right:20px;

@media(min-width:830px){
display:none;
}
`
const Wrap=styled.div`
transition:0.8s;
padding-bottom:1rem;
background:#D8AAF2; 

@media(max-width:820px){
translate:100%;
pointer-events:none;
}

`
const ImgWrapper = styled.div`
border:2px solid purple;
border-radius:50%;
display:flex;
justify-content:center;
align-items:center;

img{
  object-fit:cover;
  border-radius:50%;
}
`
const CallWrap=styled.div`
display:flex;
padding:0.6rem;
margin-top:0.5rem;
background:#ECEBE9;
gap:0.5rem;
`

const ProfileWrap=styled.div`
padding:0.5rem;
display:flex;
align-items:center;
justify-content:center;
gap:2rem;
background:#ECEBE9;
height:100px;

@media(max-width:820px){
  justify-content:flex-start;
}
`
const NameWrap=styled.div`

h4{
  color:#272727;
  text-transform:capitalize;
  letter-spacing:2px;
  font-family:"Segoe UI";
}
p{
  font-size:10px;
  color:grey;
}

h7{
  font-size:14px;
}
`

const Container=styled.div`
margin-top:0.5rem;
background:#ECEBE9;
padding:1rem 0.5rem;
position:relative;
p{
  position:absolute;
  top:50%;
  transition:0.3s;
  opacity:0;
  right:15%;
  color:grey;
  font-size:10px;
  
  @media(min-width:830px){
    top:70%;
  }
}

h4{
  cursor:pointer;
  font-size:0.8rem;
  display:flex;
  align-items:center;
  gap:0.8rem;
}

span{
  font-size:12px;
  color:grey;
}
`

const ChatInfo=styled.div`
padding:0.5rem 0.7rem 0;


>div{
  display:flex;
  gap:1rem;
  padding:0.5rem;
  align-items:center;
  background:#ECEBE9;


  p{
    font-size:12px;
  }
}
`