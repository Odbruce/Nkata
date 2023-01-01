import Head from "next/head";
import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import imged from "../media/landing_img.jpg";
import { FcGoogle } from "react-icons/fc";
import { BsFillImageFill } from "react-icons/bs";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage,db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { setDoc ,doc} from "firebase/firestore";


const Login = () => {
  const fileref = useRef(null);
  const [filename, setFilename] = useState("");
  const [isAuser, setisAuser] = useState(false);
  const [error, setError] = useState("");

  const yes = useAuthState(auth);
  console.log(yes);

  const filed = () => {
    return setFilename(fileref.current.files[0].name);
  };

  useEffect(() => {
    document.getElementById("vid").play();
  }, []);

  const inputPswrd = useRef(null)
  const emailRef = useRef(null)



  const googleSignIn = async ()=>{
    const provider = new GoogleAuthProvider();

    try{
    const result = await signInWithPopup(auth, provider);
    await setDoc(doc(db,"users",result.user.uid),
    {
      displayName:result.user.displayName,
      photoURL:result.user.photoURL,
      email:result.user.email,
      uid:result.user.uid,
    }
  );

    }

    catch(e){
        setError(e.code.replace("auth/","").replaceAll("-"," "));
        setTimeout(()=>{setError("")},3000)
      }
}


  const handled = async (e) => {
    e.preventDefault();
    const FirstName = e.target[0].value;
    const Lastname = e.target[1].value;
    const Email = e.target[2].value;
    const image = e.target[3]?.files[0];
    const Password = e.target[4]?.value;

    if (isAuser) {
      // handle sign in
      try {
        return signInWithEmailAndPassword(auth, emailRef.current.value, inputPswrd.current.value);
      } catch (e) {
        setError(e.code.replace("auth/", "").replaceAll("-", " "));
        setTimeout(() => {
          setError("");
        }, 3000);
        return;
      }
    } else {
      //handle sign up
      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          Email,
          Password
        );

        const storageRef = ref(storage, Email);
        const profileref = ref(storage, "profile_pic.png");

        const uploadTask = image && uploadBytesResumable(storageRef, image);

        !image
          ? getDownloadURL(profileref).then(async (downloadURL) => {
              await updateProfile(result.user, {
                displayName: FirstName,
                photoURL: downloadURL,
              });
              await setDoc(doc(db,"users",result.user.uid),
              {
                displayName:FirstName,
                photoURL:downloadURL,
                email:result.user.email,
                uid:result.user.uid,
              }
            );
            })
          : uploadTask.on("state_changed", null, null, () => {
              getDownloadURL(uploadTask.snapshot.ref).then(
                async (downloadURL) => {

                  await updateProfile(result.user, {
                    displayName: FirstName,
                    photoURL: downloadURL,
                  });

                  await setDoc(doc(db,"users",result.user.uid),
                   {
                     displayName:FirstName,
                     photoURL:downloadURL,
                     email:result.user.email,
                     uid:result.user.uid,
                   }
                 );
                }
              );
            });
      } catch (error) {
        setError(error.code.replace("auth/", "").replaceAll("-", " "));
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    }
  };

  return (
    <>
      <Head>
        <title>{'NK\u00C1T\u00C0'}</title>
        <meta name="description" content="Chat your experience" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Wrapper>
        <VideoLanding
          id="vid"
          poster={imged.src}
          autoPlay
          playsInline
          loop
          muted
        >
          <source type="video/mp4" src={"/landing_video2__Trim.mp4"} />
          your brower doesnt support html video
        </VideoLanding>
        <FormContainer>
          <ErrorWrap>
            <div className={`issuccessModal ${!!error ? "success" : null}`}>
              <p>{error}!</p>
            </div>
          </ErrorWrap>
          <SocialWrapper>
            <h1>{'NK\u00C1T\u00C0'}</h1>
            <Social>
              <button onClick={googleSignIn}>
                <div>
                  <FcGoogle />
                  <span>sign up with google</span>
                </div>
              </button>
            </Social>

            <p>
              {`Signing up with social is super quick. No extra passwords to
              remember - no brain fail. Don't worry, we'd never share any of
              your data or post anything on your behalf`}
            </p>
            <h4>OR SIGN {isAuser ? "IN" : "UP"} WITH EMAIL</h4>
          </SocialWrapper>
          <MainForm onSubmit={handled}>
            {!isAuser ? (
              <FormSignup>
                <NameWrapper>
                  <InputWrap>
                    <input type="text" name="f_name" id="firstname" required />
                    <label htmlFor="firstname">firstname</label>
                  </InputWrap>
                  <InputWrap>
                    <input type="text" name="l_name" id="lastname" required />
                    <label className="last" htmlFor="lastname">
                      lastname
                    </label>
                  </InputWrap>
                </NameWrapper>
                <EmailWrapper>
                  <InputWrap>
                    <input type="email" name="email" id="email" />
                    <label htmlFor="email">email</label>
                  </InputWrap>
                  <InputFile>
                    <label htmlFor="file">
                      <BsFillImageFill
                        size="clamp(12px, calc(8px + 2vw), 24px)"
                        color="blue"
                      />{" "}
                      {filename || "select an image ..."}
                    </label>
                    <input
                      ref={fileref}
                      onChange={filed}
                      type="file"
                      hidden
                      accept="image/*"
                      name=""
                      id="file"
                    />
                  </InputFile>
                  <InputWrap>
                    <input
                      type="password"
                      name="pswrd"
                      id="password"
                      minLength={6}
                      required
                    />
                    <label htmlFor="password">password</label>
                  </InputWrap>
                </EmailWrapper>
                <Btn type="submit" value="sign up" />
              </FormSignup>
            ) : (
              <FormSignin>
                <EmailWrapper>
                  <InputWrap>
                    <input type="email" name="email" id="email" ref={emailRef} required />
                    <label htmlFor="email">email</label>
                  </InputWrap>
                  <InputWrap>
                    <input
                      type="password"
                      name="pswrd"
                      id="password"
                      minLength={6}
                      required
                      ref={inputPswrd}
                    />
                    <label htmlFor="password">password</label>
                  </InputWrap>
                </EmailWrapper>
                <Btn type="submit" value="sign in" />
              </FormSignin>
            )}
          </MainForm>
          <p>
            {isAuser ? "no account?" : "already a user?"}{" "}
            <input
              type="button"
              value={isAuser ? "register" : "sign in"}
              onClick={() => setisAuser((prev) => !prev)}
            />
          </p>
        </FormContainer>
      </Wrapper>
    </>
  );
};

