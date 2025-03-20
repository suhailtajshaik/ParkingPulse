import { ParkingEvent, GateStatus, SystemStatus } from '@shared/schema';

type GateId = "level1-main" | "level1-back" | "level4-blue" | "level4-green";

export interface IStorage {
  addEvent(event: ParkingEvent): Promise<SystemStatus>;
  getSystemStatus(): Promise<SystemStatus>;
  getRecentEvents(limit?: number): Promise<ParkingEvent[]>;
}

class MemStorage implements IStorage {
  private events: ParkingEvent[];
  private gateStatus: Map<string, GateStatus>;
  private totalOccupancy: number;

  constructor() {
    this.events = [];
    this.gateStatus = new Map();
    this.totalOccupancy = 40;
    
    // Initialize gates with 10 cars each
    (["level1-main", "level1-back", "level4-blue", "level4-green"] as const).forEach(gateId => {
      this.gateStatus.set(gateId, {
        gateId,
        occupancy: 10,
        lastEvent: undefined
      });
    });
  }

  async addEvent(event: ParkingEvent): Promise<SystemStatus> {
    this.events.push(event);
    const gate = this.gateStatus.get(event.gateId);
    
    if (!gate) {
      console.error(`Gate not found: ${event.gateId}`);
      return this.getSystemStatus();
    }
    
    if (event.direction === 'entry') {
      gate.occupancy += 1;
      this.totalOccupancy += 1;
    } else {
      gate.occupancy = Math.max(0, gate.occupancy - 1);
      this.totalOccupancy = Math.max(0, this.totalOccupancy - 1);
    }
    
    gate.lastEvent = event;
    this.gateStatus.set(event.gateId, gate);
    
    return this.getSystemStatus();
  }

  async getSystemStatus(): Promise<SystemStatus> {
    return {
      totalOccupancy: this.totalOccupancy,
      gates: Array.from(this.gateStatus.values()),
      lastUpdate: new Date().toISOString()
    };
  }

  async getRecentEvents(limit = 10): Promise<ParkingEvent[]> {
    return this.events.slice(-limit);
  }
}

export const storage = new MemStorage();
