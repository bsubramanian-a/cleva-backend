import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZohoCRMService } from './service/zoho.service';
import { DatabaseModule } from './core/database/database.module';
import { OauthtokensModule } from './modules/oauthtokens/oauthtokens.module';
import { OauthtokensService } from './modules/oauthtokens/oauthtokens.service';
import { oauthtokensProviders } from './modules/oauthtokens/oauthtokens.provider';
import { UsersModule } from './modules/users/users.module';
import { GoalsModule } from './modules/goals/goals.module';
import { UsersService } from './modules/users/users.service';
import { usersProviders } from './modules/users/users.providers';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { goalsProviders } from './modules/goals/goals.providers';
import { GoalsService } from './modules/goals/goals.service';
import { ZoomService } from './service/zoom.service';

@Module({
  imports: [DatabaseModule, OauthtokensModule, UsersModule, GoalsModule],
  controllers: [AppController],
  providers: [
    AppService,
    OauthtokensService,
    UsersService,
    ZohoCRMService,
    GoalsService,
    ZoomService,
    ...oauthtokensProviders,
    ...usersProviders,
    ...goalsProviders
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('profile', 'journals', 'exercises', 'summary', 'advice', 'assets', 'liabilities', 'asset', 'liability', 'income', 'expenses', 'goals', 'accounts', 'create-meeting', 'meetings','supersorted','notes','rollingaccountbalance');
  }
}
