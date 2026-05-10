import { DocumentBuilder } from '@nestjs/swagger';

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('MyBookshelf API')
    .setDescription('API для управления книгами и отзывами')
    .setVersion('1.0.0')
    .addTag('books')
    .addTag('reviews')
    .addTag('users')
    .addBearerAuth()
    .build();
}
