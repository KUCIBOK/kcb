import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  changePassword,
  getUserProfile,
  updateProfile,
  updateUser,
} from "../api/useAuth";
import { updateArtist } from "../api/useArtists";
import { createLog } from "../api/useLog";

//Création du context
export const AuthContext = createContext(null);

const initialState = {
  user: null,
  artistProfile: null,
  collectorProfile: {},
  professionalProfile: {},
  adminProfile: {},
  subscription: null,
  plan: null,
  // Functions
  login: () => {},
  logout: () => {},
};

export function AuthContextProvider({ children }) {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  useEffect(() => {
    if (state?.user) {
      const fetchUserData = async () => {
        const profileData = await getUserProfile(state?.user?._id);
        if (profileData?._id) {
          if (state?.user?.role == "artist")
            setState((prev) => ({ ...prev, artistProfile: profileData }));
          if (state?.user?.role == "collector")
            setState((prev) => ({ ...prev, collectorProfile: profileData }));
          if (state?.user?.role == "professional")
            setState((prev) => ({ ...prev, professionalProfile: profileData }));
        }
      };
      fetchUserData();
    }
  }, [state?.user?._id]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        artistProfile: state.artistProfile,
        collectorProfile: state.collectorProfile,
        professionalProfile: state.professionalProfile,
        adminProfile: state.adminProfile,
        subscription: state.subscription,
        plan: state.plan,
        login: (user) => {
          // Ajoute le token du localStorage dans le state user
          setState((prev) => ({
            ...prev,
            user: { ...user, token: localStorage.getItem("token") },
            subscription: user?.subscription,
            plan: user?.plan,
            likedArtworks: user?.likedArtworks || [],
          }));
          const sendLog = async () => {
            await createLog({
              description: `L'utilisateur ${user?.name} s'est connecté`,
              userId: user?._id,
            });
          };
          sendLog();
        },
        setProfile: function (profile) {
          if (state?.user?.role == "artist") {
            setState({ ...state, artistProfile: profile });
          }
          if (state?.user?.role == "collector") {
            setState({ ...state, collectorProfile: profile });
          }
          if (state?.user?.role == "professional") {
            setState({ ...state, professionalProfile: profile });
          }
          if (state?.user?.role == "admin") {
            setState({ ...state, user: user });
          }
        },
        logout: () => {
          setState({ ...state, user: null });
          localStorage.removeItem("token");
          window.location.reload();
          navigate("/");
        },
        updateUser: async (payload) => {
          const user = await updateUser(state?.user?._id, payload);
          if (user?.token) {
            localStorage.removeItem("token");
            localStorage.setItem("token", user?.token);
          }
          if (user?._id) {
            setState({
              ...state,
              user: user,
            });
            await createLog({
              description: `L'utilisateur ${user?.name} s'est mis à jour`,
              userId: user?._id,
            });
            return user;
          }
        },
        updateArtist: async (payload) => {
          const artistProfile = await updateArtist(state?.user?._id, payload);
          if (artistProfile?._id) {
            setState((prev) => ({
              ...prev,
              artistProfile: artistProfile,
            }));
            await createLog({
              description: `L'utilisateur ${state?.user?.name} a mis son profil Artiste à jour`,
              userId: state?.user?._id,
            });
            return artistProfile;
          }
        },
        updateProfile: async (payload) => {
          const profile = await updateProfile(state?.user?._id, payload);
          if (profile?._id) {
            if (state?.user?.role == "collector") {
              setState((prev) => ({
                ...prev,
                collectorProfile: profile,
              }));
            }
            if (state?.user?.role == "professional") {
              setState((prev) => ({
                ...prev,
                professionalProfile: profile,
              }));
            }
            await createLog({
              description: `L'utilisateur ${state?.user?.name} a mis son profile a jour`,
              userId: state?.user?._id,
            });
            return profile;
          }
        },
        changePassword: async (payload) => {
          try {
            const user = await changePassword(payload);
            if (user?._id) {
              return user;
            }
            await createLog({
              description: `L'utilisateur ${state?.user?.name} a changé son mot de passe`,
              userId: state?.user?._id,
            });
            return { error: user?.error || user?.message };
          } catch (error) {
            return { error: error.message };
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
