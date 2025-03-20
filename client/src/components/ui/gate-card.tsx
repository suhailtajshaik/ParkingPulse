import { GateStatus } from '@shared/schema';
import { Card } from './card';
import { ArrowUpFromLine, ArrowDownToLine, CarFront } from 'lucide-react';

interface GateCardProps {
  gate: GateStatus;
}

export function GateCard({ gate }: GateCardProps) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold capitalize">
          {gate.gateId.replace('-', ' ')}
        </h3>
        <div className="flex items-center gap-2">
          <CarFront className="h-5 w-5 text-muted-foreground" />
          <span className="text-xl font-bold">{gate.occupancy}</span>
        </div>
      </div>
      
      {gate.lastEvent && (
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {gate.lastEvent.direction === 'entry' ? (
              <ArrowDownToLine className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowUpFromLine className="h-4 w-4 text-red-500" />
            )}
            <span>
              Last {gate.lastEvent.direction} at{' '}
              {new Date(gate.lastEvent.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
