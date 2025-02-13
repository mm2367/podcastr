'use client';

import {SignedIn, UserButton, useUser} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import EmblaCarousel from "@/components/EmblaCarousel";
import {useRouter} from "next/navigation";
import LoaderSpinner from "@/components/LoaderSpinner";
import {useAudio} from "@/app/Providers/audioProvider";
import {cn} from "@/lib/utils";

const RightSideBar = () => {
    const {user} = useUser();
    const topPodcasters= useQuery(api.users.getTopUserByPodcastCount)
    const router=useRouter()
    console.log(topPodcasters)
    if(!topPodcasters ){
        return <LoaderSpinner/>
    }
    const {audio}= useAudio();
    return (
        <section className={cn('right_sidebar h-[calc(100vh-5px)]',{'h-[calc(100vh-140px)]':audio?.audioUrl})}>
            <SignedIn>
                <Link href={`/profile/${user?.id}`} className={'flex gap-3 pb-12'}>
                    <UserButton/>
                    <div className={'flex w-full items-center justify-between'}>
                        <h1 className={'text-16 truncate font-semibold text-white-1'}>
                            {user?.firstName} {user?.lastName}
                        </h1>
                        <Image src={'/icons/right-arrow.svg'} alt={'arrow'} width={24} height={24}/>
                    </div>
                </Link>

            </SignedIn>
            <section>
                <Header headerTitle={'Fans Like You'}/>
                <EmblaCarousel fansLikeDetail={topPodcasters!}/>
            </section>
            <section className={'flex flex-col gap-8 pt-12'}>
                <Header headerTitle={'Top Podcasters'}/>
                <div className={'flex flex-col gap-6'}>
                    {topPodcasters?.slice(0,4).map((indivPodcaster)=>(
                        <div key={indivPodcaster._id} className={'flex cursor-pointer justify-between'} onClick={()=>router.push(`/profile/${indivPodcaster.clerkId}`)}>
                            <figure className={'flex items-center gap-2 '}>
                                <Image src={indivPodcaster.imageUrl} alt={indivPodcaster.name} width={44} height={44} className={'aspect-square rounded-lg'}/>
                                <h2 className={'text-14 font-semibold text-white-1'}>
                                    {indivPodcaster.name}
                                </h2>
                            </figure>
                            <div className={'flex items-center'}>
                                <p className={'text-12 font-normal'}>
                                    {`${indivPodcaster.totalPodcasts} ${indivPodcaster.totalPodcasts>1 ? 'Podcasts':'Podcast'}`}
                                </p>
                            </div>
                        </div>

                    ))
                    }
                </div>
            </section>
        </section>
    )
}
export default RightSideBar
