import { memo } from "react";
import { Link } from "react-router-dom";
export const Footer = memo(() => (
  <footer className="bg-gray-900 relative overflow-hidden pt-12 pb-6 border-t border-gray-800">
    {/* Minimal background blobs */}
    <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-kcb/10 rounded-full blur-3xl" />
    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-kcb/10 rounded-full blur-3xl" />

    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        {/* Brand */}
        <div>
          <Link to="/" className="font-serif text-2xl font-bold bg-gradient-to-r from-indigo-kcb to-purple-kcb bg-clip-text text-transparent mb-4 inline-block tracking-tight">KUCIBOK</Link>
          <p className="text-white/60 text-sm mb-4 max-w-xs">Célébrer la créativité africaine à travers l'art numérique.</p>
        </div>
        {/* Navigation */}
        <div>
          <h4 className="text-base font-semibold mb-3 text-white/80">Navigation</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="text-white/50 hover:text-indigo-kcb transition-colors">Accueil</Link></li>
            <li><Link to="/explore" className="text-white/50 hover:text-indigo-kcb transition-colors">Explorer</Link></li>
            <li><Link to="/artists" className="text-white/50 hover:text-indigo-kcb transition-colors">Artistes</Link></li>
            <li><Link to="/about" className="text-white/50 hover:text-indigo-kcb transition-colors">À propos</Link></li>
          </ul>
        </div>
        {/* Resources */}
        <div>
          <h4 className="text-base font-semibold mb-3 text-white/80">Ressources</h4>
          <ul className="space-y-2">
            <li><Link to="/faq#how-it-works" className="text-white/50 hover:text-indigo-kcb transition-colors">Comment ça fonctionne ?</Link></li>
            <li><Link to="/faq" className="text-white/50 hover:text-indigo-kcb transition-colors">FAQs</Link></li>
            <li><Link to="/blog" className="text-white/50 hover:text-indigo-kcb transition-colors">Blog</Link></li>
            <li><Link to="/contact" className="text-white/50 hover:text-indigo-kcb transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-white/40">© {new Date().getFullYear()} Kucibok. Tous droits réservés.</p>
        <p className="text-xs text-white/40">
          <Link to="/terms-and-conditions" className="text-white/50 hover:text-indigo-kcb transition-colors">Conditions générales d'utilisation</Link>
          <span className="mx-1">|</span>
          <Link to="/privacy-policy" className="text-white/50 hover:text-indigo-kcb transition-colors">Politique de confidentialité</Link>
          <span className="mx-1">|</span>
          <Link to="/sales-conditions" className="text-white/50 hover:text-indigo-kcb transition-colors">Conditions générales de vente</Link>
          <span className="mx-1">|</span>
          <Link to="/ethic-chart" className="text-white/50 hover:text-indigo-kcb transition-colors">Charte éthique</Link>
        </p>
      </div>
    </div>
  </footer>
));