import { useAuthState } from 'react-firebase-hooks/auth'
import Loading from '../components/Loading'
import Login from '../components/Login'
import { auth } from '../firebase'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {

  const [user,loading] = useAuthState(auth)
  if(loading)return <Loading/>
  if(!user)return <Login/>
  return <Component {...pageProps} />
}
