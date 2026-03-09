import { Plus, Shield, Users } from "lucide-react";
import { useState } from "react";
import { usePlanStore } from "../../store/PlanContext";
import { PlansList } from "./PlansList";
import { Modal, Input, Select, Button, toast } from "../ui";


export function PlansTab() {
  const { collectorPlans, professionalPlans } = usePlanStore();
  const [state, setState] = useState({ addPlan: false });
  return (
    <>
      <div className="rounded-xl bg-gray-900 p-4 md:p-6 mb-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Gestion des plans</h2>
          <button
            onClick={() => setState({ ...state, addUser: true })}
            className="rounded bg-indigo-kcb/90 hover:bg-indigo-kcb px-3 py-2 text-white text-xs md:text-sm font-medium flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
        <div className="my-2">
          <PlansList plans={collectorPlans} title="Plans pour collectionneurs" icon={<Users className="w-5 h-5" />} />
        </div>
        <div className="my-2">
          <PlansList plans={professionalPlans} title="Plans pour professionnels" icon={<Shield className="w-5 h-5" />} />
        </div>
      </div>
      {state?.addUser && <AddPlanModal closeModal={() => setState({ ...state, addUser: false })} />}
    </>
  );
}

function AddPlanModal({ closeModal }) {
    const { addPlan } = usePlanStore();
    const [state, setState] = useState({
        name: "",
        description: "",
        price: "",
        currency: "XOF",
        duration: "monthly",
        role: "collector",
        features: [],
        feature: "",
        loading: false
    });

    const currencyOptions = [
        { value: "XOF", label: "XOF" },
        { value: "USD", label: "USD" },
        { value: "EUR", label: "EUR" }
    ];

    const durationOptions = [
        { value: "monthly", label: "Mensuel" },
        { value: "yearly", label: "Annuel" }
    ];

    const roleOptions = [
        { value: "collector", label: "Collectionneur" },
        { value: "professional", label: "Professionnel" }
    ];

    const handleAddPlan = async (e) => {
        e.preventDefault();
        try {
            if (state.features.length === 0) {
                toast.error('× Ajoutez au moins une fonctionnalité');
                return;
            }
            setState({ ...state, loading: true });
            const plan = await addPlan({ 
                name: state.name,
                description: state.description,
                price: state.price,
                currency: state.currency,
                duration: state.duration,
                role: state.role,
                features: state.features
            });
            if (plan?._id) {
                toast.success('✓ Plan ajouté');
                closeModal();
            } else {
                toast.error('× ' + (plan?.error || 'Erreur'));
            }
            setState({ ...state, loading: false });
        } catch (error) {
            toast.error('× Erreur serveur');
            setState({ ...state, loading: false });
        }
    };
    return (
        <Modal
            isOpen={true}
            onClose={closeModal}
            title="Ajouter un plan"
            size="md"
        >
            <form onSubmit={handleAddPlan} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Nom du plan"
                        value={state?.name}
                        onChange={(e) => setState({ ...state, name: e.target.value })}
                        placeholder="Nom du plan"
                        minLength={3}
                        required
                    />
                    <Input
                        label="Prix"
                        type="number"
                        min={0}
                        max={65590}
                        value={state?.price}
                        onChange={(e) => setState({ ...state, price: e.target.value })}
                        placeholder="Prix"
                        required
                    />
                </div>

                <Input
                    label="Description"
                    value={state?.description}
                    onChange={(e) => setState({ ...state, description: e.target.value })}
                    placeholder="Description du plan"
                    minLength={5}
                    required
                />

                <div className="grid grid-cols-3 gap-2">
                    <Select
                        label="Devise"
                        options={currencyOptions}
                        value={state?.currency}
                        onChange={(value) => setState({ ...state, currency: value })}
                    />
                    <Select
                        label="Durée"
                        options={durationOptions}
                        value={state?.duration}
                        onChange={(value) => setState({ ...state, duration: value })}
                    />
                    <Select
                        label="Rôle"
                        options={roleOptions}
                        value={state?.role}
                        onChange={(value) => setState({ ...state, role: value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Fonctionnalités</label>
                    <div className="flex gap-2">
                        <Input
                            value={state?.feature}
                            onChange={(e) => setState({ ...state, feature: e.target.value })}
                            placeholder="Ajouter une fonctionnalité"
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            onClick={() => {
                                if (state?.feature) {
                                    setState({ 
                                        ...state, 
                                        features: [...state?.features, state?.feature], 
                                        feature: "" 
                                    });
                                }
                            }}
                            disabled={!state?.feature}
                        >
                            +
                        </Button>
                    </div>
                    <div className="flex gap-2 flex-wrap mt-2">
                        {state?.features?.length > 0 && state?.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 bg-indigo-600/80 rounded-full px-3 py-1 text-xs">
                                <span className="text-white">{feature}</span>
                                <button 
                                    type="button"
                                    onClick={() => setState({ 
                                        ...state, 
                                        features: state?.features.filter((f, i) => i !== index) 
                                    })} 
                                    className="text-red-400 hover:text-red-300"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={closeModal}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        disabled={state.loading}
                        loading={state.loading}
                    >
                        Ajouter
                    </Button>
                </div>
            </form>
        </Modal>
    );
}