// middleware/deliveryFeePersistence.js

const DELIVERY_FEE_KEY = 'deliveryFeesCache';

const saveToLocalStorage = (data) => {
  localStorage.setItem(DELIVERY_FEE_KEY, JSON.stringify(data));
};

const loadFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(DELIVERY_FEE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to load deliveryFees from localStorage', e);
    return {};
  }
};

export const deliveryFeePersistence = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type === 'exchange/updateDeliveryFee') {
    const state = store.getState();
    const deliveryFees = state.exchange.deliveryFees;
    saveToLocalStorage(deliveryFees);
  }

  return result;
};

export const restoreDeliveryFees = () => {
  return {
    type: 'exchange/restoreDeliveryFeesFromLocalStorage',
    payload: loadFromLocalStorage(),
  };
};
