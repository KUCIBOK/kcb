import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Step1 }            from "../../components/auth/Step1";
import { Step2 }            from "../../components/auth/Step2";
import { Step3 }            from "../../components/auth/Step3";
import { Step4Essential }   from "../../components/auth/Step4Essential";
import { Step5Artist }      from "../../components/auth/Step5Artist";
import { Step5Curator } from "../../components/auth/Step5Curator";
import { SignUpUser, loginWithGoogle, updateProfile } from "../../api/useAuth";
import { Helmet } from "react-helmet";
import { Check } from "lucide-react";

// 5 étapes — step 4 = identité essentielle, step 5 = enrichissement skippable
const STEP_LABELS = ["Méthode", "Compte", "Rôle", "Identité", "Profil"];

const DEFAULT_COUNTRIES = [
  { name: "Sénégal", code: "SN" }, { name: "France", code: "FR" },
  { name: "United States", code: "US" }, { name: "United Kingdom", code: "GB" },
  { name: "Canada", code: "CA" }, { name: "Germany", code: "DE" },
  { name: "Spain", code: "ES" }, { name: "Italy", code: "IT" },
  { name: "Belgium", code: "BE" }, { name: "Switzerland", code: "CH" },
  { name: "Netherlands", code: "NL" }, { name: "Nigeria", code: "NG" },
  { name: "Ghana", code: "GH" }, { name: "Côte d'Ivoire", code: "CI" },
  { name: "Mali", code: "ML" }, { name: "Burkina Faso", code: "BF" },
  { name: "Niger", code: "NE" }, { name: "Togo", code: "TG" },
  { name: "Benin", code: "BJ" }, { name: "Cameroon", code: "CM" },
  { name: "South Africa", code: "ZA" }, { name: "Morocco", code: "MA" },
  { name: "Tunisia", code: "TN" }, { name: "Egypt", code: "EG" },
  { name: "Gabon", code: "GA" }, { name: "Congo", code: "CG" },
  { name: "DR Congo", code: "CD" }, { name: "Mauritania", code: "MR" },
];

