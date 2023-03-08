import './App.scss';
import './services/storage';
import Browser from '@/pages/Browser/Browser';
import { AppProvider } from '@/context/app.context';

export default function App() {
  return (
    <>
      <AppProvider>
        <Browser />
      </AppProvider>
    </>
  );
}
