import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button, Input } from "../ui";

export const Step2 = ({ formState, setFormState }) => {
    const [state, setState] = useState({ showPassword: false });

    const passwordMismatch = formState?.confirmPassword && formState?.confirmPassword !== formState?.password;

    return (
        <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-kcb-noir-deep px-4">
          <div className="w-full max-w-sm mx-auto">
            {formState.error && (
              <div className="mb-4 text-red-300 text-center bg-red-900/20 border border-red-900 rounded-md p-2 text-xs">
                {formState.error}
              </div>
            )}
            <div className="bg-kcb-ardoise rounded-[4px] border border-white/[0.06] shadow-sm p-6">
              <p className="text-center text-xl font-bold text-white mb-2">Créer un compte</p>
              <p className="text-xs text-center text-kcb-pierre mb-6">Entrez votre email et créez un mot de passe</p>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (formState.password === formState.confirmPassword) {
                    setFormState({ ...formState, step: 2 });
                  }
                }}
                className="space-y-4"
                method="post"
              >
                <Input
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Votre email"
                  required
                  minLength={6}
                  size="sm"
                  value={formState?.email}
                  onChange={e => setFormState({ ...formState, email: e.target.value })}
                />
                <div>
                  <label htmlFor="password" className="text-xs font-medium text-kcb-pierre">Mot de passe</label>
                  <div className="flex items-center mt-1">
                    <input
                      onChange={e => setFormState({ ...formState, password: e.target.value })}
                      value={formState?.password}
                      type={state.showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      minLength={8}
                      required
                      className="w-9/10 border border-white/[0.06] bg-kcb-noir rounded-s-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-kcb-or"
                      placeholder="Votre mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setState({ ...state, showPassword: !state.showPassword })}
                      className="w-1/10 flex justify-center border border-white/[0.06] bg-kcb-noir rounded-e-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-kcb-or"
                    >
                      {state.showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="text-xs font-medium text-kcb-pierre">Confirmer le mot de passe</label>
                  <div className="flex mt-1 items-center">
                    <input
                      onChange={e => setFormState({ ...formState, confirmPassword: e.target.value })}
                      value={formState?.confirmPassword}
                      type={state.showPassword ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      minLength={8}
                      required
                      className="w-9/10 border border-white/[0.06] bg-kcb-noir rounded-s-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-kcb-or"
                      placeholder="Confirmez le mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setState({ ...state, showPassword: !state.showPassword })}
                      className="w-1/10 flex justify-center border border-white/[0.06] bg-kcb-noir rounded-e-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-kcb-or"
                    >
                      {state.showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {passwordMismatch && (
                    <p className="text-xs text-red-500/70 mt-1">Les mots de passe ne correspondent pas</p>
                  )}
                </div>
                <Button
                  type="submit"
                  fullWidth
                  disabled={!formState.confirmPassword || passwordMismatch}
                  className="bg-kcb-or hover:bg-kcb-bronze border-0 text-sm font-semibold mt-2"
                >
                  Suivant
                </Button>
              </form>
              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => setFormState({ ...formState, step: 0, loading: false })}
                  className="text-xs text-kcb-pierre"
                  size="sm"
                >
                  Retour
                </Button>
              </div>
            </div>
          </div>
        </div>
        </>
    );
}
