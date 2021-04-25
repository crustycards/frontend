import {Injectable} from '@nestjs/common';
import {
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TerminusEndpoint,
  TerminusModuleOptions,
  TerminusOptionsFactory
} from '@nestjs/terminus';

@Injectable()
export class TerminusOptionsService implements TerminusOptionsFactory {
  private static bytesInGigabyte = 1024 * 1024 * 1024;

  constructor(
    private readonly http: HttpHealthIndicator,
    private readonly memory: MemoryHealthIndicator
  ) {}

  public createTerminusOptions(): TerminusModuleOptions {
    const healthEndpoint: TerminusEndpoint = {
      url: '/api/health',
      healthIndicators: [
        async () => this.http.pingCheck('google', 'https://google.com'),
        async () => this.memory.checkHeap(
          'memoryHeap',
          1 * TerminusOptionsService.bytesInGigabyte
        )
      ]
    };
    return {
      endpoints: [healthEndpoint]
    };
  }
}
