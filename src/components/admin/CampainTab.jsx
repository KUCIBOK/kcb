import { useState } from "react";
import { sendCampaign } from "../../api/useCampaign";
import { Mail, Users } from "lucide-react";
import { useUsersContext } from "../../store/UsersStore";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Input, Select, Button, toast } from "../ui";

export function CampainTab() {
  const {artists, collectors, professionals} = useUsersContext();
  const totalAudience = artists?.length + collectors?.length + professionals?.length;
  const [state, setState] = useState({
    subject: "",
    content: "",
    userType: "all",
    loading: false,
    error: null
  });

  const userTypeOptions = [
    { value: "all", label: "Tous" },
    { value: "artist", label: "Artistes" },
    { value: "professional", label: "Professionnels" },
    { value: "collector", label: "Collectionneurs" }
  ];

  const handleSendCampaign = async (e) => {
    e.preventDefault();
    setState({ ...state, loading: true });
    try {
      const charge = { ...state };
      delete charge.loading;
      delete charge.error;
      const data = await sendCampaign(charge);
      if (data.success === true) {
        toast.success('✓ Campagne envoyée avec succès');
        setState({
          subject: "",
          content: "",
          userType: "all",
          loading: false,
          error: null
        });
      } else {
        toast.error('× Échec de l\'envoi');
        setState({ ...state, loading: false, error: data.error });
      }
    } catch (error) {
      toast.error('× Erreur serveur');
      setState({ ...state, loading: false, error: error.message });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start">

        <section className="border rounded-2xl shadow-lg p-6 w-full md:w-6/10">
            <header className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center justify-center bg-indigo-600/10 rounded-full p-2"><Mail className="w-5 h-5 text-indigo-600" /></span>
                <h2 className="text-lg font-semibold text-white">Nouvelle campagne</h2>
            </header>
            
            <form className="space-y-4" onSubmit={handleSendCampaign}>
                <Select
                  label="Type d'utilisateur"
                  options={userTypeOptions}
                  value={state.userType}
                  onChange={(value) => setState({ ...state, userType: value })}
                  required
                />

                <Input
                  label="Sujet"
                  type="text"
                  value={state.subject}
                  onChange={(e) => setState({ ...state, subject: e.target.value })}
                  placeholder="Sujet de la campagne"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contenu</label>
                  <ReactQuill
                    theme="snow"
                    value={state.content}
                    onChange={(value) => setState({ ...state, content: value })}
                    className="border border-gray-800 rounded-lg bg-white text-black"
                    placeholder="Contenu de votre campagne"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={state.loading}
                  loading={state.loading}
                  className="w-full"
                >
                  Envoyer la campagne
                </Button>
            </form>
        </section>
        <section className="border rounded-2xl shadow-lg p-4 w-full md:w-4/10">
            <header className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center justify-center bg-indigo-600/10 rounded-full p-2"><Users className="w-5 h-5 text-indigo-600" /></span>
                <h2 className="text-lg font-semibold text-white">Audience</h2>
            </header>
            <div className="space-y-4 border-b pb-4 mb-4 border-gray-700">
                <div className="flex justify-between items-center">
                    <div className="text-sm font-semibold text-white">Artistes</div>
                    <div className="text-sm font-bold px-2 bg-gray-700 rounded-full"> {artists?.length} </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="text-sm font-semibold text-white">Professionnels</div>
                    <div className="text-sm font-bold px-2 bg-gray-700 rounded-full"> {professionals?.length} </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="text-sm font-semibold text-white">Collectionneurs</div>
                    <div className="text-sm font-bold px-2 bg-gray-700 rounded-full"> {collectors?.length} </div>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="text-sm font-semibold text-white">Total</div>
                <div className="text-sm font-bold px-2 bg-indigo-600 text-white rounded-full"> {totalAudience} </div>
            </div>
        </section>
    </div>
  );
}