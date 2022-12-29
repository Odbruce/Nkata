import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { db } from '../firebase'
import styled from '@emotion/styled';
import Image from 'next/image';


const PendingFriend = ({uid,id}) => {

    const friendref = doc(db,"users",uid);
    const [docSnap] = useDocument(friendref);

    const ReqReply = async (e, prop) => {

        const chatRef = doc(db, "chat", prop);
        if (e.target.value === "accept") {
          return setDoc(
            chatRef,
            {
              request: "accepted",
            },
            { merge: true }
          );
        }
        return await deleteDoc(chatRef);
      };

  return (
        <Requests >
          <Image width={50} height={50} src={docSnap?.data().photoURL} alt={docSnap?.data().displayName} />
          <div>
            <h4>{docSnap?.data().displayName}</h4>
            <div>
              <input
                type="button"
                value="decline"
                onClick={(e) => ReqReply(e, id)}
              />
              <input
                type="button"
                value="accept"
                onClick={(e) => ReqReply(e, id)}
              />
            </div>
          </div>
        </Requests>
      )
}

export default PendingFriend;


const Requests = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6em;
  padding: 1rem;
  width: 250px;
  width: 100%;
  font-size: 10px;
  transition: 0.4s;

  :hover {
    background: rgba(0, 0, 0, 0.1);
  }

  img {
    width: 50px;
    aspect-ratio: 1/1;
    background: #272727;
    border-radius: 50%;
    object-fit:cover;
  }
  > div {
    transition: 0.2s;
    flex: 1;
    height: 100%;
    // border-bottom: 1px rgba(0, 0, 0, 0.4) solid;
    justify-content: center;
    display: flex;
    gap: 0.8vw;
    flex-direction: column;
    padding-left: 0.3vw;
    color: grey;

    h4 {
      text-transform: capitalize;
      word-break: break;
    }

    div {
      display: flex;
      width: 100%;
      gap: 1.1rem;

      input {
        width: 4rem;
        cursor: pointer;
        padding: 0.3rem;
        background: none;
        border: none;
        font-size: 10px;

        :nth-of-type(2) {
          background: linear-gradient(145deg, whitesmoke, #e6e6e6);

          :hover {
            background: linear-gradient(145deg, #e6e6e6, whitesmoke);
          }
        }
      }
    }
  }
`;