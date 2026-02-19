import { Heart } from "lucide-react"
import { useAuth } from "../../store/AuthContext"
import { useState } from "react"
import { dislikeArtwork, likeArtwork } from "../../api/useArtworks"
import { RegisterOrConnect } from "../decoratives/RegisterOrConnect"

export function LikeHeart({artwork}){
    const {user} = useAuth()
    let likedArtworks = localStorage.getItem('likedArtworks')
    likedArtworks = JSON.parse(likedArtworks) || []
    const [state, setState] = useState({
        likesCount : artwork?.likesCount || 0,
        isLiked : likedArtworks?.includes(artwork._id),
        likedArtworks : likedArtworks || [],
        showModal: false
    })
    const handleLike = async () => {
        if (!user) {
            setState(prev => ({ ...prev, showModal: true }));
            return;
        }
        if (state?.isLiked) {
            setState((prevState) => ({
                ...prevState,
                isLiked: false,
                likesCount: Math.max(0, prevState.likesCount - 1),
                likedArtworks: prevState.likedArtworks.filter((id) => id !== artwork._id),
            }));
            const res = await dislikeArtwork(artwork._id);
            if (res.error) {
                setState((prevState) => ({
                    ...prevState,
                    isLiked: true,
                    likesCount: res.likesCount ?? prevState.likesCount + 1,
                    likedArtworks: [...prevState.likedArtworks, artwork._id],
                }));
            }
        } else {
            setState((prevState) => ({
                ...prevState,
                isLiked: true,
                likesCount: prevState.likesCount + 1,
                likedArtworks: [...prevState.likedArtworks, artwork._id],
            }));
            const res = await likeArtwork(artwork._id);
            if (res.error) {
                setState((prevState) => ({
                    ...prevState,
                    isLiked: false,
                    likesCount: res.likesCount ?? Math.max(0, prevState.likesCount - 1),
                    likedArtworks: prevState.likedArtworks.filter((id) => id !== artwork._id),
                }));
            }
        }
    };

    return (
        <>
        {/* Like button */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-gray-800/70 rounded-full px-2 py-1">
            <button
            onClick={handleLike}
            className="p-1 rounded-full hover:scale-110 transition"
            >
            <Heart
                className={`w-5 h-5 ${
                state?.isLiked ? "fill-red-500 stroke-red-500" : "stroke-white"
                }`}
            />
            </button>
            <span className="text-xs text-gray-300">{state?.likesCount}</span>
        </div>
        {state.showModal && <RegisterOrConnect open={state.showModal} onClose={() => setState(prev => ({ ...prev, showModal: false }))} />}
        </>
    )
}