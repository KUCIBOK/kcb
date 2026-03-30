import { memo } from "react";
import { ArtworkCard } from "./ArtworkCard";
import { Search } from "lucide-react";
import RevealOnScroll from "../decoratives/RevealOnScroll";

export const Marketplace = memo(({ artworks }) => {
    return (
        <div className="w-full">
            {artworks?.length >= 1 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {artworks.map((item, index) => (
                        <RevealOnScroll key={item._id || index}>
                            <ArtworkCard artwork={item} />
                        </RevealOnScroll>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/[0.06] rounded-[4px] bg-kcb-ardoise/30 w-full min-h-[300px]">
                    <Search className="h-10 w-10 mb-4 text-kcb-pierre" />
                    <h3 className="font-serif text-lg font-semibold text-white mb-1">Aucune œuvre trouvée</h3>
                    <p className="text-kcb-pierre text-sm max-w-xs text-center">
                        Nous n'avons trouvé aucune œuvre correspondant à votre recherche.
                    </p>
                </div>
            )}
        </div>
    );
});