import { useArtworks } from "../../../store/ArtworkContext";
import { useNavigate } from "react-router-dom";
import { DataLoader } from "../../loaders/PageLoader";

export const Step4 = ({formState, setFormState, user, profile}) => {
    const navigate = useNavigate()
    const {submitArtwork} = useArtworks()
    const submit = async () => {
        try {
            setFormState({...formState, loading : true})
            let data = {...formState}
            if(user?.role == "artist"){
                data.artist = profile?.name
            }
            else{
                data.artist = formState.artist
            }
            data.artistId = profile?._id
            delete data.step
            delete data.tag
            delete data.loading
            delete data.show
            delete data.error
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });
            const artwork = await submitArtwork(formData);
            if(artwork?.error){
                setFormState({...formState, loading : false})
                return
            }
            if(artwork?._id){
                user?.role == "artist" ? navigate("/dashboard/artist") : navigate("/dashboard/professional")
            }
            setFormState({...formState, loading : false})
        } catch (error) {
            setFormState({...formState, loading : false})
        }
    };

    return (
        <div className="bg-gray-900 p-8 rounded-xl shadow-xl border border-gray-800 max-w-2xl mx-auto">
            <h4 className="text-xl font-bold text-white mb-6 tracking-tight text-center">Vérifiez votre soumission</h4>
            <div className="space-y-4">
                {/* Image */}
                <div className="pt-0 flex flex-col items-center">
                    <span className="text-xs uppercase text-gray-400 tracking-widest mb-1">Image</span>
                    {formState?.image && (
                        <img
                            src={formState?.show}
                            alt="Artwork preview"
                            className="max-h-[220px] rounded-lg object-contain border border-gray-800 shadow-md bg-gray-900"
                        />
                    )}
                </div>
                {/* Titre */}
                <div className="pt-6">
                    <span className="text-xs uppercase text-gray-400 tracking-widest">Titre</span>
                    <p className="text-lg font-semibold text-white mt-1">{formState?.title}</p>
                </div>
                {/* Description */}
                <div className="pt-6">
                    <span className="text-xs uppercase text-gray-400 tracking-widest">Description</span>
                    <div className="text-gray-300 text-base mt-1 prose prose-invert max-w-none">
                        <span dangerouslySetInnerHTML={{ __html: formState?.description }}></span>
                    </div>
                </div>
                {/* Mensurations */}
                <div className="pt-6">
                    <span className="text-xs uppercase text-gray-400 tracking-widest">Mensurations</span>
                    <p className="text-gray-300 mt-1">
                        {formState?.height} cm de haut, {formState?.width} cm de large, <br />
                        pour {formState?.weight} kilogrammes.
                    </p>
                </div>
                {/* Artiste */}
                <div className="pt-6">
                    <span className="text-xs uppercase text-gray-400 tracking-widest">Artiste</span>
                    <p className="text-gray-300 mt-1">{formState?.artist}</p>
                </div>
                {/* Prix */}
                <div className="pt-6">
                    <span className="text-xs uppercase text-gray-400 tracking-widest">Prix</span>
                    <p className="text-gray-300 mt-1">
                        {formState?.price?.toLocaleString('fr-FR').replace(/\s/g, ' ')} {formState?.currency}
                    </p>
                </div>
                {/* Tags */}
                <div className="pt-6">
                    <span className="text-xs uppercase text-gray-400 tracking-widest">Mots-clés</span>
                    <div className="flex flex-wrap gap-2 mt-2 min-h-[36px]">
                        {formState?.tags.map((tag, index) => (
                            <span
                                key={tag}
                                className="bg-purple-700/70 flex items-center gap-1 text-white rounded-full px-3 py-1 text-xs font-semibold animate-fade-in shadow-sm group cursor-pointer hover:bg-purple-800 transition-all"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-10">
                <button
                    onClick={() => {
                        setFormState({ ...formState, step: formState?.step - 1 });
                    }}
                    className="p-2 text-sm rounded-lg bg-gray-900 border border-gray-700 text-white hover:bg-gray-800 transition-all shadow focus:outline-none focus:ring-2 focus:ring-indigo-kcb"
                    type="button"
                >
                    Précédent
                </button>
                <button
                    disabled={formState?.loading}
                    onClick={submit}
                    className="p-2 text-sm rounded-lg bg-indigo-kcb text-white font-semibold hover:bg-indigo-800 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-kcb disabled:opacity-50"
                    type="button"
                >
                    {formState?.loading ? <DataLoader /> : "Soumettre"}
                </button>
            </div>
        </div>
    );
}