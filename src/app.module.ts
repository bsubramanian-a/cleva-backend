import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZohoCRMService } from './service/zoho.service';
import { DatabaseModule } from './core/database/database.module';
import { OauthtokensModule } from './modules/oauthtokens/oauthtokens.module';
import { OauthtokensService } from './modules/oauthtokens/oauthtokens.service';
import { oauthtokensProviders } from './modules/oauthtokens/oauthtokens.provider';
import { UsersModule } from './modules/users/users.module';
import { UsersService } from './modules/users/users.service';
import { usersProviders } from './modules/users/users.providers';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [DatabaseModule, OauthtokensModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    OauthtokensService,
    UsersService,
    ZohoCRMService,
    ...oauthtokensProviders,
    ...usersProviders
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('profile');
  }
}
