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
                <div className="bg-gray-900 border-2 border-gray-800 border-dashed rounded-xl p-8 text-center transition-all">
                    {formState.image ? (
                        <div className="space-y-4 animate-fade-in-up">
                            <img 
                                src={formState.show} 
                                alt="Artwork preview" 
                                className="max-h-[280px] mx-auto rounded-lg object-contain border border-gray-800 shadow"
                            />
                            <button type="button" className="px-4 py-2 text-sm text-white font-medium rounded-md border border-gray-700 bg-gray-900 hover:bg-gray-800 transition" onClick={() => setFormState({...formState, image : null, show: ''})}>
                                Changer l'image
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => document.getElementById('artwork-image').click()} className="flex flex-col items-center justify-center py-6 cursor-pointer group">
                                <Image className="w-12 h-12 text-indigo-kcb mb-2 group-hover:scale-110 transition-transform" />
                                <p className="text-sm text-gray-400 group-hover:text-white transition-colors">
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
                    className="pp-2 text-sm rounded-lg bg-gray-900 border border-gray-700 text-white font-medium hover:bg-gray-800 transition"
                    type="button"
                >
                    Précédent
                </button>
                <button
                    onClick={() => { if(formState.image){ setFormState({...formState, step : formState.step + 1}) } }}
                    className={`pp-2 text-sm rounded-lg bg-indigo-kcb text-white font-semibold transition ${!formState.image ? 'opacity-60 cursor-not-allowed' : 'hover:bg-indigo-800'}`}
                    type="button"
                    disabled={!formState.image}
                >
                    Suivant
                </button>
            </div>
        </div>
    )
})

