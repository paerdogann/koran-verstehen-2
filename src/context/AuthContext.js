import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);
  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: 'E-Mail oder Passwort ist falsch.' };
    return { success: true };
  };
  const register = async (email, password, name) => {
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };
  const logout = async () => { await supabase.auth.signOut(); setUser(null); };
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
