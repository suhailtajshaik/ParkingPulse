import express from 'express';
import { Server } from 'socket.io';
import { storage } from './storage';
import { parkingEventSchema } from '@shared/schema';
import type { ParkingEvent } from '@shared/schema';
import { log } from './vite';

export async function registerRoutes(app: express.Express, io: Server) {
  // Socket.IO connection handling
  io.on('connection', async (socket) => {
    log('Client connected to socket.io');

    try {
      // Send initial system status
      const status = await storage.getSystemStatus();
      socket.emit('status', status);

      // Send recent events
      const events = await storage.getRecentEvents();
      socket.emit('events', events);
    } catch (error) {
      console.error('Error sending initial data:', error);
      socket.emit('error', { message: 'Failed to load initial data' });
    }

    socket.on('disconnect', () => {
      log('Client disconnected from socket.io');
    });
  });

  // Mock event generator for testing
  if (process.env.NODE_ENV !== 'production') {
    const gates = ['level1-main', 'level1-back', 'level4-blue', 'level4-green'] as const;

    setInterval(async () => {
      try {
        const mockEvent: ParkingEvent = {
          gateId: gates[Math.floor(Math.random() * gates.length)],
          direction: Math.random() > 0.5 ? 'entry' : 'exit',
          timestamp: new Date().toISOString(),
          metadata: {
            boundingBox: [100, 100, 200, 200],
            centroid: [150, 150]
          }
        };

        const status = await storage.addEvent(mockEvent);
        io.emit('update', { event: mockEvent, status });
        log(`Mock event: ${mockEvent.direction} at ${mockEvent.gateId}`);
      } catch (error: any) {
        console.error('Error generating mock event:', error.message);
      }
    }, 5000); // Generate mock event every 5 seconds
  }

  // REST API endpoints
  app.post('/api/events', async (req, res) => {
    try {
      const event = parkingEventSchema.parse(req.body);
      const status = await storage.addEvent(event);

      io.emit('update', { event, status });
      res.json({ success: true, status });
    } catch (error: any) {
      console.error('Error processing event:', error.message);
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/status', async (req, res) => {
    try {
      const status = await storage.getSystemStatus();
      res.json(status);
    } catch (error: any) {
      console.error('Error getting status:', error.message);
      res.status(500).json({ error: 'Failed to get system status' });
    }
  });

  app.get('/api/events/recent', async (req, res) => {
    try {
      const events = await storage.getRecentEvents();
      res.json(events);
    } catch (error: any) {
      console.error('Error getting recent events:', error.message);
      res.status(500).json({ error: 'Failed to get recent events' });
    }
  });
}