export default function SignUp() {
  const [formState, setFormState] = useState({
    email: "", password: "", confirmPassword: "",
    role: "", name: "", username: "", country: "Sénégal",
    telephone: "", biography: "", portfolio: "", image: "", show: "",
    socials: { facebook: "", twitter: "", instagram: "" },
    interests: "", institution: "", qualifications: "",
    loading: false, error: null,
    step: 0, countries: [], connectMethod: "",
    acceptTerms: false, acceptPrivacy: false,
    // id créé après Step4 — utilisé pour enrichissement Step5
    createdUserId: null,
  });

  const navigate    = useNavigate();
  const [searchParams] = useSearchParams();

  // Pré-sélectionner le rôle depuis l'URL (?role=artist|collector|professional)
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (["artist", "curator"].includes(roleParam)) {
      setFormState(p => ({ ...p, role: roleParam }));
    }
  }, []);

  // Chargement des pays
  useEffect(() => {
    fetch("/data/countries.json")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setFormState(p => ({ ...p, countries: data })))
      .catch(() => setFormState(p => ({ ...p, countries: DEFAULT_COUNTRIES })));
  }, []);

  const handleGoogleSignup = async () => {
    setFormState(p => ({ ...p, loading: true, error: null }));
    const result = await loginWithGoogle();
    if (result?.error) setFormState(p => ({ ...p, loading: false, error: result.error }));
  };

  /** Step 4 — Crée le compte avec les essentiels uniquement, puis passe à Step 5 */
  const handleSignUp = async (e) => {
    e.preventDefault();
    setFormState(p => ({ ...p, error: "", loading: true }));
    try {
      const charge = {
        email: formState.email, password: formState.password,
        role: formState.role,   name: formState.name,
        country: formState.country, institution: formState.institution,
        image: formState.image,
      };
      if (charge.role === "artist" && !charge.image) {
        setFormState(p => ({ ...p, error: "Photo de profil obligatoire pour les artistes.", loading: false }));
        return;
      }
      const data = await SignUpUser(charge);
      if (data?.user?._id || data?.user?.id) {
        // Compte créé — on passe à l'étape 5 (enrichissement)
        setFormState(p => ({
          ...p,
          loading: false,
          error: null,
          step: 4,
          createdUserId: data.user._id || data.user.id,
          uploadedImageUrl: data.imageUrl ?? null, // URL Supabase Storage de la photo
        }));
      } else if (data?.error) {
        setFormState(p => ({ ...p, error: data.error, loading: false }));
      } else {
        setFormState(p => ({ ...p, error: "Erreur inconnue.", loading: false }));
      }
    } catch (err) {
      setFormState(p => ({ ...p, error: err?.message || "Erreur serveur.", loading: false }));
    }
  };

  /** Step 5 — Sauvegarde l'enrichissement puis redirige */
  const handleEnrich = async () => {
    setFormState(p => ({ ...p, loading: true }));
    try {
      if (formState.createdUserId) {
        await updateProfile(formState.createdUserId, {
          // Essentiels Step 4 — indispensables pour créer le row artists
          name:          formState.name,
          country:       formState.country,
          ...(formState.uploadedImageUrl ? { image: formState.uploadedImageUrl } : {}),
          // Enrichissement Step 5
          username:      formState.username,
          telephone:     formState.telephone,
          biography:     formState.biography,
          portfolio:     formState.portfolio,
          interests:     formState.interests,
          qualifications: formState.qualifications,
          facebook:      formState.socials.facebook,
          twitter:       formState.socials.twitter,
          instagram:     formState.socials.instagram,
        });
      }
    } catch {
      // Enrichissement non bloquant — on continue même en cas d'erreur
    }
    setFormState(p => ({ ...p, loading: false }));
    navigate("/check-email", { state: { email: formState.email } });
  };

  /** Step 5 — Passer l'enrichissement directement */
  const handleSkip = () => {
    navigate("/check-email", { state: { email: formState.email } });
  };

  const renderStep = () => {
    switch (formState.step) {
      case 0: return <Step1 formState={formState} setFormState={setFormState} onGoogleSignup={handleGoogleSignup} />;
      case 1: return <Step2 formState={formState} setFormState={setFormState} />;
      case 2: return <Step3 formState={formState} setFormState={setFormState} roleFromUrl={searchParams.get("role")} />;
      case 3: return <Step4Essential formState={formState} setFormState={setFormState} handleSignUp={handleSignUp} />;
      case 4:
        if (formState.role === "artist")  return <Step5Artist  formState={formState} setFormState={setFormState} onEnrich={handleEnrich} onSkip={handleSkip} />;
        if (formState.role === "curator") return <Step5Curator formState={formState} setFormState={setFormState} onEnrich={handleEnrich} onSkip={handleSkip} />;
        return null;
      default: return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Inscription — Kucibok | Rejoindre la plateforme d'art africain</title>
        <meta name="description" content="Créez votre compte Kucibok — artiste, collectionneur ou professionnel de l'art africain." />
      </Helmet>

      <div className="relative flex min-h-screen flex-col items-center justify-center bg-kcb-noir-deep px-4 py-12 overflow-hidden">
        {/* Atmosphere */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-kcb-or/[0.04] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-kcb-bronze/[0.04] blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-kcb-or/[0.02] rotate-45" />

        <div className="relative w-full max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <Link to="/">
              <img src="/images/kucibok-white-logo.svg" alt="Kucibok" className="w-10 h-10 object-contain mx-auto" />
            </Link>
            <h1 className="font-playfair text-xl font-semibold text-white mt-4 mb-1">
              {formState.step === 4 ? "Votre compte est créé ✓" : "Créer un compte"}
            </h1>
            <p className="text-xs text-kcb-pierre">
              {formState.step === 4
                ? "Enrichissez votre profil pour maximiser votre visibilité"
                : "Rejoignez l'infrastructure de l'art africain"}
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center mb-8">
            {STEP_LABELS.map((label, idx) => (
              <div key={idx} className="flex items-center">
                <div className="flex flex-col items-center">
                  <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-all duration-300 ${
                    formState.step === idx
                      ? "bg-kcb-or text-kcb-noir shadow-[0_0_12px_rgba(196,155,70,0.4)]"
                      : formState.step > idx
                      ? "bg-kcb-or/20 text-kcb-or border border-kcb-or/30"
                      : "bg-white/[0.05] text-kcb-pierre border border-white/[0.08]"
                  }`}>
                    {formState.step > idx ? <Check className="w-3 h-3" /> : idx + 1}
                  </span>
                  <span className={`mt-1.5 text-[11px] font-medium tracking-wide ${
                    formState.step === idx ? "text-kcb-or" : formState.step > idx ? "text-kcb-or/50" : "text-kcb-pierre/40"
                  }`}>
                    {label}
                  </span>
                </div>
                {idx < STEP_LABELS.length - 1 && (
                  <div className={`w-8 h-px mx-1.5 mb-5 transition-all duration-500 ${
                    formState.step > idx ? "bg-kcb-or/40" : "bg-white/[0.06]"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          {renderStep()}

          {/* Bottom link */}
          {formState.step > 0 && formState.step < 3 && (
            <p className="text-center text-xs text-kcb-pierre mt-6">
              Déjà inscrit ?{" "}
              <Link to="/sign-in" className="font-semibold text-kcb-or hover:underline">
                Connexion
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
