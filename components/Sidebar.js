import React, { useEffect, useState } from 'react'
import {HeartIcon, HomeIcon, LibraryIcon, PlusCircleIcon, RssIcon, SearchIcon} from "@heroicons/react/outline";
import {signOut} from 'next-auth/react';
import {useSession} from "next-auth/react";
import useSpotify from '../hooks/useSpotify';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtom';


const Sidebar = () => {
    const spotifyApi = useSpotify();
    const [playlists, setPlaylists] = useState([]);
    const {data:session} = useSession();
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

    useEffect(() => {
        if(spotifyApi.getAccessToken()){
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylists(data.body.items);
            });
        }
    }, [session, spotifyApi]);

    return (
        <div className='text-gray-500 p-5 text-xs border-r border-gray-900 overflow-y-scroll 
        scrollbar-hide h-screen lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex '>
            <div className='space-y-4'>
                <button className='flex items-center space-x-2 hover:text-white'
                onClick={() => signOut()}>
                    <HomeIcon className='h-5 w-5'></HomeIcon>
                    <p>Home</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <SearchIcon className='h-5 w-5'></SearchIcon>
                    <p>Search</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <LibraryIcon className='h-5 w-5'></LibraryIcon>
                    <p>Your Library</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900'></hr>

                <button className='flex items-center space-x-2 hover:text-white'>
                    <PlusCircleIcon className='h-5 w-5'></PlusCircleIcon>
                    <p>Create Playlist</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <HeartIcon className='h-5 w-5'></HeartIcon>
                    <p>Liked Songs </p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <RssIcon className='h-5 w-5'></RssIcon>
                    <p>Your Episodes</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900'></hr>

                {/* Playlist */}
                {playlists.map((item) => (
                    <p key={item.id} onClick={() => setPlaylistId(item.id)} className='cursor-pointer hover:text-white'>{item.name}</p>
                ))}
                
            </div>
        </div>
    )
}

export default Sidebar
