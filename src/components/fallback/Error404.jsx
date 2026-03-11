import { ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Error404() {
    const navigate = useNavigate()
    return (
        <>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-night/5 to-muted relative overflow-hidden px-4">
      {/* Background decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      {/* Decorative pattern shapes */}
      <div className="absolute top-1/4 left-1/4 w-8 h-24 bg-clay/20 rounded-full rotate-45" />
      <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-earth/20 rounded-full" />
      <div className="absolute bottom-1/3 left-1/2 w-12 h-12 bg-kente/20 rounded-full" />
      
      <div className="max-w-md w-full bg-card/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-gray-700 animate-fade-in">
        <div className="p-6 sm:p-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="font-serif text-8xl font-bold text-gradient mb-2">404</h1>
            <h2 className="text-2xl font-bold mb-4">Page introuvable</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-earth to-clay mb-6"></div>
            
            <p className="text-muted-foreground mb-8">
            Oups ! On dirait que vous vous aventurez en territoire inconnu. La page que vous recherchez n'existe pas dans la galerie <span className="font-serif font-bold text-primary">Kucibok</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button 
                className="w-full flex items-center justify-center py-2 text-white hover:opacity-90 group bg-gray-900/80 rounded-md"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Retour
              </button>
              
                <Link to="/" className="w-full flex items-center justify-center py-2 bg-gradient text-white hover:opacity-90 rounded-md">
                  <Home className="mr-2 h-4 w-4" />
                  Retour à l'acceuil
                </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Kucibok. Tous droits réservés.
      </div>
    </div>
        </>
    )
}