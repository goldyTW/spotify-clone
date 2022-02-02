import React from 'react'
import {getProviders, signIn} from 'next-auth/react';

const login = ({providers}) => {
    return (
        <div className='flex flex-col items-center bg-black min-h-screen w-full justify-center'>
            <img className='w-32 mb-5' src='https://links.papareact.com/9xl'></img>
            {Object.values(providers).map((provider) => (
                <div key={provider.name}>
                    <button className='bg-[#18D860] text-white px-10 py-3 rounded-full'
                    onClick={() => signIn(provider.id, {callbackUrl: "/"})}>Login With Spotify</button>
                </div>
            ))}
        
        </div>
    )
}


export async function getServerSideProps(){
    const providers = await getProviders();
    return{
        props:{
            providers
        },
    };
}


export default login;