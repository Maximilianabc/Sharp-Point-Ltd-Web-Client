import { createStore } from 'redux';
import { currentUser } from './Reducers';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistedReducer = persistReducer({
  key: "root",
  storage
}, currentUser);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { persistor, store };
