import { Image } from "lucide-react";
import { memo } from "react";

export const Step2 = memo(({formState, setFormState}) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormState({ ...formState, image : file, show: reader.result });
            };
            reader.readAsDataURL(file);
        }
    }
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormState({ ...formState, show: reader.result, image: file });
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="image" className="text-sm text-white font-semibold mb-2 block">Image</label>
                <div className="bg-kcb-ardoise border-2 border-white/[0.06] border-dashed rounded-[4px] p-8 text-center transition-all">
                    {formState.image ? (
                        <div className="space-y-4 animate-fade-in-up">
                            <img 
                                src={formState.show} 
                                alt="Artwork preview" 
                                className="max-h-[280px] mx-auto rounded-[4px] object-contain border border-white/[0.06] shadow"
                            />
                            <button type="button" className="px-4 py-2 text-sm text-white font-medium rounded-[4px] border border-white/[0.06] bg-kcb-ardoise hover:bg-kcb-ardoise transition" onClick={() => setFormState({...formState, image : null, show: ''})}>
                                Changer l'image
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.getElementById('artwork-image').click(); } }} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => document.getElementById('artwork-image').click()} className="flex flex-col items-center justify-center py-6 cursor-pointer group focus-visible:ring-2 focus-visible:ring-kcb-or rounded-[4px] outline-none">
                                <Image className="w-12 h-12 text-kcb-or mb-2 group-hover:scale-110 transition-transform" />
                                <p className="text-sm text-kcb-pierre group-hover:text-white transition-colors">
                                    Glissez-déposez l'image ici, ou <span className="underline">cliquez</span> pour sélectionner un fichier
                                </p>
                            </div>
                            <input
                                className="hidden"
                                id="artwork-image"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-between mt-8">
                <button
                    onClick={() => setFormState({...formState, step : formState.step - 1})}
                    className="p-2 text-sm rounded-[4px] bg-kcb-ardoise border border-white/[0.06] text-white font-medium hover:bg-kcb-ardoise transition"
                    type="button"
                >
                    Précédent
                </button>
                <button
                    onClick={() => { if(formState.image){ setFormState({...formState, step : formState.step + 1}) } }}
                    className={`p-2 text-sm rounded-[4px] bg-kcb-or text-kcb-noir font-semibold transition ${!formState.image ? 'opacity-60 cursor-not-allowed' : 'hover:bg-kcb-or/90'}`}
                    type="button"
                    disabled={!formState.image}
                >
                    Suivant
                </button>
            </div>
        </div>
    )
})

