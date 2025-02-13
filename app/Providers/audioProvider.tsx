'use client';

import {createContext, useContext, useEffect, useState} from "react";
import {AudioContextType, AudioProps} from "@/app/types";
import {usePathname} from "next/navigation";

const AudioContext =createContext<AudioContextType | undefined>(undefined)

const AudioProvider=({children}:{children:React.ReactNode})=>{
    const [audio,setAudio]=useState<AudioProps |undefined>();
    const pathname=usePathname();
    useEffect(()=>{
        if(pathname==='/create-podcast'){
            setAudio(undefined)
        }
    },[])
    return(
        <AudioContext.Provider value={{audio,setAudio}}>
            {children}
        </AudioContext.Provider>
    )
}
export const useAudio=()=>{
    const context=useContext(AudioContext);

    if(!context){
        throw new Error('useAudio must be used within an Audio Provider')
    }
    return context
}
export default AudioProvider
