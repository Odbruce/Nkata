import Head from "next/head";
import styled from "@emotion/styled"
import ChatComponent from "../../components/ChatComponent"
import SideBar from "../../components/SideBar"
import RecipientProfile from "../../components/RecipientProfile"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../../firebase";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";


const Chat = ({chat,messages}) => {
  const [user] = useAuthState(auth);

  // console.log(messages)

  const recipientId = (prop)=>{
   return chat?.user?.find((item)=>item!==prop?.uid)
  }

  const userDetails = useDocument(doc(db,"users",recipientId(user)||"a"))

  const route = useRouter();


  return (
    <>
    <Head>
        <title>chat with {userDetails[0]?.data()?.displayName}</title>
        <meta name="description" content="Chat your experience" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <Wrapper>
        <SideBar messages={messages} />
        <ChatDisplayWrap display={route.query.id}>
         {recipientId(user)&&<>
            <ChatComponent chat={chat} recipient={userDetails[0]?.data()} messages={messages} />
             <RecipientProfile chat={chat} recipient={userDetails[0]?.data()} messages={messages} />
            </> 
            }
            </ChatDisplayWrap>
    </Wrapper>
    </>
  )
}

export default Chat;

export async function getServerSideProps(context){

    const ref = collection(db,"chat");
    const messageRef = await getDocs(query(collection(ref,context.query.id,"message"),orderBy("posted","asc")));
    
    const messages = messageRef.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
    })).map((msg=>({
        ...msg,
        posted:msg.posted.toDate().getTime(),
    })))

 


    const chatRef = await getDoc(doc(ref,context.query.id));
    const chat = {
        uid:chatRef.id,
        ...chatRef.data()
    }

   
    return {
        props:{
            messages:JSON.stringify(messages),
            chat:chat,
        }
    }
}






const Wrapper = styled.section`
display:flex;
position:relative;
`

const ChatDisplayWrap = styled.section`
display:flex;
flex: 3;
over-flow:hidden;

@media (max-width: 820px) {
    display: ${(prop) => (prop.display === "_blank_" ? "none" : null)};
  }
`