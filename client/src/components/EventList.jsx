import React from 'react';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

export function EventList({ events }) {
  return (
    <div className="space-y-2">
      {events.map((event, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 bg-muted rounded-lg"
        >
          <span className="font-medium capitalize">
            {event.gateId.replace('-', ' ')}
          </span>
          <div className="flex items-center gap-2">
            {event.direction === 'entry' ? (
              <ArrowDownToLine className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowUpFromLine className="h-4 w-4 text-red-500" />
            )}
            <span className={event.direction === 'entry' ? 'text-green-600' : 'text-red-600'}>
              {event.direction}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {new Date(event.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
} 