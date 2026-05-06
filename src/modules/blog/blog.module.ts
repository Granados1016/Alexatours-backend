import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articulo } from './entities/articulo.entity';
import { BlogService } from './blog.service';
import { BlogPublicController, BlogAdminController } from './blog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Articulo])],
  controllers: [BlogPublicController, BlogAdminController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
