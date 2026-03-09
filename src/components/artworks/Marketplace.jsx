import { memo } from "react";
import { ArtworkCard } from "./ArtworkCard";
import { Search } from "lucide-react";
import RevealOnScroll from "../decoratives/RevealOnScroll";

export const Marketplace = memo(({ artworks }) => {
    return (
        <div className="w-full">
            {artworks?.length >= 1 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {artworks.map((item, index) => (
                        <RevealOnScroll key={item._id || index}>
                            <ArtworkCard artwork={item} />
                        </RevealOnScroll>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-800 rounded-xl bg-gray-900/70 w-full min-h-[300px]">
                    <Search className="h-10 w-10 mb-4 text-gray-500" />
                    <h3 className="font-serif text-lg font-semibold text-gray-200 mb-1">Aucune œuvre trouvée</h3>
                    <p className="text-gray-400 text-sm max-w-xs text-center">
                        Nous n'avons trouvé aucune œuvre correspondant à votre recherche.
                    </p>
                </div>
            )}
        </div>
    );
});