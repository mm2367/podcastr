"use client"
import {useState} from 'react'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";
import GeneratePodcast from "@/components/GeneratePodcast";
import GenerateThumbnail from "@/components/GenerateThumbnail";
import {Loader} from "lucide-react";
import {Id} from "@/convex/_generated/dataModel";
import {useToast} from "@/hooks/use-toast";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useRouter} from "next/navigation";

const formSchema = z.object({
    podcastTitle: z.string().min(2,),
    podcastDescription: z.string().min(2,),

})

const CreatePodcast = () => {
    const router=useRouter()
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    const [imagePrompt, setImagePrompt] = useState('')
    const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(null);
    const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null);
    const [audioUrl, setAudioUrl] = useState<string>(null);
    const [audioDuration, setAudioDuration] = useState<string>(null);
    const [voicePrompt, setVoicePrompt] = useState<string>(null)
    const [voiceType, setVoiceType] = useState<string>(null);
    const [imageUrl, setImageUrl] = useState('')
    const {toast}=useToast();

    const createPodcast=useMutation(api.podcasts.createPodcast)
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            podcastTitle: "",
            podcastSchema: ""
        },
    })

    // 2. Define a submit handler.
    const onSubmit= async (data: z.infer<typeof formSchema>)=> {
        try{
            setIsSubmitting(true)
            if(!audioUrl || !imageUrl || !voiceType){
                setIsSubmitting(false)
                toast({title:'Please generate audio and image', variant:'destructive'})

                throw new Error('Please generate audio and image complete')
            }
            const podcast=await createPodcast({
                podcastTitle:data.podcastTitle,
                podcastDescription:data.podcastDescription,
                audioUrl,
                imageUrl,
                voiceType,
                imagePrompt,
                voicePrompt,
                views:0,
                audioDuration,
                audioStorageId:audioStorageId,
                imageStorageId:imageStorageId
            })
            toast({title:'Podcast Created'})
            router.push('/')

        }
        catch (e) {
            console.log(e)
            toast({title:'Error Creating podcast', variant:'destructive'})
            setIsSubmitting(false)
        }
    }

    const voiceCategories = ['alloy', 'shimmer', 'nova', 'echo', 'fable', 'onyx']
    return (
        <section className={'mt-10 flex flex-col'}>
            <h1 className={'text-20 font-bold text-white-1'}>Create Podcast</h1>
            <Form {...form} >
                <form className={'mt-12 flex w-full flex-col'} onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8">
                    <div className={'flex flex-col gap-[30px] border-b border-black-5 pb-10'}>
                        <FormField
                            control={form.control}
                            name="podcastTitle"
                            render={({field}) => (
                                <FormItem className={'flex flex-col gap-2.5'}>
                                    <FormLabel className={'text-16 font-bold text-white-1'}>Title</FormLabel>
                                    <FormControl>
                                        <Input className={'input-class focus-visible:ring-orange-1'}
                                               placeholder="Title" {...field} />

                                    </FormControl>
                                    <FormMessage className={'text-white-1'}/>
                                </FormItem>
                            )}
                        />
                        <div className={'flex flex-col gap-2.5'}>
                            <Label className={'text-16 font-bold text-white-1'}>
                                Select AI Voice
                            </Label>
                            <Select onValueChange={(value) => setVoiceType(value)}>
                                <SelectTrigger
                                    className={cn('text-16 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1')}>
                                    <SelectValue placeholder="Select AI Voice" className={'placeholder:text-gray-1'}/>
                                </SelectTrigger>
                                <SelectContent
                                    className={'text-16 border-none bg-black-1 text-white-1 focus:ring-orange-1'}>
                                    {voiceCategories.map((category) => (
                                        <SelectItem className={'capitalize focus:bg-orange-1'} value={category}
                                                    key={category}>{category}</SelectItem>
                                    ))}
                                </SelectContent>
                                {voiceType && (<audio src={`/${voiceType}.mp3`} autoPlay={true} className={'hidden'}/>)}
                            </Select>


                        </div>
                        <FormField
                            control={form.control}
                            name="podcastDescription"
                            render={({field}) => (
                                <FormItem className={'flex flex-col gap-2.5'}>
                                    <FormLabel className={'text-16 font-bold text-white-1'}>Description</FormLabel>
                                    <FormControl>
                                        <Textarea className={'input-class focus-visible:ring-orange-1'}
                                                  placeholder="Write a short podcast description" {...field} />

                                    </FormControl>
                                    <FormMessage className={'text-white-1'}/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className={'flex flex-col pt-10 '}>
                        <GeneratePodcast
                            setAudioStorageId={setAudioStorageId}
                            setAudio={setAudioUrl}
                            setVoiceType={setVoiceType}
                            audio={audioUrl}
                            setVoicePrompt={setVoicePrompt}
                            voicePrompt={voicePrompt}
                            setAudioDuration={setAudioDuration}
                            voiceType={voiceType!}
                        />
                        <GenerateThumbnail setImage={setImageUrl} setImageStorageId={setImageStorageId} image={imageUrl} imagePrompt={imagePrompt} setImagePrompt={setImagePrompt}/>
                        <div className={'mt-10 w-full'}>
                            <Button
                                className={'text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1'}
                                type="submit">{isSubmitting ? (
                                    <>
                                        <Loader size={20} className={'animate-spin mr-3'}/>
                                        Submitting...</>) :
                                ('Submit & Publish Podcast')}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </section>
    )
}
export default CreatePodcast

