import { Inter } from '@next/font/google'
import { useRouter } from 'next/router'
// import SideBar from '../components/SideBar'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter();
  router.push('/chat/_blank_');
  return null;

}
