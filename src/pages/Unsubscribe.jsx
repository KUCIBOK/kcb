import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Unsubscribe() {
  return (
    <>
      <Helmet>
        <title>Désabonnement | Kucibok</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-kcb-noir-deep px-4 py-10">
        <div className="w-full max-w-sm mx-auto text-center">
          <Link to="/">
            <img
              src="/images/kucibok-white-logo.svg"
              alt="Kucibok"
              className="w-12 h-12 object-cover mx-auto mb-6"
            />
          </Link>
          <p className="font-playfair text-xl font-semibold text-white mb-3">
            Demande de désabonnement
          </p>
          <p className="text-sm text-kcb-pierre leading-relaxed mb-6">
            Pour vous retirer de nos communications, envoyez un email à{" "}
            <a
              href="mailto:support@kucibok.com?subject=Désabonnement"
              className="text-kcb-or hover:underline"
            >
              support@kucibok.com
            </a>{" "}
            avec l'objet <span className="text-white">Désabonnement</span>.
            <br className="mb-2" />
            Votre demande sera traitée sous 48h.
          </p>
          <Link
            to="/"
            className="inline-block text-xs text-kcb-pierre hover:text-white transition"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </>
  );
}
