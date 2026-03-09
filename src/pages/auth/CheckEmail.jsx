import { Link, useLocation, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";

export default function CheckEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  if (!email) {
    navigate("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-xl p-8 flex flex-col items-center animate-fade-in">
        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-kcb/10 mb-4 animate-bounce-slow">
          <MailCheck className="w-9 h-9 text-indigo-kcb" />
        </span>
        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Vérification de votre email</h1>
        <p className="text-gray-400 text-base mb-6">
          Nous avons envoyé un lien de vérification à <span className="font-semibold text-white">{email}</span>.<br />
          <span className="text-gray-500">Consultez votre boîte de réception (ou les spams) et cliquez sur le lien pour activer votre compte.</span>
        </p>
        <Link
          to="/sign-in"
          className="inline-block mt-2 px-5 py-2 rounded-lg bg-indigo-kcb text-white font-medium text-sm shadow hover:bg-indigo-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-kcb"
        >
          J’ai déjà vérifié mon email
        </Link>
      </div>
    </div>
  );
}
