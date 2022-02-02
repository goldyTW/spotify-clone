import { ReplyIcon, SwitchHorizontalIcon, VolumeUpIcon, VolumeOffIcon } from '@heroicons/react/outline';
import { RewindIcon, PauseIcon, PlayIcon, FastForwardIcon,} from '@heroicons/react/solid';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';

const Player = () => {
    const spotifyApi = useSpotify();
    const {data:session, status} = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);

    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if (!songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then(data => 
            {
                setCurrentTrackId(data.body?.item.id);
                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                })
            });
        }
    }

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if(data.body.is_playing){
                spotifyApi.pause();
                setIsPlaying(false)
            }else{
                spotifyApi.play();
                setIsPlaying(true);
            }
        })
    }
 
    useEffect(() => {
       if(spotifyApi.getAccessToken() && !currentTrackId){
           fetchCurrentSong();
           setVolume(50);
       }
    }, [currentTrackId, spotifyApi, session])

    useEffect(() => {
        if(volume > 0 && volume < 100){
            debounceAdjustVolume(volume);
        }
    }, [volume]);

    const debounceAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => {});
        }, 500),
        [] 
    )

    console.log(songInfo)

    return (
        <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white
        grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
            <div className='flex items-center space-x-4'>
                <img className='hidden md:inline h-10 w-10'
                src={songInfo?.album.images?.[0]?.url}></img>
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artist?.[0]?.name}</p>
                </div>
            </div>
            
            <div className='flex items-center justify-evenly'>
                <SwitchHorizontalIcon className='button'></SwitchHorizontalIcon>
                <RewindIcon className='button'></RewindIcon>

                {isPlaying? (
                    <PauseIcon onClick={handlePlayPause} className='button w-10 h-10'></PauseIcon>
                ):
                <PlayIcon onClick={handlePlayPause} className='button w-10 h-10'></PlayIcon>
                }

                <FastForwardIcon className='button'></FastForwardIcon>
                <ReplyIcon className='button'></ReplyIcon>
            </div>

            <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
                <VolumeOffIcon onClick={() => volume > 0 && setVolume(volume-10)} className="button"></VolumeOffIcon>
                <input className='w-14 md:w-20'
                type="range"
                value={volume}
                onChange={e=> setVolume(Number(e.target.value))}
                min={0}
                max={100}
                ></input>
                <VolumeUpIcon onClick={() => volume <100 && setVolume(volume+10)} className='button'></VolumeUpIcon>
            </div>
        </div>
    )
}

export default Player
