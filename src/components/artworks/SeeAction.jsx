import { Eye, X } from 'lucide-react'
import DOMPurify from 'dompurify'
import { memo, useState } from 'react'
import { ApproveAction } from './ApproveAction'

export const SeeAction = memo(({ artwork, user }) => {
  const [show, setShow] = useState(false)
  return (
    <>
      <button
        title="Voir"
        onClick={() => setShow(!show)}
        className="border border-white/[0.06] rounded-md bg-kcb-ardoise hover:bg-kcb-ardoise p-2 flex items-center gap-3"
      >
        <Eye className="w-4 h-4" />
      </button>
      {show && (
        <div
          className={`fixed bg-stone-950/80 z-90 h-screen w-screen top-0 left-0 animate-fade-in flex items-center justify-center`}
        >
          <ArtworkModal user={user} setShow={setShow} artwork={artwork} />
        </div>
      )}
    </>
  )
})

const ArtworkModal = memo(({ setShow, artwork, user }) => {
  return (
    <div className="relative bg-kcb-ardoise border border-zinc-800 overflow-auto h-[90vh] rounded-[4px] shadow-xl w-full max-w-2xl p-0 animate-scale-up">
      <button
        onClick={() => setShow(false)}
        className="absolute top-3 right-3 p-2 rounded-full hover:bg-zinc-800 transition"
        aria-label="Fermer"
      >
        <X className="w-5 h-5 text-kcb-pierre hover:text-white transition" />
      </button>
      <div className="px-8 pt-8 pb-2">
        <div className="mb-6">
          <h2 className="font-semibold text-lg text-white mb-1 font-playfair">{artwork.title}</h2>
          <p className="text-xs text-kcb-pierre mb-2">
            par <span className="font-medium text-white">{artwork.artist}</span>
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="bg-zinc-800/70 rounded-[4px] shadow-md p-0 flex items-center justify-center w-full lg:w-1/2">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full max-h-72 object-contain rounded-[4px]"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder-artwork.svg'
              }}
            />
          </div>
          <div className="lg:w-1/2 flex flex-col gap-2">
            <div className="mb-2">
              <span className="text-xs text-kcb-pierre">Description</span>
              <p className="text-white text-sm font-medium mt-1">
                <span
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(artwork?.description ?? ''),
                  }}
                />
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {artwork?.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full font-semibold text-xs bg-kcb-or text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-kcb-pierre">
              <span>
                Hauteur : <span className="text-white font-medium">{artwork?.height}</span> cm
              </span>
              <span>
                Largeur : <span className="text-white font-medium">{artwork?.width}</span> cm
              </span>
              <span>
                Poids : <span className="text-white font-medium">{artwork?.weight}</span> kgs
              </span>
            </div>
            <div className="mt-4">
              <span className="text-xs text-kcb-pierre">Prix</span>
              <div className="text-lg font-semibold text-green-400">
                {artwork.price?.toLocaleString('fr-FR').replace(/\s/g, ' ')} {artwork.currency}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => setShow(false)}
            className="rounded-[4px] border border-zinc-700 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition"
          >
            Fermer
          </button>
          {user?.role === 'admin' && artwork?.status === 'pending' && (
            <ApproveAction artwork={artwork} />
          )}
        </div>
      </div>
    </div>
  )
})
