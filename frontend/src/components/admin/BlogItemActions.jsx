import { Archive, Eye, Pen, Upload } from "lucide-react"
import { useState } from "react"
import { useBlog } from "../../store/BlogContext"
import { Link } from "react-router-dom"
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Modal, Input, Button, toast } from "../ui";
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export function BlogItemActions({post}) {
    const [state, setState] = useState({
        updateModal : false,
        loading : false
    })
    const {publishPost, archivePost} = useBlog()
    const handlePublishing = async () => {
        try {
            setState(prev => ({
                ...prev,
                loading : true
            }))
            const published = await publishPost(post?._id)
            if(published?._id || published?.id){
                setState(prev => ({
                    ...prev,
                    loading : false
                }))
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading : false
            }))
        }
    }

    const handleArchiving = async () => {
        try {
            setState(prev => ({
                ...prev,
                loading : true
            }))
            const published = await archivePost(post?._id)
            if(published?._id || published?.id){
                setState(prev => ({
                    ...prev,
                    loading : false
                }))
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading : false
            }))
        }
    }

    return (
        <>
        <div className="flex items-center gap-1">
            <Link
                to={`/blog/${post?._id || post?.id}`}
                className="rounded-full bg-gray-900 p-2 hover:bg-gray-800 transition flex items-center justify-center shadow-none border-none"
                title="Voir l'article"
            >
                <Eye className="w-4 h-4 text-purple-kcb"/>
            </Link>
            <button
                onClick={() => setState({...state, updateModal : true})}
                className="rounded-full bg-gray-900 p-2 hover:bg-gray-800 transition flex items-center justify-center shadow-none border-none"
                title="Modifier"
            >
                <Pen className="w-4 h-4 text-indigo-400" />
            </button>
            {post?.status == 'published' && (
                <button
                    onClick={handleArchiving}
                    className="rounded-full bg-gray-900 p-2 hover:bg-gray-800 transition flex items-center justify-center shadow-none border-none"
                    title="Archiver"
                >
                    {state?.loading ? <DataLoader/> : <Archive className="w-4 h-4 text-red-500" />}
                </button>
            )}
            {post?.status == 'archived' && (
                <button
                    onClick={handlePublishing}
                    className="rounded-full bg-gray-900 p-2 hover:bg-gray-800 transition flex items-center justify-center shadow-none border-none"
                    title="Publier"
                >
                    {state?.loading ? <DataLoader/> : <Upload className="w-4 h-4 text-green-500" />}
                </button>
            )}
        </div>
        {state?.updateModal && <UpdatePostModal post={post} closeModal={() => setState({...state, updateModal : false})} />}
        </>
    )
}


function UpdatePostModal({post, closeModal}){
    const {updatePost} = useBlog()
    const [state, setState] = useState({
        title : post?.title,
        excerpt : post?.excerpt,
        image : post?.image,
        content : post?.content,
        loading : false,
        error : "",
        show : ""
    })
    const handleUpdatePost = async function (e) {
        e.preventDefault()
        setState({...state, loading : true})
        try {
            const charge = {...state}
            delete charge.loading
            delete charge.show
            const formData = new FormData()
            Object.keys(charge).forEach((key) => {
                if(key == 'image'){
                    formData.append('image', charge?.image, charge?.image?.filename)
                    return
                }
                formData.append(key, charge[key])
            })
            const updated = await updatePost(post?._id, formData)
            if(updated?._id){
                toast.success('✓ Article mis à jour');
                closeModal()
            } else {
                toast.error('× ' + (updated?.error || 'Erreur'));
            }
            setState({...state, loading : false})
        } catch (error) {
            toast.error('× Erreur serveur');
            setState({...state, loading : false})
        }
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setState({ ...state, image : file, show: reader.result });
            };
            reader.readAsDataURL(file);
        }
    }
    return (
        <Modal
            isOpen={true}
            onClose={closeModal}
            title="Modifier l'article"
            size="md"
        >
            <form onSubmit={handleUpdatePost} method="post" className="space-y-4 max-h-[70vh] overflow-y-auto">
                <Input
                    label="Titre"
                    value={state.title}
                    onChange={e => setState({...state, title: e.target.value})}
                    placeholder="Titre de l'article"
                    minLength={5}
                    required
                />

                <Input
                    label="Extrait"
                    value={state.excerpt}
                    onChange={e => setState({...state, excerpt: e.target.value})}
                    placeholder="Extrait de l'article"
                    minLength={5}
                    required
                />

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm"
                    />
                    {state?.show && (
                        <div className="mt-2 flex justify-center">
                            <img src={state.show} alt="aperçu" className="rounded-lg h-20 object-contain" />
                        </div>
                    )}
                </div>

                {/* Content Editor */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Contenu</label>
                    <ReactQuill
                        theme="snow"
                        value={state.content}
                        onChange={value => setState({ ...state, content: value })}
                        className="border border-gray-800 rounded-lg bg-white text-black"
                        placeholder="Contenu de votre article"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={closeModal}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        disabled={state.loading}
                        loading={state.loading}
                    >
                        Enregistrer
                    </Button>
                </div>
            </form>
        </Modal>
    )
}