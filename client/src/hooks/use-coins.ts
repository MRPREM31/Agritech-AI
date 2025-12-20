import { useState, useEffect } from 'react';

const COINS_STORAGE_KEY = 'edufarma_coins';

export function useCoins() {
  const [coins, setCoins] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load coins from localStorage on mount
  useEffect(() => {
    const savedCoins = localStorage.getItem(COINS_STORAGE_KEY);
    if (savedCoins) {
      setCoins(parseInt(savedCoins, 10));
    }
    setIsLoaded(true);
  }, []);

  // Save coins to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(COINS_STORAGE_KEY, coins.toString());
    }
  }, [coins, isLoaded]);

  const addCoins = (amount: number) => {
    console.log('addCoins called with:', amount);
    // Directly read current coins from localStorage
    const currentCoins = parseInt(localStorage.getItem(COINS_STORAGE_KEY) || '0', 10);
    const newTotal = currentCoins + amount;
    // Immediately save to localStorage (synchronous)
    localStorage.setItem(COINS_STORAGE_KEY, newTotal.toString());
    // Update React state too
    setCoins(newTotal);
    console.log('Coins updated directly:', currentCoins, '+', amount, '=', newTotal);
  };

  const resetCoins = () => {
    setCoins(0);
  };

  return { coins, addCoins, resetCoins, isLoaded };
}
