import React from 'react'
import {EmptyStateProps} from "@/app/types";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const EmptyState = ({title, search, buttonLink, buttonText}:EmptyStateProps) => {
    return (
        <secion className={'flex-center size-full flex-col gap-3'}>
            <Image src={'/icons/emptyState.svg'} alt={'empty state'} height={250} width={250}/>
            <div className={'flex-center w-full max-w-[254px] flex-col gap-3'}>
                <h1 className={'text-16 text-center font-medium text-white-1'}>
                    {title}
                </h1>
                {search &&(
                    <p className={'text-16 text-center font-medium text-white-2'}>
                        Try adjusting your search to find what you're looking for
                    </p>
                )}
                {buttonLink &&(
                    <Button className={'bg-orange-1'}>
                        <Link href={buttonLink} className={'gap-1 flex '}>
                            <Image src={'/icons/discover.svg'} alt={'discover'} height={20} width={20}/>
                            <h1 className={'text-16 font-extrabold text-white-1'}>
                                Discover more podcasts
                            </h1>
                        </Link>
                    </Button>
                )}
            </div>
        </secion>
    )
}
export default EmptyState
