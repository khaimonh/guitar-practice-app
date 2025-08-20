## TODO
Models (data structures):

Models/User.cs - user accounts
Models/PracticeFile.cs - practice content metadata
Models/PracticeSession.cs - session tracking data
Controllers (API endpoints):

Controllers/AuthController.cs - login/register/verify
Controllers/PracticeFilesController.cs - get practice content
Controllers/SessionsController.cs - save/retrieve sessions
Services (business logic):

Services/AuthService.cs - JWT tokens, password hashing
Services/PracticeFileService.cs - file management
Services/SessionService.cs - session data handling
Data (database):

Data/AppDbContext.cs - Entity Framework context
Data/Migrations/ - database schema
Configuration:

Update Program.cs - add services, middleware, CORS
Update .csproj - add Entity Framework, JWT packages