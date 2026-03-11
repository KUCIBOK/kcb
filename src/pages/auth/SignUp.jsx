import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Step1 } from "../../components/auth/Step1";
import { Step2 } from "../../components/auth/Step2";
import { Step3 } from "../../components/auth/Step3";
import { Step4Artist } from "../../components/auth/Step4Artist";
import { Step4Collector } from "../../components/auth/Step4Collector";
import { Step4Professional } from "../../components/auth/Step4Professional";
import { SignUpUser, loginWithGoogle } from "../../api/useAuth";
import { Helmet } from "react-helmet";
import RevealOnScroll from "../../components/landing/RevealOnScroll";

export default function SignUp() {
  // Default countries list as fallback
  const defaultCountries = [
    { name: "Sénégal", code: "SN", dial_code: "+221" },
    { name: "France", code: "FR", dial_code: "+33" },
    { name: "United States", code: "US", dial_code: "+1" },
    { name: "United Kingdom", code: "GB", dial_code: "+44" },
    { name: "Canada", code: "CA", dial_code: "+1" },
    { name: "Germany", code: "DE", dial_code: "+49" },
    { name: "Spain", code: "ES", dial_code: "+34" },
    { name: "Italy", code: "IT", dial_code: "+39" },
    { name: "Belgium", code: "BE", dial_code: "+32" },
    { name: "Switzerland", code: "CH", dial_code: "+41" },
    { name: "Netherlands", code: "NL", dial_code: "+31" },
    { name: "Nigeria", code: "NG", dial_code: "+234" },
    { name: "Ghana", code: "GH", dial_code: "+233" },
    { name: "Côte d'Ivoire", code: "CI", dial_code: "+225" },
    { name: "Mali", code: "ML", dial_code: "+223" },
    { name: "Burkina Faso", code: "BF", dial_code: "+226" },
    { name: "Niger", code: "NE", dial_code: "+227" },
    { name: "Togo", code: "TG", dial_code: "+228" },
    { name: "Benin", code: "BJ", dial_code: "+229" },
    { name: "Cameroon", code: "CM", dial_code: "+237" },
    { name: "South Africa", code: "ZA", dial_code: "+27" },
    { name: "Morocco", code: "MA", dial_code: "+212" },
    { name: "Tunisia", code: "TN", dial_code: "+216" },
    { name: "Egypt", code: "EG", dial_code: "+20" },
    { name: "Gabon", code: "GA", dial_code: "+241" },
    { name: "Congo", code: "CG", dial_code: "+242" },
    { name: "Democratic Republic of Congo", code: "CD", dial_code: "+243" },
    { name: "Mauritania", code: "MR", dial_code: "+222" },
    { name: "Liberia", code: "LR", dial_code: "+231" },
    { name: "Sierra Leone", code: "SL", dial_code: "+232" },
  ];

  const [formState, setFormState] = useState({
    email: "",
    password: "",
    role: "",
    name: "",
    username: "",
    country: "Andorra",
    telephone: "",
    // Artist
    biography: "",
    portfolio: "",
    image: "",
    socials: {
      facebook: "",
      twitter: "",
      instagram: "",
    },

    // Collector
    interests: "",

    //Professional
    institution: "",
    qualifications: "",

    show: "",
    loading: false,
    error: null,
    confirmPassword: "",
    step: 0,
    countries: [],
    connectMethod: "",
    credentials: {},
    acceptedTerms: false,
    acceptedPrivacy: false,
  });

  const steps = [
    "Connect Wallet",
    formState.connectMethod === "email" ? "Create Account" : "",
    "Choose Role",
    "Complete Profile",
  ];

  const navigate = useNavigate();

  /** Inscription Google via Supabase OAuth — redirige vers /auth/callback. */
  const handleGoogleSignup = async () => {
    setFormState(prev => ({ ...prev, loading: true, error: null }));
    const result = await loginWithGoogle();
    if (result?.error) {
      setFormState(prev => ({ ...prev, loading: false, error: result.error }));
    }
    // Supabase gère la redirection OAuth — onAuthStateChange prend le relais
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/data/countries.json");
        if (!response.ok) throw new Error("Failed to fetch countries");
        const data = await response.json();
        setFormState({ ...formState, countries: data });
      } catch {
        setFormState({ ...formState, countries: defaultCountries });
      }
    };
    fetchCountries();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setFormState({ ...formState, error: "", loading: true });

    try {
      const charge = {
        email: formState.email,
        password: formState.password,
        role: formState.role,
        name: formState.name,
        username: formState.username,
        country: formState.country,
        telephone: formState.telephone,
        // Artist
        biography: formState.biography,
        portfolio: formState.portfolio,
        image: formState.image,
        facebook: formState.socials.facebook,
        twitter: formState.socials.twitter,
        instagram: formState.socials.instagram,

        // Collector
        interests: formState.interests,

        //Professional
        institution: formState.institution,
        qualifications: formState.qualifications,
      };
      if (charge?.role == "artist" && !charge.image) {
        setFormState({
          ...formState,
          error: "Vous devez mettre une photo de profil.",
          loading: false,
        });
        window.scrollTo(0, 0);
        return;
      }
      const data = await SignUpUser(charge);

      if (data?.user?._id) {
        setFormState({...formState, loading : false, error : data.message || "Inscription réussie. Vérifiez votre adresse email pour continuer."});
        window.scrollTo(0, 0);
        setTimeout(() => {
        navigate("/check-email", { state : { email: formState.email } });
        }, 5000);
      } else if (data?.error === "L'utilisateur existe déjà. Essayez de vous connecter.") {
        setFormState({
          ...formState,
          error: data.error,
          loading: false,
        });
        window.scrollTo(0, 0);
      } else if (data?.error) {
        setFormState({
          ...formState,
          error: data.error,
          loading: false,
        });
        window.scrollTo(0, 0);
      } else {
        setFormState({
          ...formState,
          error: "Erreur inconnue",
          loading: false,
        });
        window.scrollTo(0, 0);
      }
    } catch (err) {
      setFormState({
        ...formState,
        error:
          err?.response?.data?.message || "Erreur serveur, veuillez réessayer.",
        loading: false,
      });
      window.scrollTo(0, 0);
    }
  };

  const renderStepContent = () => {
    switch (formState.step) {
      case 0:
        return <Step1 formState={formState} setFormState={setFormState} onGoogleSignup={handleGoogleSignup} />;
      case 1:
        return <Step2 formState={formState} setFormState={setFormState} />;
      case 2:
        return <Step3 formState={formState} setFormState={setFormState} />;
      case 3:
        switch (formState.role) {
          case "artist":
            return (
              <Step4Artist
                formState={formState}
                handleSignUp={handleSignUp}
                setFormState={setFormState}
              />
            );
          case "collector":
            return (
              <Step4Collector
                formState={formState}
                handleSignUp={handleSignUp}
                setFormState={setFormState}
              />
            );
          case "professional":
            return (
              <Step4Professional
                formState={formState}
                handleSignUp={handleSignUp}
                setFormState={setFormState}
              />
            );
          default:
            return null;
        }
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Sign up | Kucibok`}</title>
        <meta
          name="description"
          content={"Inscrivrez-vous à votre compte Kucibok"}
        />
        <meta property="og:title" content={"Inscription Kucibok"} />
        <meta
          property="og:description"
          content={"Inscrivez-vous à votre compte Kucibok"}
        />
        <meta property="og:image" content={"/images/kucibok-black.png"} />
        <meta property="og:url" content={`https://kucibok.com/sign-up`} />
      </Helmet>
      <div className="flex min-h-screen flex-col items-center justify-center bg-kcb-noir-deep px-4">
        <RevealOnScroll>
        <div className="w-full max-w-md mx-auto py-8">
          <div className="text-center mb-8">
            <Link to="/">
              <img
                src="/images/kucibok-white-logo.svg"
                alt="logo kucibok"
                className="w-12 h-12 object-cover mx-auto"
              />
            </Link>
            <h2 className="font-playfair text-xl font-semibold text-white mb-1 mt-4">
              Créer un compte
            </h2>
            <p className="text-xs text-kcb-pierre">
              Rejoignez la marketplace d'art digital d'Afrique
            </p>
          </div>
          {/* Progress indicator minimaliste */}
          {formState.step < steps.length - 1 && (
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full ${
                    formState.step === idx ? "bg-kcb-or" : "bg-kcb-pierre"
                  }`}
                />
              ))}
            </div>
          )}
          {renderStepContent()}
          {formState.step !== 0 && formState.step < steps.length - 1 && (
            <div className="text-center mt-6">
              <p className="text-xs text-kcb-pierre">
                Déjà inscrit ?{" "}
                <Link
                  to="/sign-in"
                  className="font-semibold text-kcb-or hover:underline"
                >
                  Connexion
                </Link>
              </p>
            </div>
          )}
        </div>
        </RevealOnScroll>
      </div>
    </>
  );
}
