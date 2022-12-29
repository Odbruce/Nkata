import React, { useEffect, useRef } from "react";
import { BsSearch, BsThreeDots } from "react-icons/bs";
import styled from "@emotion/styled";
import Status from "./Status";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import { AiOutlineUserAdd, AiOutlineLogout } from "react-icons/ai";
import { MdContentCopy } from "react-icons/md";
import {
  serverTimestamp,
  doc,
  setDoc,
  where,
  collection,
  query,
  getDoc,
  addDoc,
} from "firebase/firestore";
import PendingFriend from "./PendingFriend";
import Friend from "./Friend";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import Image from "next/image";

const SideBar = () => {
  const [user] = useAuthState(auth);
  const route = useRouter();

  const proRef = useRef(null);

  const friendsRef = query(
    collection(db, "chat"),
    where("user", "array-contains", user.uid)
  );
  const [friendsSnap] = useCollection(friendsRef);

  const pendingFriends = query(
    collection(db, "chat"),
    where("user", "array-contains", user.uid),
    where("request", "==", "pending")
  );
  const [requestsSnap] = useCollection(pendingFriends);

  const requested = requestsSnap?.docs.filter(
    (item) => item.data().from !== user.uid
  );

  const acceptedFriends = query(
    collection(db, "chat"),
    where("user", "array-contains", user.uid),
    where("request", "==", "accepted")
  );
  const [acceptedFriendsSnap] = useCollection(acceptedFriends);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      setDoc(
        userRef,
        {
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );
    }
  }, [user]);

  const isAFriend = (prop) => {
    return !!friendsSnap?.docs.find(
      (chat) =>
        chat.data().user.includes(prop) &&
        (chat.data().request === "accepted" ||
          chat.data().request === "pending")
    );
  };

  const isAUser = async (prop) => {
    const docRef = doc(db, "users", prop);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  const sendRequest = async () => {
    //find user with uid then send a request to be friends
    const friendsUid = prompt("Input your Friend's Nkata ID:");
    const resolvedIsUser = friendsUid ? await isAUser(friendsUid) : null;

    if (!friendsUid) return null;
    //check if youre already friends ,

    if (isAFriend(friendsUid)) {
      return alert("you're already friends with this user");
    }

    if (!isAFriend(friendsUid) && friendsUid !== user.uid && resolvedIsUser) {
      return addDoc(collection(db, "chat"), {
        user: [user.uid, friendsUid],
        request: "pending",
        from: user.uid,
      });
    }
    if (!resolvedIsUser) {
      return alert("user not found");
    }
  };

  const copy = () => {
    const element = document.getElementById("span");
    navigator.clipboard.writeText(element.textContent);

    // Alert the copied text
    alert("Copied : " + element.textContent);
  };

  return (
    <Wrapper display={route.query.id}>
      <Header>
        <ProfileWrap ref={proRef}>
          <Image
            width={50}
            height={50}
            src={user.photoURL}
            alt={user.displayName}
          />
          <h4>{user.displayName}</h4>
          <h4 onClick={copy}>
            ID : <span id={"span"}>{user.uid}</span> <MdContentCopy />
          </h4>
          <h4 onClick={() => signOut(auth)}>
            sign out
            <AiOutlineLogout className="out" />
          </h4>
        </ProfileWrap>
        <BsThreeDots
          className="dot"
          onClick={() => proRef.current.classList.toggle("active")}
        />
        <AddFriend onClick={sendRequest}>
          <AiOutlineUserAdd />
        </AddFriend>
      </Header>
      <StatusWrapper>{<Status userUid={user.uid} />}</StatusWrapper>
      <SearchForm>
        <label htmlFor="search">
          <BsSearch />
        </label>
        <input placeholder="search friends" type="text" id="search" />
        <button hidden></button>
      </SearchForm>
      <RequestWrapper>
        <Reqheader>
          <h1>Friends</h1>
          <ReqIcon>
            <h1>Requests</h1>
            {requested && (
              <Notify>{requested?.map((item) => item.data()).length}</Notify>
            )}
          </ReqIcon>
        </Reqheader>
        <ReqWrap>
          {requested?.map((req) => {
            const uid = req.data().user.filter((item) => item !== user.uid)[0];

            return <PendingFriend key={req.id} id={req.id} uid={uid} />;
          })}
        </ReqWrap>
      </RequestWrapper>
      <FriendWrapper>
        {acceptedFriendsSnap?.docs.map((frd) => {
          const uid = frd.data().user.filter((item) => item !== user.uid)[0];

          return <Friend key={frd.id} id={frd.id} uid={uid} />;
        })}
      </FriendWrapper>
    </Wrapper>
  );
};

