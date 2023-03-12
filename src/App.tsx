import './App.scss';
import './services/storage';
import Browser from '@/pages/Browser/Browser';
import { AppProvider } from '@/context/app.context';
import TitleBar from "@/features/TitleBar/TitleBar";

export default function App() {
  return (
    <>
      <AppProvider>
        <Browser />
      </AppProvider>
    </>
  );
}