export default Login;

const Wrapper = styled.section`
  display: flex;
  justify-content: flex-end;
  width: 100vw;
  height: 100vh;
  background-color: whitesmoke;
  position: relative;
  padding: 2vw;
`;

const VideoLanding = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  object-fit: cover;
`;
const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 50%;
  height: fit-content;
  align-self: center;
  background: whitesmoke;
  mix-blend-mode: screen;
  padding-bottom: 1.5em;
  font-size: clamp(9px, calc(7px + 0.5vw), 16px);

  p input[type="button"] {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: clamp(9px, calc(7px + 0.5vw), 16px);
    letter-spacing: 1px;

    :hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 920px) {
    width: 100vw;
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
const MainForm = styled.div`
  padding-top: 1.5rem;
  overflow: hidden;
  width: 80%;
  margin-bottom: 0.5rem;
`;
const SocialWrapper = styled.div`
  padding: 0 2vw;
  position: relative;
  z-index: 1;
  color: whitesmoke;

  h1 {
    text-align: center;
    color: #272727;
    letter-spacing: max(1.2vw, 12px);
    font-size: clamp(32px, calc(4vw + 10px), 72px);
    padding-left: max(1.2vw, 12px);

    
  }

  p {
    font-size: clamp(9px, calc(7px + 0.5vw), 16px);
    margin-bottom: 1rem;
    color: #272727;
  }

  h4 {
    text-align: center;
    position: relative;
    color: #272727;
    margin: 0 auto;
    width: 35%;
    font-size: clamp(9px, calc(7px + 0.5vw), 16px);

    &:before,
    &:after {
      content: "";
      width: 80%;
      height: 1px;
      background: rgba(0, 0, 0, 0.5);
      top: 50%;
      position: absolute;
      transform: rotate(180deg);
    }
    &:before {
      right: 100%;
      background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0.5),
        whitesmoke,
        whitesmoke
      );
    }
    &:after {
      left: 100%;
      background: linear-gradient(
        to left,
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0.5),
        whitesmoke,
        whitesmoke
      );
    }
  }
`;

const Social = styled.div`
  display: flex;
  justify-content: center;
  padding: 0.5rem;
  margin-bottom: 1rem;

  button {
    width: fit-content;
    cursor: pointer;
    border: 2px solid #565656;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.7px;
    background: whitesmoke;
    height: max(3.33vw, 30px);
    font-family: Segoe UI;
    padding: 0 1vw;
    color: #565656;
    font-size: clamp(9px, calc(7px + 0.5vw), 16px);
    transition: 0.5s;

    div {
      display: flex;
      gap: 0.6rem;
      align-items: center;

      .Fc {
        font-size: clamp(12px, calc(8px + 2vw), 24px);
      }

      .ts {
        color: #1da1f2;
      }
    }

    &:hover {
      color: var(--font_pri);
      border-color: var(--font_pri);
      background: #565656;
    }
  }
`;

const FormSignin = styled.form``;

const FormSignup = styled.form``;

const EmailWrapper = styled.div`
  display: grid;
  gap: 0.3em;
  margin-bottom: 1rem;
`;

const NameWrapper = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
  position: relative;
  margin-bottom: 1rem;
`;
const InputWrap = styled.div`
  position: relative;

  label {
    font-size: clamp(9px, calc(7px + 0.5vw), 16px);
    pointer-events: none;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.9px;
    color: grey;
    position: relative;
    margin-left: 0.3rem;
    top: -50%;
    transition: 0.3s;
    padding-left: 0.3rem;
  }

  input {
    width: 100%;
    padding: 0.3rem;
    height: max(2.78vw, 28px);
    background: whitesmoke;
    letter-spacing: 1px;
    border: 1px solid #565656;
    outline: none;

    &:focus {
      box-shadow: inset 0px 0px 1px 1px #9fd4f4;
      border: 2px solid #1da1f2;
      border-radius: 5px;
      background: white;
    }

    &:is(:focus, :valid) ~ label {
      top: -100%;
      color: #272727;
      background: whitesmoke;
      padding: 0 0.3rem;
      left: -0.3rem;
      border-left: 1px solid #565656;
    }
  }
`;

const InputFile = styled.div`
  font-size: clamp(9px, calc(7px + 0.5vw), 16px);
  color: #272727;
  margin-bottom: 2rem;
  label {
    display: flex;
    gap: 0.3em;
    align-items: flex-end;
  }
`;

const Btn = styled.input`
  font-family: "Segoe UI";
  width: 100%;
  background: whitesmoke;
  color: #272727;
  height: 2.5rem;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1.5px;
  cursor: pointer;
  border: 1px solid black;
  position: relative;
  z-index: 1;
  transition: 0.5s;

  :hover {
    background: #272727;
    color: whitesmoke;
    border-color: black;
  }
`;
