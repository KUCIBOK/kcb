import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function About() {
    useEffect(() => {
      window.scrollTo(0, 0)
    }, [])
    return (
        <>
        <div className="md:flex justify-between items-center mx-auto animate-fade-in-up mt-8 mb-16">
            <div className="order-2 md:order-1 max-w-3xl text-center mx-auto">
                <div className="flex items-center mx-auto mb-6 rounded-full bg-gray-700/90 w-fit px-3 py-1 text-sm font-medium text-white">
                    <div className="rounded-full bg-purple-kcb w-2 h-2 mr-2"></div>
                    Notre mission
                </div>
                <div>
                    <h1 className="font-playfair text-4xl md:text-5xl text-white font-medium">Renforcer la créativité numérique africaine</h1>
                    <p className="my-5 text-md text-gray-400">
                        Nous comblons le fossé entre les artistes numériques africains et le marché mondial des oeuvres digitales.
                    </p>
                </div>
            </div>
            
        </div>
        <div className="md:flex justify-between items-center mx-auto px-4 md:px-6 lg:px-8 animate-fade-in-up gap-5">
            <div className="mx-auto md:w-1/2 order-1 md:order-2 animate-fade-in-up transition duration-300 ease-in-out rotate-1 hover:rotate-0 border-5 border-kcb w-full bg-black rounded-2xl shadow-lg">
                <img loading="lazy" src="/images/homepage/collector-hero.jpeg" alt="artwork" className="h-100 w-160 mx-auto object-cover rounded-xl"/>
            </div>
            <div className="md:mt-0 mt-10 md:w-1/2 order-2 md:order-1">
                <div className="space-y-4 text-sm">
                    <h1 className="font-playfair text-3xl font-medium text-white">Notre Vision</h1>
                    <p className="mt-5">
                        KUCIBOK a été fondée avec une vision claire : créer une plateforme dédiée où les artistes numériques africains peuvent présenter leur travail à un public mondial tout en conservant la propriété et le contrôle de leurs actifs créatifs.
                    </p>
                    <p>
                        Nous pensons que la technologie blockchain offre une opportunité révolutionnaire aux artistes de toute l'Afrique de se connecter directement
                    </p>
                    <p>
                    En créant ce marché, nous visons à célébrer la riche diversité de l’expression artistique africaine tout en aidant les créateurs à construire des carrières durables dans l’espace de l’art numérique.
                    </p>
                </div>
            </div>
        </div>

        <div className="my-24 px-4 md:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="font-serif text-3xl mb-4">Nos valeurs</h2>
              <p className="text-muted-foreground">
              Ces principes fondamentaux guident tout ce que nous faisons chez KUCIBOK.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Authenticité",
                  description: "Nous célébrons les perspectives culturelles et les expressions artistiques uniques qui rendent l’art numérique africain si puissant et distinctif.",
                  icon: (
                    <div className="bg-amber-200/20 p-3 rounded-full inline-flex mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-200"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                    </div>
                  )
                },
                {
                  title: "Innovation",
                  description: "Nous adoptons de nouvelles technologies et des approches créatives qui élargissent les possibilités de l’art numérique et de l’autonomisation des artistes.",
                  icon: (
                    <div className="bg-amber-500/10 p-3 rounded-full inline-flex mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400/60"><path d="M12 22v-5" /><path d="M9 8V2" /><path d="M15 8V2" /><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" /></svg>
                    </div>
                  )
                },
                {
                  title: "Communauté",
                  description: "Nous construisons un écosystème de soutien qui relie les artistes, les collectionneurs et les passionnés qui partagent notre passion pour l'art numérique africain.",
                  icon: (
                    <div className="bg-green-300/10 p-3 rounded-full inline-flex mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600/60"><path d="M18 8a5 5 0 0 0-10 0v7h10V8Z" /><path d="M8 15H4a8 8 0 0 1 8-8" /><path d="M16 15h4a8 8 0 0 0-8-8" /></svg>
                    </div>
                  )
                }
              ].map((value, index) => (
                <div 
                  key={index}
                  className="bg-card p-6 rounded-xl shadow-sm text-center animate-fade-in"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  {value.icon}
                  <h3 className="text-xl font-medium mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

         <section className="flex flex-col items-center gap-10 px-4">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="font-playfair text-3xl md:text-4xl font-semibold mb-2">Notre équipe</h2>
              <p className="text-gray-400 mb-2">Rencontrez les personnes passionnées derrière KUCIBOK.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-10 w-full max-w-3xl mx-auto">
              {[
                {
                  name: "Moctar Sidibé",
                  role: "Co-Founder & CEO",
                  image: "/images/team/MoctarSidibe.jpeg"
                },
                {
                  name: "Curtis Zirignon",
                  role: "Co-Founder & CFO",
                  image: "/images/team/CurtisZirignon.jpeg"
                }
              ].map((member, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center gap-4"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-40 h-40 object-cover rounded-full border-2 border-gray-800 mb-2 shadow-none" 
                  />
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-gray-400 text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </section>


          {/* CTA */}
          <div className="bg-gray-700/60 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto my-6">
            <h2 className="font-playfair text-3xl mb-4">Rejoignez Notre Communauté</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Que vous soyez un artiste cherchant à présenter votre travail ou un collectionneur intéressé par l'acquisition de NFT africains, nous vous invitons à faire partie de notre communauté grandissante.
            </p>
            <div className="flex flex-wrap justify-center space-x-4 text-white">
                <Link to="/artists" className="px-3 py-2 bg-gradient rounded-md">Voir les Artistes</Link>
                <Link to="/contact" className="bg-gray-900 rounded-md hover:bg-gray-400/50 px-3 py-2" >Contactez-nous</Link>
            </div>
          </div>

        </>
    )
}