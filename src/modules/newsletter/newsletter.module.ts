import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suscriptor } from './suscriptor.entity';
import { NewsletterController } from './newsletter.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Suscriptor])],
  controllers: [NewsletterController],
})
export class NewsletterModule {}
