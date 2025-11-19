import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from '../services/adminApi'; // Importe les fonctions API pour l'administration

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // État pour le terme de recherche
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Effet pour la redirection des non-administrateurs et le chargement initial des utilisateurs
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/'); // Redirige les utilisateurs non-admin
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  // Fonction pour récupérer la liste des utilisateurs depuis l'API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Échec de la récupération des utilisateurs.');
      console.error('Erreur lors de la récupération des utilisateurs :', err);
    } finally {
      setLoading(false);
    }
  };

  // Gère l'activation/désactivation d'un utilisateur
  const handleToggleActive = async (userId, currentStatus) => {
    try {
      await updateUser(userId, { is_active: !currentStatus });
      fetchUsers(); // Rafraîchit la liste après la mise à jour
    } catch (err) {
      setError('Échec de la mise à jour du statut de l\'utilisateur.');
      console.error('Erreur lors de la mise à jour du statut de l\'utilisateur :', err);
    }
  };

  // Gère la suppression d'un utilisateur
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteUser(userId);
        fetchUsers(); // Rafraîchit la liste après la suppression
      } catch (err) {
        setError('Échec de la suppression de l\'utilisateur.');
        console.error('Erreur lors de la suppression de l\'utilisateur :', err);
      }
    }
  };

  // Filtre les utilisateurs basés sur le terme de recherche (insensible à la casse)
  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center text-gray-500">Chargement des utilisateurs...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tableau de bord Administrateur</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Gérer les utilisateurs</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par e-mail..." // Placeholder en français
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">E-mail</th>
              <th className="py-3 px-6 text-left">Rôle</th>
              <th className="py-3 px-6 text-left">Statut</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredUsers.map((u) => ( // Utilise filteredUsers pour l'affichage
              <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 text-left whitespace-nowrap">{u.id}</td>
                <td className="py-3 px-6 text-left">{u.email}</td>
                <td className="py-3 px-6 text-left">{u.role}</td>
                <td className="py-3 px-6 text-left">
                  <span
                    className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                      u.is_active ? 'text-green-900' : 'text-red-900'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-0 opacity-50 rounded-full ${
                        u.is_active ? 'bg-green-200' : 'bg-red-200'
                      }`}
                    ></span>
                    <span className="relative">{u.is_active ? 'Actif' : 'Inactif'}</span>
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center space-x-3">
                    <button
                      onClick={() => handleToggleActive(u.id, u.is_active)}
                      disabled={u.id === user.id}
                      className={`px-4 py-2 rounded-md text-white text-xs font-medium ${
                        u.is_active ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {u.is_active ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={u.id === user.id}
                      className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
