<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# MyBookshelf - Book Catalog & Reviews API

A comprehensive book catalog management system built with [NestJS](https://github.com/nestjs/nest).

## Description

MyBookshelf is a progressive [Node.js](http://nodejs.org) framework for building efficient and scalable server-side applications. It provides RESTful API endpoints for managing books, user reviews, and ratings with role-based access control.

## Features

- 📚 Complete book catalog management
- ⭐ Book review system with ratings
- 👥 User management and role-based access (USER, ADMIN, SUPER_ADMIN)
- 🔐 JWT-based authentication with refresh tokens
- 📄 Automatic Swagger API documentation
- 🐳 Docker support for easy deployment
- 🗄️ PostgreSQL database with Prisma ORM
- 🔍 Advanced filtering and search capabilities

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug

# production mode
$ npm run start:prod
```

## Database

```bash
# Run migrations
$ npm run migrate:deploy

# Generate Prisma client
$ npx prisma generate
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

Run the application with Docker Compose for local development:

```bash
$ docker-compose up -d
```

This starts:

- PostgreSQL database on port 5432
- NestJS API on port 3000

## API Documentation

Swagger documentation is available at `http://localhost:3000/api` when the server is running.

## API Endpoints

### Books

- `GET /books` - Get all books with filtering and pagination
- `GET /books/:id` - Get book by ID
- `GET /books/:id/reviews` - Get book with all reviews
- `POST /books` - Create book (ADMIN only)
- `PATCH /books/:id` - Update book (ADMIN only)
- `DELETE /books/:id` - Delete book (ADMIN only)

### Reviews

- `POST /reviews` - Create review
- `GET /reviews` - Get all reviews
- `GET /reviews/book/:bookId` - Get reviews by book ID
- `PATCH /reviews/:id` - Update review (own reviews only)
- `DELETE /reviews/:id` - Delete review (own reviews or ADMIN)

### Auth

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user info

## Resources

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).

## License

This project is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
