import './App.scss';
import './services/storage';
import { Route } from 'wouter';
import { Browser } from '@/pages/Browser/Browser';
import { AppProvider } from '@/context/App';
import { Startup } from '@/pages/Startup/Startup';

export const App = () => {
  return (
    <>
      <Route path={'/'} component={Startup}></Route>
      <Route path={'/browser'}>
        <AppProvider>
          <Browser />
        </AppProvider>
      </Route>
    </>
  );
};
