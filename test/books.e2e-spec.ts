import request from 'supertest';
import {
  app,
  prisma,
  setupApp,
  cleanDatabase,
  loginAs,
  registerUser,
} from './setup';
import { Role } from 'src/auth/enums/role.enum';
import { Genre } from 'src/generated/prisma/enums';

// Этот файл содержит E2E тесты для книг. Мы проверяем получение списка книг, получение книги по ID, создание книги, и удаление книги. В каждом тесте мы используем реальную базу данных (очищаем её перед каждым тестом) и реальное Nest-приложение, чтобы максимально точно имитировать поведение в продакшене.
describe('Books E2E', () => {
  let userToken: string;
  let adminToken: string;
  let bookId: string;
  // В этих тестах мы проверяем, что список книг возвращается корректно, что фильтрация работает, и что авторизация требуется
  beforeAll(async () => {
    await setupApp();
  });

  beforeEach(async () => {
    await cleanDatabase();

    // Создадим обычного пользователя и админа, а также одну книгу для тестов
    await registerUser('user@test.com', 'pass123', 'Regular User');
    userToken = await loginAs('user@test.com', 'pass123');

    // Создаём админа и книгу от его имени, чтобы гарантировать наличие книги в базе для тестов
    await registerUser('admin@test.com', 'pass123', 'Admin User');
    await prisma.user.update({
      where: { email: 'admin@test.com' },
      data: { role: Role.ADMIN },
    });
    adminToken = await loginAs('admin@test.com', 'pass123');

    // Создаём книгу от имени админа, чтобы гарантировать её наличие в базе для тестов
    const book = await prisma.book.create({
      data: {
        title: 'Test Book',
        description: 'Test Desc',
        author: 'Test Author',
        year: 2020,
        genre: Genre.ACTION,
      },
    });
    bookId = book.id;
  });

  afterAll(async () => {
    await cleanDatabase();
    // НЕ закрываем — users.e2e-spec.ts закрывает последним
  });

  // В этих тестах мы проверяем, что список книг возвращается корректно, что фильтрация работает, и что авторизация требуется
  describe('GET /books', () => {
    // В этих тестах мы проверяем, что список книг возвращается корректно, что фильтрация работает, и что авторизация требуется
    it('должен вернуть список книг для авторизованного пользователя', async () => {
      const res = await request(app.getHttpServer())
        .get('/books')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true); // ← .data
      expect(res.body.data.length).toBeGreaterThanOrEqual(1); // ← .data
      expect(res.body.meta).toBeDefined();
    });

    it('должен вернуть 401 без токена', async () => {
      const res = await request(app.getHttpServer()).get('/books');
      expect(res.status).toBe(401);
    });

    it('должен фильтровать по году', async () => {
      await prisma.book.create({
        data: {
          title: 'Old Book',
          description: 'Old',
          author: 'Old Author',
          year: 1999,
          genre: Genre.DRAMA,
        },
      });

      const res = await request(app.getHttpServer())
        .get('/books?year=2020')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.every((b: any) => b.year === 2020)).toBe(true); // ← .data
    });

    it('должен искать по названию (без учёта регистра)', async () => {
      const res = await request(app.getHttpServer())
        .get('/books?title=test')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1); // ← .data
      expect(res.body.data[0].title.toLowerCase()).toContain('test'); // ← .data
    });
  });

  // В этих тестах мы проверяем, что можно получить книгу по ID, что несуществующий ID возвращает 404, что только админ может создавать книги, и что только админ может удалять книги
  describe('GET /books/:id', () => {
    it('должен вернуть книгу по ID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/books/${bookId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Test Book');
      expect(res.body.id).toBe(bookId);
    });

    it('должен вернуть 404 для несуществующего ID', async () => {
      // ← 404 вместо null
      const res = await request(app.getHttpServer())
        .get('/books/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });
  });

  // В этих тестах мы проверяем, что только админ может создавать книги, что только админ может удалять книги, и что при создании книги с невалидными данными возвращается 400
  describe('POST /books', () => {
    it('ADMIN должен создать книгу', async () => {
      const res = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'New Book',
          description: 'A great book',
          author: 'New Author',
          year: 2024,
          genre: Genre.SCI_FI,
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New Book');
      expect(res.body.id).toBeDefined();

      const inDb = await prisma.book.findUnique({
        where: { id: res.body.id },
      });
      expect(inDb).not.toBeNull();
    });

    it('обычный USER должен получить 403', async () => {
      const res = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Hack',
          description: 'x',
          author: 'Hacker',
          year: 2020,
          genre: Genre.ACTION,
        });

      expect(res.status).toBe(403);
    });

    it('без токена должен получить 401', async () => {
      const res = await request(app.getHttpServer()).post('/books').send({
        title: 'Anon',
        description: 'x',
        author: 'Anonymous',
        year: 2020,
        genre: Genre.ACTION,
      });

      expect(res.status).toBe(401);
    });

    it('ADMIN должен получить 400 при невалидных данных', async () => {
      const res = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Missing Fields' });

      expect(res.status).toBe(400);
    });
  });

  // В этих тестах мы проверяем, что только админ может удалять книги, и что при удалении книги она действительно удаляется из базы данных
  describe('DELETE /books/:id', () => {
    it('ADMIN должен удалить книгу', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/books/${bookId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      const inDb = await prisma.book.findUnique({ where: { id: bookId } });
      expect(inDb).toBeNull();
    });

    it('обычный USER должен получить 403', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/books/${bookId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });
});
