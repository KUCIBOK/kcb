import { memo } from "react";
import { ArtistCard } from "./ArtistCard";
import { Search } from "lucide-react";
import RevealOnScroll from "../decoratives/RevealOnScroll";

export const ArtistList = memo(({ artists }) => {
  return (
    <>
      {artists?.length >= 1 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
          {artists.map((artist, index) => (
            <div
              key={artist.id}
              className="animate-fade-in"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <RevealOnScroll>
                <ArtistCard artist={artist} />
              </RevealOnScroll>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-border border-dashed rounded-lg w-full">
          <Search className="h-12 w-12 mx-auto mb-4 text-white" />
          <h3 className="font-medium text-lg mb-1">Aucun artiste trouvé</h3>
          <p className="text-white">Nous n'avons trouvé aucun artiste.</p>
        </div>
      )}
    </>
  );
});
