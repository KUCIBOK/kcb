import { useState } from 'react'
import { useAuth } from '../../store/AuthContext'
import { Fragment } from 'react'
import { getUserById } from '../../api/useAuth'
import { User } from 'lucide-react'
import { DataLoader } from '../loaders/PageLoader'
import { addComment } from '../../api/useBlogPost'
import { useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.bubble.css'
import DOMPurify from 'dompurify'

export function Comments({ post, setPostState, postState }) {
  const { user } = useAuth()
  const [state, setState] = useState({
    content: '',
    loading: false,
    error: '',
  })
  const handleComment = async (e) => {
    e.preventDefault()
    setState((s) => ({ ...s, error: '', loading: true }))
    try {
      if (user?.id) {
        const updatedPost = await addComment(post?.id || post?._id, {
          authorId: user?.id,
          content: state?.content,
        })
        if (updatedPost?._id || updatedPost?.id) {
          setPostState((prev) => ({
            ...prev,
            post: updatedPost,
            comments: updatedPost?.comments,
          }))
          setState((s) => ({ ...s, error: '', content: '', loading: false }))
        }
        setState((s) => ({ ...s, error: updatedPost?.error, loading: false }))
      } else {
        setState((s) => ({ ...s, error: 'Connectez-vous pour commenter.', loading: false }))
      }
    } catch (error) {
      setState((s) => ({ ...s, loading: false, error: error.message }))
    }
  }
  return (
    <div className="w-full max-w-6xl mx-auto">
      <h3 className="font-serif text-lg font-semibold text-white mb-2 tracking-tight">
        Commentaires
      </h3>
      {state?.error && (
        <div className="border border-red-500 bg-red-900/80 rounded-[4px] p-3 text-xs text-red-200 mb-3">
          {state?.error}
        </div>
      )}
      <div className="space-y-3 mb-5">
        {postState?.comments?.length ? (
          postState?.comments
            ?.slice()
            .reverse()
            .map((comment, idx) => <CommentItem key={idx} comment={comment} />)
        ) : (
          <div className="text-center text-kcb-pierre text-xs py-6">
            Aucun commentaire. Soyez le premier.
          </div>
        )}
      </div>
      <form
        onSubmit={handleComment}
        method="post"
        className="bg-kcb-noir border border-white/[0.06] rounded-[4px] p-3"
      >
        <ReactQuill
          theme="bubble"
          value={state.content}
          onChange={(value) => setState((s) => ({ ...s, content: value }))}
          className="bg-white border border-white/[0.08] rounded-sm mb-4 text-sm text-black"
          placeholder="Ajouter un commentaire..."
        />
        <div className="flex justify-end">
          <button
            className="rounded px-4 py-1.5 text-xs font-semibold text-kcb-noir bg-gradient-to-r from-kcb-or to-kcb-bronze hover:from-kcb-or/90 hover:to-kcb-bronze/90 transition focus:outline-none focus:ring-2 focus:ring-kcb-or"
            disabled={state.loading || !state.content.trim()}
            type="submit"
          >
            {state?.loading ? <DataLoader /> : 'Commenter'}
          </button>
        </div>
      </form>
    </div>
  )
}

function CommentItem({ comment }) {
  const [author, setAuthor] = useState({})
  useEffect(() => {
    const getUser = async () => {
      const data = await getUserById(comment?.authorId)
      setAuthor(data || {})
    }
    getUser()
  }, [comment?.authorId])
  return (
    <div className="flex items-start gap-2 p-2 rounded-[4px] bg-kcb-noir border border-white/[0.06]">
      <div className="rounded-full bg-kcb-or/10 flex items-center justify-center w-8 h-8">
        <User className="w-4 h-4 text-kcb-or" />
      </div>
      <div className="flex-1">
        <div className="text-xs text-kcb-pierre font-medium mb-0.5">
          {author?.name || 'Utilisateur'}
        </div>
        <div className="text-xs text-white font-normal">
          <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment?.content ?? '') }} />
        </div>
      </div>
    </div>
  )
}
