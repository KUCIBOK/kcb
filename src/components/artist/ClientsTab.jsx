import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useClients } from "../../store/ClientContext";
import ImportFile from "../client/ImportFile";
import AddClient from "../client/AddClient";
import ClientActions from "../client/ClientActions";

export const ClientsTab = ({ user }) => {
  const {
    artistClients: clients,
    loading,
    addClient: addClientToStore,
    updateClient: updateClientInStore,
    deleteClient: deleteClientFromStore,
    uploadClients: uploadClientsToStore,
  } = useClients();
  const [filteredClients, setFilteredClients] = useState([]);
  const [currentSet, setCurrentSet] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Initialiser les clients filtrés quand les clients changent
  useEffect(() => {
    if (clients.length > 0) {
      const sortedClients = [...clients].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setFilteredClients(sortedClients);
      setCurrentSet(sortedClients.slice(0, 40));
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
    setCurrentSet(filtered.slice(0, 40));
  }, [search, clients]);

  const handleAddClient = async (clientData) => {
    const result = await addClientToStore(clientData);
    if (!result.error) {
      setShowAddForm(false);
      return result;
    }
    return result;
  };

  const handleClientUpdated = async (id, clientData) => {
    const result = await updateClientInStore(id, clientData);
    return result;
  };

  const handleClientDeleted = async (deletedClientId) => {
    const result = await deleteClientFromStore(deletedClientId);
    return result;
  };

  const handleCSVUpload = async (file) => {
    const result = await uploadClientsToStore(file);
    return result;
  };

  const handlePrevPage = () => {
    if (currentSet[0] !== filteredClients[0]) {
      const startIndex = filteredClients.indexOf(currentSet[0]) - 40;
      setCurrentSet(filteredClients.slice(startIndex, startIndex + 40));
    }
  };

  const handleNextPage = () => {
    const lastIndex = filteredClients.indexOf(
      currentSet[currentSet.length - 1]
    );
    if (lastIndex < filteredClients.length - 1) {
      setCurrentSet(filteredClients.slice(lastIndex + 1, lastIndex + 41));
    }
  };

  return (
    <div>
      {/* Barre d'actions */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center">
          <input
            type="text"
            className="w-full rounded-s-md border-y border-s border-gray-700 bg-background px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
            placeholder="Rechercher un client par nom, prénom, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="rounded-e-md border-y border-e border-gray-700 bg-background px-3 py-2.5 text-sm text-gray-200">
            <Search className="w-4 h-4" />
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 text-sm rounded-md bg-purple-kcb text-white hover:bg-purple-kcb/90 transition flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Ajouter un client
          </button>
          <ImportFile onUpload={handleCSVUpload} />
        </div>
      </div>

      {/* Tableau des clients */}
      <div className="overflow-x-auto bg-background border border-gray-800 rounded-xl px-4 py-4 shadow-sm">
        {currentSet?.length >= 1 ? (
          <table className="w-full text-xs text-gray-200">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="font-semibold py-2 text-left">Nom</th>
                <th className="font-semibold py-2 text-left">Prénom</th>
                <th className="font-semibold py-2 text-left">Email</th>
                <th className="font-semibold py-2 text-left">Téléphone</th>
                <th className="font-semibold py-2 text-left">Ville</th>
                <th className="font-semibold py-2 text-left">Ajouté le</th>
                <th className="font-semibold py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentSet?.map((client, index) => (
                <Fragment key={index}>
                  <tr className="border-b border-gray-800 hover:bg-background/60 transition">
                    <td className="py-2 font-semibold text-white">
                      {client.nom}
                    </td>
                    <td className="py-2 text-gray-300">{client.prenom}</td>
                    <td className="py-2 text-gray-300">{client.email}</td>
                    <td className="py-2 text-gray-400">
                      {client.telephone || "-"}
                    </td>
                    <td className="py-2 text-gray-400">
                      {client.ville || "-"}
                    </td>
                    <td className="py-2 text-gray-400">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2">
                      <ClientActions
                        client={client}
                        onClientUpdated={handleClientUpdated}
                        onClientDeleted={handleClientDeleted}
                      />
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-16 border border-gray-800 border-dashed rounded-xl w-full bg-background/60">
            <h3 className="font-medium text-base text-gray-400 mb-1">
              Aucun client trouvé
            </h3>
            <p className="text-sm text-gray-500">
              {search
                ? "Essayez une autre recherche"
                : "Commencez par ajouter un client"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredClients.length > 5 && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 bg-transparent hover:bg-gray-800 transition"
            onClick={handlePrevPage}
            disabled={currentSet[0] === filteredClients[0]}
          >
            <ChevronLeft className="w-4 h-4 mr-1 inline-block" /> Précédent
          </button>
          <span className="text-xs text-gray-400 flex items-center px-2">
            Page {Math.floor(filteredClients.indexOf(currentSet[0]) / 40) + 1} /{" "}
            {Math.ceil(filteredClients.length / 40)}
          </span>
          <button
            className="rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 bg-transparent hover:bg-gray-800 transition"
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

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <AddClient
          onAddClient={handleAddClient}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};
