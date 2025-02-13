'use client';
import React from 'react'
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import {PodcastCard} from "@/components/PodcastCard";
import SearchBar from "@/components/SearchBar";

const Discover = ({searchParams:{search}}:{searchParams:{search:string}}) => {
    const podcastData = useQuery(api.podcasts.getPodcastBySearch, { search: search || '' })
    return (
        <div className={'flex flex-col gap-9'}>
            <SearchBar/>
            <div className={'flex flex-col gap-9'}>
                <h1 className={'text-20 font-bold text-white-1'}>
                    {!search ? 'Discover trending podcasts':'Search results for: '}
                    {search && <span className={'text-white-2'}> {search}</span>}
                </h1>
                {podcastData ? (
                        <>
                            {podcastData.length>0?(
                                <div className={'podcast_grid'}>
                                    {podcastData?.map(({_id, podcastTitle, podcastDescription, imageUrl}) => (
                                        <PodcastCard key={_id} podcastId={_id} imgUrl={imageUrl} title={podcastTitle} description={podcastDescription}/>
                                    ))}
                                </div>
                            ):<EmptyState title={'No result found'}/>}
                        </>
                    ) : <LoaderSpinner/>
                    }
            </div>
        </div>
    )
}
export default Discover
