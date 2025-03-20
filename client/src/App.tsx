import { Route } from 'wouter';
import Dashboard from './pages/Dashboard';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from './components/ui/toaster';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <Route path="/" component={Dashboard} />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
