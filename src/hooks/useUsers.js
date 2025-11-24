import { useEffect, useState, useCallback } from "react";
import * as api from "../services/userService";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getUsers();

      const roles = ['Admin', 'Contributor', 'Viewer'];
      const currentYear = new Date().getFullYear();

      const mapped = res.data.map((user, index) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        location: user.address?.city || 'Unknown',
        joined: new Date(currentYear - (index % 3), index % 12, (index % 28) + 1)
          .toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
        role: roles[index % 3], // توزيع عشوائي للأدوار
        avatar: `https://i.pravatar.cc/150?u=${user.id}`,
        phone: user.phone,
        website: user.website,
        company: user.company?.name || 'Unknown'
      }));

      setUsers(mapped);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = async (newUser) => {
    try {
      setError(null);
      const userToAdd = {
        name: newUser.name,
        email: newUser.email,
        address: { city: newUser.location || 'Unknown' },
        phone: newUser.phone || '',
        website: newUser.website || '',
        company: { name: newUser.company || 'Unknown' }
      };

      const res = await api.createUser(userToAdd);

      const addedUser = {
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        location: res.data.address?.city || 'Unknown',
        joined: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        role: newUser.role || 'Viewer',
        avatar: `https://i.pravatar.cc/150?u=${res.data.id}`,
        phone: res.data.phone,
        website: res.data.website,
        company: res.data.company?.name || 'Unknown'
      };

      setUsers(prev => [...prev, addedUser]);
      return res;
    } catch (err) {
      const errorMsg = err.message || 'Failed to add user';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const editUser = async (id, updatedUser) => {
    try {
      setError(null);

      const userToUpdate = {
        name: updatedUser.name,
        email: updatedUser.email,
        address: {
          ...users.find(u => u.id === id)?.address,
          city: updatedUser.location
        },
        phone: updatedUser.phone,
        website: updatedUser.website,
        company: {
          ...users.find(u => u.id === id)?.company,
          name: updatedUser.company
        }
      };

      await api.updateUser(id, userToUpdate);

      setUsers(prev => prev.map(u =>
        u.id === id ? { ...u, ...updatedUser } : u
      ));
    } catch (err) {
      const errorMsg = err.message || 'Failed to update user';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };


  const patchUser = async (id, partialUser) => {
    try {
      setError(null);
      await api.patchUser(id, partialUser);

      setUsers(prev =>
        prev.map(u => u.id === id ? { ...u, ...partialUser } : u
        ));
    } catch (err) {
      const errorMsg = err.message || 'Failed to partially update user';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };


  const removeUser = async (id) => {
    try {
      setError(null);
      await api.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete user';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const refetch = () => {
    fetchUsers();
  };

  return {
    users,
    loading,
    error,
    refetch,
    addUser,
    editUser,
    patchUser,
    removeUser
  };
}