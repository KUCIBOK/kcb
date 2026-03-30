import { AuctionsList } from "../auction/AuctionsList";
import { useArtworks } from "../../store/ArtworkContext";

export function AuctionTab() {
  const { myArtworks } = useArtworks();
  return (
    <>
      <div className="rounded-[4px] border bg-kcb-ardoise shadow-sm p-6">
        <div className="my-4 overflow-auto">
          <AuctionsList artworks={myArtworks} />
        </div>
      </div>
    </>
  );
}
