import { Heart } from "lucide-react"
import { useAuth } from "../../store/AuthContext"
import { useRef, useState } from "react"
import { dislikeArtwork, likeArtwork } from "../../api/useArtworks"
import { RegisterOrConnect } from "../decoratives/RegisterOrConnect"

/**
 * Lit les IDs likes depuis localStorage.
 *
 * @returns {string[]}
 */
function readLikedIds() {
    try { return JSON.parse(localStorage.getItem('likedArtworks')) || []; }
    catch { return []; }
}

/**
 * Persiste les IDs likes dans localStorage.
 *
 * @param {string[]} ids
 */
function writeLikedIds(ids) {
    localStorage.setItem('likedArtworks', JSON.stringify(ids));
}

export function LikeHeart({artwork}){
    const {user} = useAuth()
    const artworkId = artwork?._id || artwork?.id;
    const likedArtworks = readLikedIds();
    const isPending = useRef(false);
    const [state, setState] = useState({
        likesCount : artwork?.likesCount || 0,
        isLiked : likedArtworks.includes(artworkId),
        showModal: false
    })
    const handleLike = async () => {
        if (isPending.current) return;
        if (!user) {
            setState(prev => ({ ...prev, showModal: true }));
            return;
        }
        isPending.current = true;
        try {
            if (state?.isLiked) {
                const updated = readLikedIds().filter((id) => id !== artworkId);
                writeLikedIds(updated);
                setState((prevState) => ({
                    ...prevState,
                    isLiked: false,
                    likesCount: Math.max(0, prevState.likesCount - 1),
                }));
                const res = await dislikeArtwork(artworkId);
                if (res.error) {
                    const reverted = [...readLikedIds(), artworkId];
                    writeLikedIds(reverted);
                    setState((prevState) => ({
                        ...prevState,
                        isLiked: true,
                        likesCount: res.likesCount ?? prevState.likesCount + 1,
                    }));
                }
            } else {
                const updated = [...readLikedIds(), artworkId];
                writeLikedIds(updated);
                setState((prevState) => ({
                    ...prevState,
                    isLiked: true,
                    likesCount: prevState.likesCount + 1,
                }));
                const res = await likeArtwork(artworkId);
                if (res.error) {
                    const reverted = readLikedIds().filter((id) => id !== artworkId);
                    writeLikedIds(reverted);
                    setState((prevState) => ({
                        ...prevState,
                        isLiked: false,
                        likesCount: res.likesCount ?? Math.max(0, prevState.likesCount - 1),
                    }));
                }
            }
        } finally {
            isPending.current = false;
        }
    };

    return (
        <>
        {/* Like button */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-kcb-noir/70 rounded-full px-2 py-1">
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
            <span className="text-xs text-kcb-sable">{state?.likesCount}</span>
        </div>
        {state.showModal && <RegisterOrConnect open={state.showModal} onClose={() => setState(prev => ({ ...prev, showModal: false }))} />}
        </>
    )
}