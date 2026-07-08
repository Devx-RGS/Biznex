import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem('userProfile');
        if (stored) {
          setProfile(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load profile in UserContext:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const updateProfile = async (updatesOrUpdater) => {
    try {
      let updatedProfile;
      if (typeof updatesOrUpdater === 'function') {
        setProfile((prev) => {
          updatedProfile = updatesOrUpdater(prev);
          AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile)).catch((e) => {
            console.error('Failed to save profile inside functional update:', e);
          });
          return updatedProfile;
        });
      } else {
        updatedProfile = { ...profile, ...updatesOrUpdater };
        setProfile(updatedProfile);
        await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      }
      return updatedProfile;
    } catch (e) {
      console.error('Failed to save profile in UserContext:', e);
      throw e;
    }
  };

  const clearProfile = async () => {
    try {
      setProfile(null);
      await AsyncStorage.removeItem('userProfile');
    } catch (e) {
      console.error('Failed to clear profile in UserContext:', e);
      throw e;
    }
  };

  return (
    <UserContext.Provider value={{ profile, setProfile, updateProfile, clearProfile, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
