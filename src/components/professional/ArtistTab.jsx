import { useArtist } from "../../store/ArtistContext";
import { ArtistTable } from "../artists/ArtistTable";


export function ArtistTab(){
    const {myArtists} = useArtist()
    return (
        <>
        <div className="rounded-lg border bg-card shadow-sm p-6">
            <div className="my-4 overflow-auto">
                <ArtistTable artists={myArtists} />
            </div>
        </div>

        </>
    )
}