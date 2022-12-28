import { FiSend } from "react-icons/fi";
import styled from "@emotion/styled";
import { GrClose } from "react-icons/gr";
import { BiImageAdd } from "react-icons/bi";
import { MdColorLens } from "react-icons/md";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import React, { useEffect, useRef, useState } from "react";
import { collection, serverTimestamp, addDoc, doc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useDocument } from "react-firebase-hooks/firestore";

const UploadStory = () => {
  const [user] = useAuthState(auth);

  const statusRef = collection(db, "users");

  const userRef = doc(db,"users",user.uid)
  const [snap] = useDocument(userRef)
   
  console.log(snap?.data().photoURL);


  useEffect(() => {
    document.getElementById("str_video")?.play();
  }, []);

  const [Input, setInput] = useState("");
  const textRef = useRef(null);

  const handleInput = (e) => {
    if (e.target.type === "file") {
      return setInput(e.target.files[0]);
    }

    return setInput("");
  };

  const handled = async (e) => {
    e.preventDefault();

    if (typeof Input === "object") {
      try {
        const storageRef = ref(storage, Input.name);

        const uploadTask = uploadBytesResumable(storageRef, Input);

        uploadTask.on("state_changed", null, null, () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await addDoc(collection(statusRef, user.uid, "status"), {
              type: Input.type,
              name: Input.name,
              posted: serverTimestamp(),
              background:
                document.getElementById("str_screen").style.backgroundColor,
              caption: e.target[0].value,
              data: downloadURL,
              userName:snap?.data().displayName,
              photoURL:snap?.data().photoURL
            }).then(
              setInput(""),
              (document.getElementById("str_screen").style.backgroundColor =
                "white"),
              (e.target[0].value = "")
            );
          });
        });
      } catch (err) {
        console.log(err);
      }
      return;
    }
    await addDoc(collection(statusRef, user.uid, "status"), {
      Text: textRef.current.value,
      type: "text",
      background: document.getElementById("str_screen").style.backgroundColor,
      posted: serverTimestamp(),
      caption: e.target[0].value,
      userName:snap?.data().displayName,
      photoURL:snap?.data().photoURL
    }).then(
      setInput(""),
      (document.getElementById("str_screen").style.backgroundColor = "white"),
      ((e.target[0].value = ""), (textRef.current.value = ""))
    );
  };

  const display = () => {
    document.getElementById("status").style.display = "none";
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    const element = document.getElementById("str_screen");
    element.style.backgroundColor = color;
  };

  return (
    <Container>
      <Header>
        <Close onClick={display} />
        <Options>
          <label htmlFor="str_img">
            <BiImageAdd />
          </label>
          <input
            onChange={handleInput}
            type="file"
            accept="image/*"
            hidden
            id="str_img"
          />
          <label htmlFor="str_vid">
            <AiOutlineVideoCameraAdd />
          </label>
          <input
            onChange={handleInput}
            type="file"
            accept="video/*"
            hidden
            id="str_vid"
          />
          <h2 onClick={handleInput}>T</h2>
          <MdColorLens className="color" onClick={getRandomColor} />
        </Options>
      </Header>
      <Screen id="str_screen">
        {Input?.type?.includes("image") ? (
          <img src={URL.createObjectURL(Input)} alt="" />
        ) : Input?.type?.includes("video") ? (
          <video id="str_video" autoPlay playsInline loop muted>
            <source type="video/mp4" src={URL.createObjectURL(Input)} />
            your brower doesnt support html video
          </video>
        ) : (
          <textarea ref={textRef} placeholder="TYPE HERE..." />
        )}
      </Screen>

      <UploadForm onSubmit={handled}>
        <input placeholder="add a comment" type="text" name="" id="text" />
        <label htmlFor="sub">
          <Send />
        </label>
        <input type="submit" id="sub" hidden value="" />
      </UploadForm>
    </Container>
  );
};

export default UploadStory;

const Container = styled.div`
  background: white;
  max-width: 600px;
  width: 100vw;
  height: 80vh;
  position: relative;
  top:10%;
  bottom:10%;
`;

const UploadForm = styled.form`
  display: flex;
  height: 50px;
  position: sticky;
  bottom: 0;
  padding: 0.4em 1em;
  background: white;
  align-items: center;

  input[type="text"] {
    width: 100%;
    color: grey;
    height: 100%;
    outline: none;
    background: transparent;
    border: none;
  }
`;

const Send = styled(FiSend)`
  cursor: pointer;
`;

const Header = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  z-index: 10;
  width: 100%;
  justify-content: space-between;
  padding: 0 1em;
`;

const Close = styled(GrClose)`
  align-self: center;
  cursor: pointer;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  h2 {
    font-size: 24px;
    cursor: pointer;
  }
  .color,
  label {
    cursor: pointer;
  }
`;

const Screen = styled.div`
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

  textarea {
    width: 100%;
    font-size: 20px;
    height: 50%;
    outline: none;
    padding: 1em;
    background: transparent;
    border: none;
    text-align: center;

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
