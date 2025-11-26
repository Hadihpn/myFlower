import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  private readonly logger = new Logger(CustomThrottlerGuard.name);

  protected async throwThrottlingException(
    context: ExecutionContext,
  ): Promise<void> {
    const request = context.switchToHttp().getRequest();
    this.logger.warn(
      `⚠️ Rate limit exceeded - IP: ${request.ip} - Path: ${request.url}`,
    );
    
    throw new ThrottlerException('Too many requests, please try again later.');
  }
}