import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { PackagesModule } from './packages/packages.module';
import { CustomersModule } from './customers/customers.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    DatabaseModule,
    PackagesModule,
    CustomersModule,
    BookingsModule,
  ],
})
export class AppModule {}
