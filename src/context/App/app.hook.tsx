import { useContext } from 'react';
import { AppContext } from '@/context/App/app.context';

export const useAppContext = () => useContext(AppContext);
