import React from 'react'
import {SignIn} from "@clerk/nextjs";

const Page = () => {
    return (
        <div className={'flex-center glassmorphism-auth h-screen w-full'}><SignIn routing={'hash'}/></div>
    )
}
export default Page
