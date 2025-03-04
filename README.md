## Getting Started

1. **Set up environment variables** in the `.env` file:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=YOUR_JWT_SECRET
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

4. Use the following demo credentials to log in:

```
Email: demo@prospectory.ai
Password: password
```

## Technical Decisions

### Framework and Libraries

- Next.js: For server-side rendering and API routes.
- TailwindCSS: For utility-first styling.
- HeadlessUI: For accessible and customizable UI components.
- TanStack Query: For data fetching and caching.
- Prisma: For database management and ORM.
- next-intl: For internationalization (i18n) support.
- React Hook Form: For form management and validation.
- React Dropzone: For handling file uploads.
- Jest: For testing.

### API documentation

The Postman API collection is available at `/postman_collection.json`.

### Server Actions vs Route Handlers

Most of the backend logic can be implemented using either server actions or route handlers. However, there is an exception for endpoints that handle creating or updating movies, as they require an image of type `File`, which cannot be serialized. As a result, server actions cannot be used for these endpoints.

In this project:

- Route handlers are primarily used for backend logic.
- Server actions are used only on the individual movie edit page to fetch movie details on the server side before rendering the page. This ensures the page is SEO-optimized in case it becomes publicly accessible in the future.

### Use of TanStack Query

For calling backend APIs on the frontend, I utilized `@tanstack/react-query`.

I leveraged its caching feature to avoid repeatedly calling the API endpoint to retrieve movie data unless there is a change. When a new movie is added or an existing movie is updated, the cache is automatically revalidated to ensure the data remains up-to-date.

### Database and File Storage

- Development: SQLite is used for the database, and local disk storage is used for saving movie poster images.

- Production: More robust solutions like `AWS RDS` (for the database) and `AWS S3` (for file storage) can be implemented.

### Session Management and Authentication

- Authentication: JWT tokens are used for authentication, and the auth token is stored in cookies.

- Remember Me:

  - If selected, the JWT token and cookie expire after 1 week.
  - If not selected, the JWT token expires after 1 day, and the cookie is set as a session cookie (no expiry), making it available only for the current session.

- Security:
  - Next.js middleware is used to protect against unauthorized access.
  - Each API endpoint validates the session by checking the cookie.
