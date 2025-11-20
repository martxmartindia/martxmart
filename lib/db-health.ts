import { prisma } from './prisma';

export class DatabaseHealthChecker {
  private static instance: DatabaseHealthChecker;
  private isHealthy = true;
  private lastCheck = Date.now();
  private readonly CHECK_INTERVAL = 30000; // 30 seconds

  private constructor() {}

  static getInstance(): DatabaseHealthChecker {
    if (!DatabaseHealthChecker.instance) {
      DatabaseHealthChecker.instance = new DatabaseHealthChecker();
    }
    return DatabaseHealthChecker.instance;
  }

  async checkHealth(): Promise<boolean> {
    const now = Date.now();
    
    // Only check if enough time has passed
    if (now - this.lastCheck < this.CHECK_INTERVAL && this.isHealthy) {
      return this.isHealthy;
    }

    try {
      // Simple query to check database connectivity
      await prisma.$queryRaw`SELECT 1`;
      this.isHealthy = true;
      this.lastCheck = now;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      this.isHealthy = false;
      this.lastCheck = now;
      return false;
    }
  }

  async ensureConnection(): Promise<void> {
    const isHealthy = await this.checkHealth();
    
    if (!isHealthy) {
      console.log('Database connection unhealthy, attempting to reconnect...');
      try {
        await prisma.$disconnect();
        await prisma.$connect();
        console.log('Database reconnection successful');
      } catch (error) {
        console.error('Database reconnection failed:', error);
        throw new Error('Database connection failed');
      }
    }
  }

  getStatus(): { healthy: boolean; lastCheck: number } {
    return {
      healthy: this.isHealthy,
      lastCheck: this.lastCheck,
    };
  }
}

export const dbHealth = DatabaseHealthChecker.getInstance();