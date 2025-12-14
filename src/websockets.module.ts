
import { Module } from '@nestjs/common';
import { GeneralWebsocketGateway } from './websocket.gateway';

@Module({
  providers: [GeneralWebsocketGateway],
  exports: [GeneralWebsocketGateway],
})
export class WebsocketsModule {}