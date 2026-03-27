import { ChevronLeft, ChevronRight, Search, Users } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useClients } from "../../store/ClientContext";
import { utils } from "../../api/useAPI";

const { api, options } = utils;

const ClientsTab = () => {
  const { clients, loading, refreshClients } = useClients();
  const [filteredClients, setFilteredClients] = useState([]);
  const [currentSet, setCurrentSet] = useState([]);
  const [search, setSearch] = useState("");
  const [artists, setArtists] = useState({});

  const loadArtists = async () => {
    try {
      const artistIds = [...new Set(clients.map((client) => client.artistId))];

      const artistsData = {};
      await Promise.all(
        artistIds.map(async (artistId) => {
          try {
            const response = await fetch(`${api}/auth/${artistId}`, {
              ...options,
              method: "GET",
            });
            if (response.ok) {
              const userData = await response.json();
              artistsData[artistId] = userData.user || userData;
            } else {
              artistsData[artistId] = {
                name: "Artiste inconnu",
                _id: artistId,
              };
            }
          } catch (error) {
            artistsData[artistId] = { name: "Artiste inconnu", _id: artistId };
          }
        })
      );

      setArtists(artistsData);
    } catch (error) {
      // Silenced for production
    }
  };

  // Charger les artistes quand les clients sont chargés
  useEffect(() => {
    if (clients.length > 0) {
      loadArtists();
    }
  }, [clients]);

  // Initialiser les clients filtrés quand les clients changent
  useEffect(() => {
    if (clients.length > 0) {
      const sortedClients = [...clients].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setFilteredClients(sortedClients);
      setCurrentSet(sortedClients.slice(0, 50));
    }
  }, [clients]);

  // Gestion de la recherche
  useEffect(() => {
    const query = search.trim().toLowerCase();
    let filtered = clients;
    if (query !== "") {
      filtered = clients.filter((client) => {
        const nomMatch = client.nom?.toLowerCase().includes(query);
        const prenomMatch = client.prenom?.toLowerCase().includes(query);
        const emailMatch = client.email?.toLowerCase().includes(query);
        const villeMatch = client.ville?.toLowerCase().includes(query);
        return nomMatch || prenomMatch || emailMatch || villeMatch;
      });
    }
    setFilteredClients(filtered);
    setCurrentSet(filtered.slice(0, 50));
  }, [search, clients]);

  const handlePrevPage = () => {
    if (currentSet[0] !== filteredClients[0]) {
      const startIndex = filteredClients.indexOf(currentSet[0]) - 50;
      setCurrentSet(filteredClients.slice(startIndex, startIndex + 50));
    }
  };

  const handleNextPage = () => {
    const lastIndex = filteredClients.indexOf(
      currentSet[currentSet.length - 1]
    );
    if (lastIndex < filteredClients.length - 1) {
      setCurrentSet(filteredClients.slice(lastIndex + 1, lastIndex + 51));
    }
  };

  const getClientsByArtist = () => {
    const grouped = {};
    filteredClients.forEach((client) => {
      const artistId = client.artistId;
      if (!grouped[artistId]) {
        grouped[artistId] = [];
      }
      grouped[artistId].push(client);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-kcb-pierre">Chargement des clients...</div>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6 text-kcb-or" />
          <h2 className="text-2xl font-bold text-white">
            Portefeuille clients
          </h2>
        </div>
        <p className="text-kcb-pierre">
          Tous les clients de tous les artistes de la plateforme
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-kcb-noir border border-white/[0.06] rounded-[4px] p-4">
          <div className="text-2xl font-bold text-white mb-1">
            {clients.length}
          </div>
          <div className="text-kcb-pierre text-sm">Total clients</div>
        </div>
        <div className="bg-kcb-noir border border-white/[0.06] rounded-[4px] p-4">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {clients.filter((c) => !c.isDeletedByArtist).length}
          </div>
          <div className="text-kcb-pierre text-sm">Clients actifs</div>
        </div>
        <div className="bg-kcb-noir border border-white/[0.06] rounded-[4px] p-4">
          <div className="text-2xl font-bold text-red-400 mb-1">
            {clients.filter((c) => c.isDeletedByArtist).length}
          </div>
          <div className="text-kcb-pierre text-sm">Clients supprimés</div>
        </div>
        <div className="bg-kcb-noir border border-white/[0.06] rounded-[4px] p-4">
          <div className="text-2xl font-bold text-white mb-1">
            {Object.keys(getClientsByArtist()).length}
          </div>
          <div className="text-kcb-pierre text-sm">Artistes actifs</div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="text"
            className="w-full rounded-s-md border-y border-s border-white/[0.06] bg-kcb-noir px-3 py-2 text-sm text-kcb-sable placeholder-kcb-pierre focus:outline-none"
            placeholder="Rechercher un client par nom, prénom, email, ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="rounded-e-md border-y border-e border-white/[0.06] bg-kcb-noir px-3 py-2.5 text-sm text-kcb-sable">
            <Search className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Tableau des clients */}
      <div className="overflow-x-auto bg-kcb-noir border border-white/[0.06] rounded-[4px] px-4 py-4 shadow-sm">
        {currentSet?.length >= 1 ? (
          <table className="w-full text-xs text-kcb-sable">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="font-semibold py-2 text-left">Nom</th>
                <th className="font-semibold py-2 text-left">Prénom</th>
                <th className="font-semibold py-2 text-left">Email</th>
                <th className="font-semibold py-2 text-left">Téléphone</th>
                <th className="font-semibold py-2 text-left">Ville</th>
                <th className="font-semibold py-2 text-left">Artiste</th>
                <th className="font-semibold py-2 text-left">Statut</th>
                <th className="font-semibold py-2 text-left">Ajouté le</th>
              </tr>
            </thead>
            <tbody>
              {currentSet?.map((client, index) => (
                <Fragment key={client._id || index}>
                  <tr
                    className={`border-b border-white/[0.06] hover:bg-white/[0.04] transition ${
                      client.isDeletedByArtist ? "opacity-60" : ""
                    }`}
                  >
                    <td className="py-2 font-semibold text-white">
                      {client.nom}
                    </td>
                    <td className="py-2 text-kcb-sable">{client.prenom}</td>
                    <td className="py-2 text-kcb-sable">{client.email}</td>
                    <td className="py-2 text-kcb-pierre">
                      {client.telephone || "-"}
                    </td>
                    <td className="py-2 text-kcb-pierre">
                      {client.ville || "-"}
                    </td>
                    <td className="py-2 text-kcb-pierre">
                      {artists[client.artistId] ? (
                        <span
                          title={`ID: ${client.artistId}`}
                          className="cursor-help hover:text-kcb-or transition-colors duration-200 font-medium"
                        >
                          {artists[client.artistId].name}
                        </span>
                      ) : (
                        <span
                          title={`ID: ${client.artistId}`}
                          className="cursor-help text-kcb-pierre italic"
                        >
                          Chargement...
                        </span>
                      )}
                    </td>
                    <td className="py-2">
                      {client.isDeletedByArtist ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          Supprimé par l'artiste
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          Actif
                        </span>
                      )}
                    </td>
                    <td className="py-2 text-kcb-pierre">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-16 border border-white/[0.06] border-dashed rounded-[4px] w-full bg-white/[0.04]">
            <Users className="w-12 h-12 text-kcb-pierre mx-auto mb-4" />
            <h3 className="font-medium text-base text-kcb-pierre mb-1">
              Aucun client trouvé
            </h3>
            <p className="text-sm text-kcb-pierre">
              {search
                ? "Essayez une autre recherche"
                : "Aucun client n'a encore été ajouté"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredClients.length > 50 && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="rounded-md border border-white/[0.06] px-4 py-2 text-sm text-kcb-sable bg-transparent hover:bg-white/[0.08] transition"
            onClick={handlePrevPage}
            disabled={currentSet[0] === filteredClients[0]}
          >
            <ChevronLeft className="w-4 h-4 mr-1 inline-block" /> Précédent
          </button>
          <span className="text-xs text-kcb-pierre flex items-center px-2">
            Page {Math.floor(filteredClients.indexOf(currentSet[0]) / 50) + 1} /{" "}
            {Math.ceil(filteredClients.length / 50)}
          </span>
          <button
            className="rounded-md border border-white/[0.06] px-4 py-2 text-sm text-kcb-sable bg-transparent hover:bg-white/[0.08] transition"
            onClick={handleNextPage}
            disabled={
              currentSet[currentSet.length - 1] ===
              filteredClients[filteredClients.length - 1]
            }
          >
            Suivant <ChevronRight className="w-4 h-4 ml-1 inline-block" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientsTab;
