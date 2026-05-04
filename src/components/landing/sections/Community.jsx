import { Link } from 'react-router-dom'
import { Images, Palette, ShieldUser } from 'lucide-react'

export default function Community() {
  return (
    <section className="min-h-screen px-4 md:px-10 lg:px-20 py-16 bg-kcb-noir text-white">
      <div className="grid lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 relative md:sticky top-16 self-start h-fit bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Rejoignez Notre Communauté</h2>
          <p className="text-lg text-kcb-pierre">
            Que vous soyez artiste, collectionneur ou expert en art, une place vous attend dans
            l’écosystème Kucibok. Plongez dans un univers où chaque talent trouve sa valeur : créez
            et exposez vos œuvres numériques, collectionnez des pièces uniques issues de l’art
            africain contemporain, ou contribuez à l’authentification et à la traçabilité des
            créations pour renforcer la confiance sur le marché.
          </p>
        </div>

        {/* Cartes à droite */}
        <div className="flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-8rem)] pr-2">
          {/* Artistes */}
          <div className="bg-white/[0.04] p-6 rounded-[4px] hover:bg-white/[0.08] transition border border-white/[0.06]">
            <div className="flex flex-row gap-5 items-center mb-4">
              <div className="w-[50px] h-[50px] rounded-full bg-kcb-or p-3 flex items-center justify-center">
                <Palette className="w-8 h-8 text-kcb-noir" />
              </div>
              <h3 className="text-xl font-semibold mb-2"> Artistes</h3>
            </div>

            <p className="text-sm text-kcb-pierre mb-4">
              Créez et vendez vos œuvres numériques à une audience mondiale passionnée d'art
              africain.
            </p>
            <Link to="/africa" className="text-sm text-kcb-or hover:underline">
              En savoir plus →
            </Link>
          </div>

          {/* Collectionneurs */}
          <div className="bg-white/[0.04] p-6 rounded-[4px] hover:bg-white/[0.08] transition border border-white/[0.06]">
            <div className="flex flex-row gap-5 items-center mb-4">
              <div className="w-[50px] h-[50px] rounded-full bg-kcb-bronze p-3 flex items-center justify-center">
                <Images className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2"> Collectionneurs</h3>
            </div>
            <p className="text-sm text-kcb-pierre mb-4">
              Découvrez et collectionnez des œuvres d'art extraordinaires créés par des artistes
              talentueux.
            </p>
            <Link to="/global" className="text-sm text-kcb-bronze hover:underline">
              En savoir plus →
            </Link>
          </div>

          {/* Professionnels */}
          <div className="bg-white/[0.04] p-6 rounded-[4px] hover:bg-white/[0.08] transition border border-white/[0.06]">
            <div className="flex flex-row gap-5 items-center mb-4">
              <div className="w-[50px] h-[50px] rounded-full bg-kcb-silver p-3 flex items-center justify-center">
                <ShieldUser className="w-8 h-8 text-kcb-noir" />
              </div>
              <h3 className="text-xl font-semibold mb-2"> Professionnels de l'art</h3>
            </div>
            <p className="text-sm text-kcb-pierre mb-4">
              Utilisez votre expertise pour authentifier les œuvres et maintenir l'intégrité du
              marché.
            </p>
            <Link to="/global" className="text-sm text-kcb-silver hover:underline">
              En savoir plus →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