export default SideBar;

const Wrapper = styled.aside`
  height: 100vh;
  width: 35vw;
  border-right: 1px solid grey;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  overflow: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 820px) {
    display: ${(prop) => (prop.display !== "_blank_" ? "none" : null)};
    width: ${(prop) => (prop.display === "_blank_" ? "100vw" : "35vw")};
  }
`;
const Header = styled.nav`
  position: sticky;
  z-index: 2;
  top: 0px;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  background: white;

  .active {
    transform: translateY(0);
    opacity: 1;
    pointer-events: initial;
  }
  .dot {
    cursor: pointer;
  }
`;

const ProfileWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: absolute;
  top: 50px;
  left: 0.3em;
  padding: 0.5rem;
  background: grey;
  align-items: flex-start;
  transition: 0.3s;
  border-radius: 10px;
  background: #e5e5e5;
  box-shadow: inset 5px 5px 20px #b9b9b9, inset -5px -5px 20px #ffffff;
  color: #272727;
  transform: translateY(10%);
  opacity: 0;
  pointer-events: none;

  .out {
    color: #d0342c;
  }

  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
    background: #272727;
    align-self: center;
  }
  h4 {
    font-size: clamp(9px, calc(7px + 0.5vw), 16px);
    display: flex;
    align-items: center;
    gap: 0.3em;
    text-transform: capitalize;
    width: 100%;

    span {
      background: whitesmoke;
    }

    :nth-of-type(2) {
      cursor: pointer;
      text-transfrom: lowercase;
    }
    :nth-of-type(3) {
      cursor: pointer;
      text-transfrom: lowercase;
    }
  }
`;

const AddFriend = styled.div`
  padding: 0.5em;
  border-radius: 50%;
  background: linear-gradient(315deg, #ffffff, #dddcdc);
  box-shadow: 20px 20px 40px #ffffff;
  display: flex;
  justify-content: end;
  align-items: center;
  cursor: pointer;
`;

const StatusWrapper = styled.ul`
  display: grid;
  list-style: none;
  width: 100%;
  padding: 0 1rem;
  grid-auto-columns: 10%;
  grid-auto-flow: column;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  overflow: auto;
  scrollbar-width: none;
  gap: 0.5em;
  margin-bottom: 1rem;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 680px) {
    gap: 10px;
    grid-auto-columns: 20%;
  }
`;
const SearchForm = styled.form`
  position: relative;
  padding: 0 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;

  label {
    font-size: clamp(9px, calc(7px + 0.5vw), 16px);
    cursor: pointer;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.9px;
    color: grey;
  }

  input {
    width: 100%;
    padding: 0.3rem;
    border: 2px solid transparent;
    height: max(2.78vw, 28px);
    letter-spacing: 1px;
    background: transparent;
    outline: none;
    transition: 0.5s;

    &:focus {
      border-bottom: 2px solid #1da1f2;
      width: 50%;
    }
  }
`;

const RequestWrapper = styled.div`
  border-bottom: 2px solid black;
`;

const Reqheader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0 2vw 0 1.2vw;

  h1 {
    font-size: clamp(12px, calc(8px + 2vw), 24px);
    position: relative;
  }
`;

const ReqIcon = styled.div`
  position: relative;
  display: flex;
  color: grey;
  cursor: pointer;

  h1 {
    font-size: clamp(10px, calc(7px + 0.5vw), 18px);
    align-self: flex-end;
  }

}
`;
const Notify = styled.div`
  min-width: 2em;
  height: 2em;
  border-radius: 500px;
  font-size: clamp(9px, calc(7px + 0.5vw), 16px);
  background-color: #d0342c;
  color: whitesmoke;
  position: absolute;
  padding: 0 5px 1px 5px;
  bottom: 25%;
  right: -5%;
  display: inline-flex;
  border: 2px solid white;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
const Requests = styled.div`
  // height: 60px;
  display: flex;
  align-items: center;
  // margin-bottom: 1rem;
  gap: 0.6em;
  // bottom-border: 1rem;
  padding: 1rem 0;
  width: 250px;
  width: 100%;
  font-size: 10px;
  transition: 0.4s;

  :hover {
    background: rgba(0, 0, 0, 0.1);
  }

  img {
    object-fit: cover;
    width: 50px;
    aspect-ratio: 1/1;
    background: #272727;
    border-radius: 50%;
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
const ReqWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  // gap: 1rem;
  justify-content: space-between;
  justify-content: center;
`;

const FriendWrapper = styled.section``;
