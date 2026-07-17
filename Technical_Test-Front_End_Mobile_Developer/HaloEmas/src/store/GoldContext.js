import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { fetchGoldPrices, fetchLatestPrice } from '../services/api';

const GoldContext = createContext(null);

const GOLD_ACTION = {
  SET_LOADING: 'SET_LOADING',
  SET_PRICES: 'SET_PRICES',
  SET_CURRENT: 'SET_CURRENT',
  SET_ERROR: 'SET_ERROR',
  BUY_SUCCESS: 'BUY_SUCCESS',
};

const initialState = {
  currentPrice: null,
  previousPrice: null,
  priceHistory: [],
  isLoading: true,
  error: null,
  lastTransaction: null,
  source: 'mock',
};

const goldReducer = (state, action) => {
  switch (action.type) {
    case GOLD_ACTION.SET_LOADING:
      return { ...state, isLoading: true };
    case GOLD_ACTION.SET_PRICES:
      return {
        ...state,
        priceHistory: action.payload.history,
        currentPrice: action.payload.current,
        previousPrice: action.payload.previous,
        isLoading: false,
        error: null,
        source: action.payload.source,
      };
    case GOLD_ACTION.SET_CURRENT:
      return { ...state, currentPrice: action.payload, isLoading: false };
    case GOLD_ACTION.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case GOLD_ACTION.BUY_SUCCESS:
      return {
        ...state,
        lastTransaction: action.payload,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const GoldProvider = ({ children }) => {
  const [state, dispatch] = useReducer(goldReducer, initialState);

  const loadPrices = useCallback(async () => {
    dispatch({ type: GOLD_ACTION.SET_LOADING });
    const data = await fetchGoldPrices({ length: 30 });
    if (data && data.length > 0) {
      const current = data[data.length - 1];
      const previous = data.length > 1 ? data[data.length - 2] : null;
      dispatch({
        type: GOLD_ACTION.SET_PRICES,
        payload: { history: data, current, previous, source: 'api' },
      });
    } else {
      const fallback = { buy: 1945200, sell: 1925000, date: new Date().toISOString().split('T')[0] };
      dispatch({
        type: GOLD_ACTION.SET_PRICES,
        payload: {
          history: [{ ...fallback, id: 1 }],
          current: fallback,
          previous: null,
          source: 'mock',
        },
      });
    }
  }, []);

  useEffect(() => {
    loadPrices();
  }, [loadPrices]);

  const buyGold = async (amount, currentBalance) => {
    dispatch({ type: GOLD_ACTION.SET_LOADING });
    return new Promise((resolve) => {
      setTimeout(() => {
        if (amount <= 0 || !state.currentPrice) {
          dispatch({ type: GOLD_ACTION.SET_ERROR, payload: 'Nominal harus lebih dari 0' });
          resolve({ success: false, error: 'Nominal harus lebih dari 0' });
          return;
        }
        const gram = amount / state.currentPrice.buy;
        const newBalance = currentBalance + gram;
        const transaction = {
          id: Date.now().toString(),
          type: 'BUY',
          rupiahAmount: amount,
          gramAmount: gram,
          goldPrice: state.currentPrice.buy,
          status: 'SUCCESS',
          date: new Date().toISOString(),
        };
        dispatch({ type: GOLD_ACTION.BUY_SUCCESS, payload: transaction });
        resolve({ success: true, transaction, newBalance });
      }, 1500);
    });
  };

  const sellGold = async (gramAmount, currentGoldBalance) => {
    dispatch({ type: GOLD_ACTION.SET_LOADING });
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!state.currentPrice) {
          dispatch({ type: GOLD_ACTION.SET_ERROR, payload: 'Harga emas tidak tersedia' });
          resolve({ success: false, error: 'Harga emas tidak tersedia' });
          return;
        }
        if (gramAmount <= 0) {
          dispatch({ type: GOLD_ACTION.SET_ERROR, payload: 'Jumlah emas harus lebih dari 0' });
          resolve({ success: false, error: 'Jumlah emas harus lebih dari 0' });
          return;
        }
        if (gramAmount > currentGoldBalance) {
          const msg = `Saldo emas tidak mencukupi. Saldo Anda: ${currentGoldBalance.toFixed(4)} gr`;
          dispatch({ type: GOLD_ACTION.SET_ERROR, payload: msg });
          resolve({ success: false, error: msg });
          return;
        }
        const rupiahReceived = Math.floor(gramAmount * state.currentPrice.sell);
        const newGoldBalance = currentGoldBalance - gramAmount;
        const transaction = {
          id: Date.now().toString(),
          type: 'SELL',
          rupiahAmount: rupiahReceived,
          gramAmount: gramAmount,
          goldPrice: state.currentPrice.sell,
          status: 'SUCCESS',
          date: new Date().toISOString(),
        };
        dispatch({ type: GOLD_ACTION.BUY_SUCCESS, payload: transaction });
        resolve({ success: true, transaction, newGoldBalance, rupiahReceived });
      }, 1500);
    });
  };

  return (
    <GoldContext.Provider value={      { ...state, loadPrices, buyGold, sellGold }}>
      {children}
    </GoldContext.Provider>
  );
};

export const useGold = () => {
  const ctx = useContext(GoldContext);
  if (!ctx) throw new Error('useGold must be used within GoldProvider');
  return ctx;
};
