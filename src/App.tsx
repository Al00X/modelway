import './App.scss';
import './services/storage';
import { Browser } from '@/pages/Browser/Browser';
import { AppProvider } from '@/context/App';

export const App = () => {
  return (
    <AppProvider>
      <Browser />
    </AppProvider>
  );
};
