# LeaveFlow frontend (updated existing project)

React 18 + Vite frontend. The existing pages and styling are retained. API service paths now match the Spring Boot backend; employee leave pages query requests by the logged-in user's ID; leave-type options are loaded from the database-backed API; and dashboard accents vary by role (blue employee, green manager, purple admin).

## Run
1. Open a terminal in this folder.
2. Run `npm install`.
3. Copy `.env.example` to `.env` (the default API URL is already suitable for local development).
4. Run `npm run dev`.
5. Open `http://localhost:5173`.

Make sure the backend is running on `http://localhost:8080` and MySQL credentials in the backend's `application.properties` are correct.

## Roles
Public signup creates employee accounts. To initialize the app, register your own account, use the SQL instruction in the backend README to promote it to ADMIN, then sign in again. From the admin Employee Management page you can add manager/admin accounts. The login page redirects users to the dashboard for their stored role.

## Troubleshooting
- If API requests fail, check `http://localhost:8080/api/health` and the browser DevTools Network tab.
- If your MySQL password is not `root`, update `DB_PASSWORD` or `application.properties` in the backend.
- If you change `.env`, restart the Vite dev server.


## Security behavior
- Registration creates Employee accounts only. Admin/Manager roles are assigned by an administrator.
- JWT is stored in `sessionStorage` and sent as a Bearer token; it is cleared when the browser session ends.
- Frontend route guards are for user experience only. The backend enforces actual permissions.
