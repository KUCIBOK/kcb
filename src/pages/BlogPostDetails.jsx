import { useState, useEffect } from "react"
import DOMPurify from 'dompurify';
import { Link, useParams } from "react-router-dom"
import { getBlogPost } from "../api/useBlogPost"
import { DataLoader } from "../components/loaders/PageLoader"
import { ArrowLeft, Calendar, Tag, User } from "lucide-react"
import { getUserById } from "../api/useAuth"
import { Fragment } from "react"
import { Comments } from "../components/blog/Comments"
import { Helmet } from "react-helmet"
import RevealOnScroll from "../components/landing/RevealOnScroll"

export default function BlogPostDetails(){
    const {id} = useParams()
    const [state, setState] = useState({
        loading : true,
        post : {},
        comments : [],
        author : {},
        error : ""
    })
    useEffect(() => {
        window.scrollTo(0, 0)
        const getPost = async () => {
            try {
                const post = await getBlogPost(id)
                if(post?.id || post?._id){
                    const author = await getUserById(post?.authorId)
                    setState(prev => ({
                        ...prev,
                        loading : false,
                        post : post,
                        comments : post?.comments,
                        author : author
                    }))
                }
                if(post?.error){
                    setState(prev => ({
                        ...prev,
                        loading : false,
                        error : "L'article que vous cherchez n'existe pas"
                    }))
                }
            } catch (error) {
                setState(prev => ({
                    ...prev,
                    loading : false,
                    error : post?.error
                }))
            }
        }
        getPost()
    }, [])
    return (
        <>
        <Helmet>
            <title>{(state?.post?.title ? `${state?.post?.title} | Kucibok` : "Kucibok")}</title>
            <meta name="description" content={state?.post?.excerpt || ""} />
            <meta property="og:title" content={state?.post?.title || "Kucibok"} />
            <meta property="og:description" content={state?.post?.excerpt || ""} />
            <meta property="og:image" content={state?.post?.image || ""} />
            <meta property="og:url" content={`https://kucibok.com/blog/${state?.post?._id || ""}`} />
        </Helmet>
        <div className="w-full lg:w-7/10 px-4 lg:px-6 my-6 mx-auto">
            <div className="flex justify-start items-center mx-auto">
                <Link to={-1} className="rounded-[4px] p-2 text-sm gap-1 text-white hover:bg-white/[0.03] flex items-center">
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                </Link>
            </div>
            {(state?.loading) &&
            <div className="flex justify-center w-full mx-auto">
                <DataLoader/>
            </div> }
            {state?.error && (
                <>
                <div className="flex justify-center py-4 text-center">
                    <h3> {state?.error} </h3>
                </div>
                </>
            )}
            {state?.post?._id && (
                <RevealOnScroll>
                <div className="flex flex-col w-full mx-auto py-4">
                    <h2 className="font-playfair text-[clamp(24px,3vw,36px)] font-bold text-white mb-2 tracking-tight">{state?.post?.title}</h2>
                    <div className="flex items-center gap-4 text-xs text-kcb-pierre mb-6">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(state?.post?.publishDate).toLocaleDateString()}
                        </div>
                        <span className="mx-2">•</span>
                        <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {state?.author?.name}
                        </div>
                    </div>
                    {state?.post?.image && (
                        <img src={state?.post?.image} alt={state?.post?.title} className="w-full object-cover rounded-[4px] h-56 sm:h-72 md:h-80 lg:h-96 mb-6 border border-white/[0.06]" />
                    )}
                    <div className="flex flex-col gap-6 mt-6">
                        <div className="border-b border-white/[0.06] pb-6">
                            <span
                                className="text-base text-white leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(state?.post?.content ?? '') }}
                            />
                        </div>
                        {state?.post?.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {state?.post?.tags?.map((tag, index) => (
                                    <span key={index} className="rounded-[4px] bg-kcb-or/10 text-xs text-kcb-or px-3 py-1 flex items-center gap-1 font-medium border border-kcb-or/20">
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        <Comments post={state?.post} setPostState={setState} postState={state} />
                    </div>
                </div>
                </RevealOnScroll>
            )}
        </div>

        </>
    )
}
