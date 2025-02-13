import React, {useRef, useState} from 'react'
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Loader} from "lucide-react";
import {GenerateThumbnailProps} from "@/app/types";
import {Input} from "@/components/ui/input";
import Image from "next/image";
import {toast, useToast} from "@/hooks/use-toast";
import {useAction, useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {v4 as uuidv4} from 'uuid';
import {useUploadFiles} from "@xixixao/uploadstuff/react";
import {generateThumbnailAction} from "@/convex/openai";
const GenerateThumbnail = ({
                               setImage,
                               setImageStorageId,
                               image,
                               imagePrompt,
                               setImagePrompt
                           }: GenerateThumbnailProps) => {
    const [isAiThumbnail, setIsAiThumbnail] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const imageRef = useRef<HTMLInputElement>(null)
    const {toast}=useToast();
    const generateUploadUrl = useMutation(api.files.generateUploadUrl)
    const {startUpload} = useUploadFiles(generateUploadUrl);
    const getImageUrl = useMutation(api.podcasts.getUrl);
    const handleGenerateThumbnail =useAction(api.openai.generateThumbnailAction)

    const generateImage = async (e:React.ChangeEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try{
            setIsImageLoading(true)
            const response =await handleGenerateThumbnail({prompt:imagePrompt})
            const blob = new Blob([response],{type:'image/png'})
            await handleImage(blob,`thumbnail-${uuidv4()}.png`)
            setIsImageLoading(false);
            toast({
                title: "Thumbnail generated successfully",
                variant: 'default'
            })
        }
        catch (e) {
            setIsImageLoading(false)
            console.log(e)
            toast({title:'Error generating Thumbnail', variant:'destructive'})
        }

    };
    const handleImage=async (blob:Blob,fileName:string)=>{
        setIsImageLoading(true)
        setImage(null)
        try{
            const file = new File([blob], fileName, { type: 'image/png' });

            const uploaded = await startUpload([file]);
            const storageId = (uploaded[0].response as any).storageId;
            setImageStorageId(storageId)

            const imageUrl = await getImageUrl({storageId})
            setImage(imageUrl!)
            setIsImageLoading(false)
            toast({
                title: "Thumbnail generative successfully",
                variant: 'default'
            })
        }
        catch (e) {
           console.log('error',e)
           toast({title:'Error Generating thumnail', variant:'destructive'})
        }
    }

    const uploadImage= async (e:React.ChangeEvent<HTMLInputElement>)=>{
        e.preventDefault();
        try{
            const files=e.target.files;
            if(!files) return
            const file=files[0]
            const blob= await file.arrayBuffer().then((ab)=>{
                return new Blob([ab])
            })
            await handleImage(blob,file.name)
        }
        catch (e) {
            console.log('error',e)
            toast({title:'Error Generating thumnail', variant:'destructive'})
        }
    }
    return (
        <>
            <div className={'generate_thumbnail'}>
                <Button onClick={() => setIsAiThumbnail(true)} className={cn('', {'bg-black-6': isAiThumbnail})}
                        type={'button'} variant={'plain'}>
                    Use AI to generate Thumbnail
                </Button>
                <Button onClick={() => setIsAiThumbnail(false)} className={cn('', {'bg-black-6': !isAiThumbnail})}
                        type={'button'} variant={'plain'}>
                    Upload Custom Image
                </Button>
            </div>
            {isAiThumbnail ? (
                <div className={'flex flex-col gap-5 mt-5'}>
                    <div className={'flex flex-col gap-2.5'}>
                        <Label className={'text-16 font-bold text-white-1'}>
                            AI Prompt to generate thumbnail
                        </Label>
                        <Textarea className={'input-class font-light focus-visible:ring-orange-1'}
                                  placeholder={'Provide text to generate thumbnail'} rows={5}
                                  value={imagePrompt}
                                  onChange={(e) => setImagePrompt(e.target.value)}
                        />


                    </div>
                    <div className={'w-full max-w-[200px]'}>
                        <Button
                            className={'text-16 bg-orange-1 py-4 font-bold text-white-1'}
                            type="submit" onClick={generateImage}>{isImageLoading ? (
                                <>
                                    <Loader size={20} className={'animate-spin mr-3'}/>
                                    Submitting...</>) :
                            ('Generate')}
                        </Button>
                    </div>
                </div>
            ) : (<div className={'image_div'} onClick={() => imageRef?.current?.click()}>
                <Input type={'file'}
                       className={'hidden'}
                       ref={imageRef}
                       onChange={(event)=> uploadImage(event)}
                />
                {!isImageLoading ? (
                    <Image src={'/icons/upload-image.svg'}  width={40} height={40} alt={'alt'}/>) :
                    (<div className={'text-16 flex-center font-medium text-white-1'}>Uploading...<Loader size={20}
                                                                                                         className={'animate-spin'}/>
                    </div>)}
                <div className={'flex flex-col items-center gap-1'}>
                    <h2 className={'text-12 font-bold text-orange-1'}>
                        Click to upload
                    </h2>
                    <p className={'text-12 font-normal text-gray-1'}> SVG,PNG,JPG or GIF (max. 1080p x 1080p</p>
                </div>
            </div>
            )}
            {image && (
                <div className={'flex-center w-full'}>
                    <Image src={image} width={200} height={200} className={'mt-5 '} alt={'thumbnail'}/>

                </div>
            )}
        </>
    )
}
export default GenerateThumbnail
