import { createStore } from 'redux';
import { currentUser } from './Reducers';

const store = createStore(currentUser);

export { store };