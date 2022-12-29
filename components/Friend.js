import React from 'react'
import styled from '@emotion/styled';
import {useRouter} from 'next/router';
import {doc} from "firebase/firestore";
import { useDocument } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import { Notify } from './SideBar';
import Image from 'next/image';


const Friend = ({id,uid}) => {
    const route = useRouter();

    const handle = () => route.push(`/chat/${id}`);

    const friendref = doc(db,"users",uid);
    const [docSnap] = useDocument(friendref);
  return (
    <Friends onClick={handle}>
    <Image width={60} height={60} src={docSnap?.data().photoURL} alt={docSnap?.data().displayName} />
    <div>
      <h1>{docSnap?.data().displayName}</h1>
      {/* add substring feature for text to cut text add ellipses */}
      {/* <h4>message from friend</h4> */}
    </div>
    {/* <NotifyFriend>
        1
    </NotifyFriend> */}
  </Friends>
  )
}

export default Friend

const Friends = styled.div`
  font-size: clamp(10px, calc(6px + 2vw), 18px);
  width: 100%;
  display: flex;
  padding: 1rem 1rem 0.5rem;
  gap: 1em;
  border-bottom: whitesmoke solid 1px;
  transition:0.3s;
  position:relative;
cursor:pointer;

  :hover{
    background:rgba(0,0,0,0.1);
  }

  img {
    width: 60px;
    // height: 60px;
    aspect-ratio: 1/1;
    background: #272727;
    object-fit:cover;
    // background: #d0342c;
    border-radius: 50%;
    // margin-right: 1em;
  }

  h4 {
    color: grey;
    word-break: break;

  }
  h1 {
    font-size: clamp(9px, calc(7px + 0.5vw), 16px);
    color: #272727;
    font-family:"segoe Ui";
    word-break: break;
    text-transform: capitalize;
  }
`;
const NotifyFriend = styled.div`
min-width: 2em;
height: 2em;
border-radius: 500px;
font-size: clamp(9px, calc(7px + 0.5vw), 16px);
background-color: #d0342c;
color: whitesmoke;
padding: 0 5px 1px 5px;
display: inline-flex;
border: 2px solid white;
justify-content: center;
align-items: center;
text-align: center;
  align-self: center;
  position:absolute;
  right:5%;
`;