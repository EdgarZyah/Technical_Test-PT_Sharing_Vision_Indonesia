import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEMO_USER } from '../constants/theme';

const AuthContext = createContext(null);

const AUTH_ACTION = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  RESTORE_SESSION: 'RESTORE_SESSION',
};

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTION.LOGIN_START:
      return { ...state, isLoading: true, error: null };
    case AUTH_ACTION.LOGIN_SUCCESS:
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false, error: null };
    case AUTH_ACTION.LOGIN_FAILURE:
      return { ...state, user: null, isAuthenticated: false, isLoading: false, error: action.payload };
    case AUTH_ACTION.LOGOUT:
      return { ...state, user: null, isAuthenticated: false, isLoading: false, error: null };
    case AUTH_ACTION.RESTORE_SESSION:
      return { ...state, user: action.payload, isAuthenticated: action.payload !== null, isLoading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('haloemas_user');
        dispatch({ type: AUTH_ACTION.RESTORE_SESSION, payload: stored ? JSON.parse(stored) : null });
      } catch {
        dispatch({ type: AUTH_ACTION.RESTORE_SESSION, payload: null });
      }
    })();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTION.LOGIN_START });
    await new Promise((r) => setTimeout(r, 800));

    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const user = {
        id: '1',
        name: DEMO_USER.name,
        email: DEMO_USER.email,
        goldBalance: DEMO_USER.goldBalance,
        balance: DEMO_USER.balance,
      };
      await AsyncStorage.setItem('haloemas_user', JSON.stringify(user));
      dispatch({ type: AUTH_ACTION.LOGIN_SUCCESS, payload: user });
      return { success: true };
    }
    const msg = 'Email atau password salah';
    dispatch({ type: AUTH_ACTION.LOGIN_FAILURE, payload: msg });
    return { success: false, error: msg };
  };

  const logout = async () => {
    await AsyncStorage.removeItem('haloemas_user');
    dispatch({ type: AUTH_ACTION.LOGOUT });
  };

  const updateGoldBalance = async (newBalance) => {
    if (state.user) {
      const updated = { ...state.user, goldBalance: newBalance };
      await AsyncStorage.setItem('haloemas_user', JSON.stringify(updated));
      dispatch({ type: AUTH_ACTION.LOGIN_SUCCESS, payload: updated });
    }
  };

  const updateBalance = async (rupiahAmount) => {
    if (state.user) {
      const updated = { ...state.user, balance: state.user.balance + rupiahAmount };
      await AsyncStorage.setItem('haloemas_user', JSON.stringify(updated));
      dispatch({ type: AUTH_ACTION.LOGIN_SUCCESS, payload: updated });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateGoldBalance, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
