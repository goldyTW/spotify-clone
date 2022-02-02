import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Center from '../components/Center'
import Player from '../components/Player'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <>
     <Head>
        <title>Spotify 2.0</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div className='bg-black h-screen overflow-hidden'>
        <main className='flex'>
            <Sidebar></Sidebar>
            <Center></Center>
        </main>
      </div>
      <div className='sticky bottom-0'>
        <Player></Player>
      </div>
    </>
  )
}

export async function getServerSideProps(context){
  const session = await getSession(context);

  return{
    props:{
      session,
    }
  }
}