import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const Step2 = ({ formState, setFormState }) => {
    const [state, setState] = useState({
      showPassword : false
    })
    return (
        <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background px-4">
          <div className="w-full max-w-sm mx-auto">
            {formState.error && (
              <div className="mb-4 text-red-300 text-center bg-red-900/20 border border-red-900 rounded-md p-2 text-xs">
                {formState.error}
              </div>
            )}
            <div className="bg-card rounded-xl border border-gray-800 shadow-sm p-6">
              <p className="text-center text-xl font-bold text-white mb-2">Créer un compte</p>
              <p className="text-xs text-center text-gray-400 mb-6">Entrez votre email et créez un mot de passe</p>
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
                <div>
                  <label htmlFor="email" className="text-xs font-medium text-gray-400">Email</label>
                  <input
                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                    value={formState?.email}
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="w-full border border-gray-800 bg-gray-900 rounded-md px-3 py-2 mt-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-kcb"
                    minLength={6}
                    placeholder="Votre email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="text-xs font-medium text-gray-400">Mot de passe</label>
                  <div className="flex items-center mt-1">
                      <input
                        onChange={e => setFormState({ ...formState, password: e.target.value })}
                        value={formState?.password}
                        type={state.showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        minLength={8}
                        required
                        className="w-9/10 border border-gray-800 bg-gray-900 rounded-s-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-kcb"
                        placeholder="Votre mot de passe"
                      />
                      <button type="button" onClick={() => setState({ ...state, showPassword: !state.showPassword })} className="w-1/10 flex justify-center border border-gray-800 bg-gray-900 rounded-e-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-kcb">
                        {state.showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="text-xs font-medium text-gray-400">Confirmer le mot de passe</label>
                  <div className="flex mt-1 items-center">
                    <input
                      onChange={e => setFormState({ ...formState, confirmPassword: e.target.value })}
                      value={formState?.confirmPassword}
                      type={state.showPassword ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      minLength={8}
                      required
                      className="w-9/10 border border-gray-800 bg-gray-900 rounded-s-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-kcb"
                      placeholder="Confirmez le mot de passe"
                    />
                    <button type="button" onClick={() => setState({ ...state, showPassword: !state.showPassword })} className="w-1/10 flex justify-center border border-gray-800 bg-gray-900 rounded-e-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-kcb">
                      {state.showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                {formState?.confirmPassword && formState?.confirmPassword !== formState?.password && (
                  <p className="text-xs text-red-500/70">Les mots de passe ne correspondent pas</p>
                )}
                <button
                  disabled={!formState.confirmPassword || formState?.confirmPassword !== formState?.password}
                  type="submit"
                  className="w-full py-2 rounded-md bg-indigo-kcb text-white font-semibold text-sm hover:bg-indigo-700 transition mt-2"
                >
                  Suivant
                </button>
              </form>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setFormState({ ...formState, step: 0, loading: false })}
                  className="text-xs text-gray-400 hover:underline w-full"
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
    )
}