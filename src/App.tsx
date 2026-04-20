import { useEffect } from 'react';
import AppShell from './components/AppShell';
import { useAppStore } from './store/useAppStore';

export default function App() {
  const init = useAppStore((s) => s.init);
  useEffect(() => {
    init();
  }, [init]);
  return <AppShell />;
}
