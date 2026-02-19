import { useState } from "react"
import { useAuth } from "../../store/AuthContext"
import { Fragment } from "react"
import { getUserById } from "../../api/useAuth"
import { User } from "lucide-react"
import { DataLoader } from "../loaders/PageLoader"
import { addComment } from "../../api/useBlogPost"
import { useEffect } from "react"
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";



export function Comments({ post, setPostState, postState }) {
    const { user } = useAuth();
    const [state, setState] = useState({
        content: "",
        loading: false,
        error: ""
    });
    const handleComment = async (e) => {
        e.preventDefault();
        setState(s => ({ ...s, error: "", loading: true }));
        try {
            if (user?._id) {
                const updatedPost = await addComment(post?._id, {
                    authorId: user?.id,
                    content: state?.content
                });
                if (updatedPost?._id || updatedPost?.id) {
                    setPostState(prev => ({
                        ...prev,
                        post: updatedPost,
                        comments: updatedPost?.comments
                    }));
                    setState(s => ({ ...s, error: "", content: "", loading: false }));
                }
                setState(s => ({ ...s, error: updatedPost?.error, loading: false }));
            } else {
                setState(s => ({ ...s, error: "Connectez-vous pour commenter.", loading: false }));
            }
        } catch (error) {
            setState(s => ({ ...s, loading: false, error: error.message }));
        }
    };
    return (
        <div className="w-full max-w-6xl mx-auto">
            <h3 className="font-serif text-lg font-semibold text-white mb-2 tracking-tight">Commentaires</h3>
            {state?.error && (
                <div className="border border-red-500 bg-red-900/80 rounded-md p-3 text-xs text-red-200 mb-3">
                    {state?.error}
                </div>
            )}
            <div className="space-y-3 mb-5">
                {postState?.comments?.length ? (
                    postState?.comments?.slice().reverse().map((comment, idx) => (
                        <CommentItem key={idx} comment={comment} />
                    ))
                ) : (
                    <div className="text-center text-gray-500 text-xs py-6">Aucun commentaire. Soyez le premier.</div>
                )}
            </div>
            <form onSubmit={handleComment} method="post" className="bg-background border border-gray-800 rounded-lg p-3">
                <ReactQuill
                    theme="bubble"
                    value={state.content}
                    onChange={value => setState(s => ({ ...s, content: value }))}
                    className="bg-white border border-gray-700 rounded-sm mb-4 text-sm text-black"
                    placeholder="Ajouter un commentaire..."
                />
                <div className="flex justify-end">
                    <button
                        className="rounded px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 transition focus:outline-none focus:ring-2 focus:ring-purple-700"
                        disabled={state.loading || !state.content.trim()}
                        type="submit"
                    >
                        {state?.loading ? <DataLoader /> : 'Commenter'}
                    </button>
                </div>
            </form>
        </div>
    );
}



function CommentItem({ comment }) {
    const [author, setAuthor] = useState({});
    useEffect(() => {
        const getUser = async () => {
            const data = await getUserById(comment?.authorId);
            setAuthor(data || {});
        };
        getUser();
    }, [comment?.authorId]);
    return (
        <div className="flex items-start gap-2 p-2 rounded bg-background border border-gray-800">
            <div className="rounded-full bg-earth/20 flex items-center justify-center w-8 h-8">
                <User className="w-4 h-4 text-earth" />
            </div>
            <div className="flex-1">
                <div className="text-xs text-gray-400 font-medium mb-0.5">{author?.name || "Utilisateur"}</div>
                <div className="text-xs text-white font-normal">
                    <span dangerouslySetInnerHTML={{ __html: comment?.content }} />
                </div>
            </div>
        </div>
    );
}