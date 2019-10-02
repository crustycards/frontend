import {Injectable} from '@nestjs/common';
import * as AMQP from 'amqplib';
import {EnvironmentService} from './environment/environment.service';

interface AMQPGameMessage {
  type: string;
  payload: any;
}

@Injectable()
export class RabbitMQService {
  private gameMessageCallbacks: Array<(message: AMQPGameMessage) => void> = [];

  constructor(private readonly envService: EnvironmentService) {
    this.init(); // No need to use 'await' because RabbitMQ requires message acknowledgement
  }

  public onGameMessage(callback: (message: AMQPGameMessage) => void) {
    this.gameMessageCallbacks.push(callback);
  }

  private async init() {
    const messageQueue = await AMQP.connect(this.envService.getArgs().rabbitMQURI);
    const channel = await messageQueue.createChannel();
    await channel.consume('GAME', (message) => {
      const data: AMQPGameMessage = JSON.parse(message.content.toString());
      this.gameMessageCallbacks.forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          // Callback is registered from outside code, so there's nothing we need to handle here
        }
      });
      channel.ack(message);
    });
  }
}
