import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class BusinessLogicInterceptor implements NestInterceptor {
  private readonly logger = new Logger('BusinessLogic');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const userId = request.user?.id || 'anonymous';

    return next.handle().pipe(
      tap((data) => {
        // Log important business events
        this.logBusinessEvent(method, url, userId, data);
      }),
    );
  }

  private logBusinessEvent(
    method: string,
    url: string,
    userId: string,
    data: any,
  ) {
    // User registration
    if (method === 'POST' && url.includes('/auth/register')) {
      this.logger.log(
        `✅ NEW USER REGISTERED - Email: ${data.user?.email} - ID: ${data.user?.id}`,
      );
    }

    // User login
    if (method === 'POST' && url.includes('/auth/login')) {
      this.logger.log(
        `🔐 USER LOGIN - Email: ${data.user?.email} - ID: ${data.user?.id}`,
      );
    }

    // Plant created
    if (method === 'POST' && url.includes('/plants') && !url.includes('/user-actions')) {
      this.logger.log(
        `🌱 PLANT CREATED - Name: ${data.name} - Species: ${data.species} - User: ${userId}`,
      );
    }

    // Plant deleted
    if (method === 'DELETE' && url.includes('/plants')) {
      this.logger.log(
        `🗑️ PLANT DELETED - Plant ID: ${url.split('/').pop()} - User: ${userId}`,
      );
    }

    // Sensor data received
    if (method === 'POST' && url.includes('/sensor-readings')) {
      this.logger.log(
        `📊 SENSOR DATA - Device: ${data.plantId} - Temp: ${data.temperature}°C - Moisture: ${data.moisture}%`,
      );
    }

    // Critical advice given
    if (method === 'GET' && url.includes('/advice')) {
      const criticalAdvice = data.advice?.filter((a: any) => a.type === 'critical');
      if (criticalAdvice?.length > 0) {
        this.logger.warn(
          `⚠️ CRITICAL ADVICE - Plant: ${data.plant?.name} - Health: ${data.overallHealth} - User: ${userId}`,
        );
      }
    }

    // User action recorded
    if (method === 'POST' && url.includes('/user-actions')) {
      this.logger.log(
        `📝 USER ACTION - Type: ${data.actionType} - Plant: ${data.plantId} - User: ${userId}`,
      );
    }
  }
}