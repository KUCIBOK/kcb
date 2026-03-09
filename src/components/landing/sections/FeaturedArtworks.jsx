import { Marketplace } from "../../artworks/Marketplace";
import { useArtworks } from "../../../store/ArtworkContext";
import { DataLoader } from "../../loaders/PageLoader";

export default function FeaturedArtworks() {
  const { forSale } = useArtworks();

  if (!forSale || forSale.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <DataLoader />
      </div>
    );
  }

  const sorted = [...forSale].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const featured = sorted.slice(0, 3);

  return (
    <div className="min-h-screen px-1 md:px-10 lg:px-20 py-10">
      <h3 className="text-2xl font-bold mb-6">En vogue cette semaine</h3>
      <Marketplace artworks={featured} />
    </div>
  );
}
