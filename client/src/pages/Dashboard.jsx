import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { GateCard } from '@/components/ui/gate-card';
import { EventList } from '@/components/ui/event-list';
import { CarFront } from 'lucide-react';
import { io } from 'socket.io-client';

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [events, setEvents] = useState([]);
  const [isConnecting, setIsConnecting] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const socket = io(window.location.origin, {
      path: '/socket.io',
      reconnection: true,
      reconnectionDelay: 5000,
      reconnectionAttempts: Infinity,
      transports: ['websocket', 'polling']
    });

    // Connection events
    socket.on('connect', () => {
      console.log('Socket.IO connected');
      setIsConnecting(false);
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setIsConnecting(true);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      setIsConnecting(true);
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'Failed to connect to server',
      });
    });

    // Data events
    socket.on('status', (data) => {
      console.log('Received status update:', data);
      setStatus(data);
    });

    socket.on('events', (data) => {
      console.log('Received events update:', data);
      setEvents(data);
    });

    socket.on('update', ({ event, status }) => {
      console.log('Received update:', { event, status });
      setStatus(status);
      setEvents(prev => [...prev.slice(-9), event]);
      toast({
        title: `New ${event.direction} event`,
        description: `Gate: ${event.gateId.replace('-', ' ')}`,
        duration: 3000,
      });
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'An error occurred',
      });
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array - only run on mount

  if (isConnecting || !status) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <CarFront className="mx-auto h-12 w-12 animate-pulse text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">
            {isConnecting ? 'Connecting...' : 'Loading...'}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold">Parking Pulse</h1>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Total Occupancy</h2>
          <div className="flex items-center gap-2">
            <CarFront className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold">{status.totalOccupancy}</span>
          </div>
        </div>
        <Progress value={status.totalOccupancy} className="h-4" />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {status.gates.map(gate => (
          <GateCard key={gate.gateId} gate={gate} />
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Events</h2>
        <EventList events={events} />
      </Card>
    </div>
  );
}