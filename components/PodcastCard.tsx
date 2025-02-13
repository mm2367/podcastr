import React from 'react'
import Image from "next/image";
import {PodcastCardProps} from "@/app/types";
import {useRouter} from "next/navigation";
export const PodcastCard = ({imgUrl, description, podcastId, title}: PodcastCardProps) => {
    const router=useRouter()
    const shouldIncreaseViews=()=>{
        router.push(`/podcasts/${podcastId}`,{
            scroll:true
        })
    }
    return (
        <div className={'cursor-pointer'} onClick={shouldIncreaseViews}>PodcastCard
            <figure className={'flex flex-col gap-2'}>
                <Image className={'aspect-square h-fit w-full rounded-xl 2xl:size-[200px]'} src={imgUrl} width={174} height={174} alt={title}/>
                <div className={'flex flex-col'}>
                    <h1 className={'text-16 truncate font-bold text-white-1'}>
                        {title}
                    </h1>
                    <h2 className={'text-12 truncate font-normal text-white-4'}>
                        {description}
                    </h2>
                </div>
            </figure>
        </div>
    )
}
