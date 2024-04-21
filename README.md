# Theme Park Management System

A full stack theme park management system built with ASP.NET Core API and React with MUI.

## Features

- Park Areas Management - Add/Edit/Delete park areas
- Ride Management - Add/Edit/Delete/Buy Tickets for rides
- Events - Add/Edit/Delete events
- Gift Shops - Add/Edit/Delete gift shops and products including purchasing products
- Restaurants - Add/Edit/Delete restaurants including menu items
- Purchase History - View purchase purchase history
- Maintenance - Schedule maintenance for rides, gift shops, and restaurants, and view maintenance history with CRUD operations
- Reporting and analytics
- User Management - Add/Edit/Delete users with many roles with defined permissions
- Profile Management - Update user profile
- Notifications
- Authentication - JWT-based authentication with login and registration

## Technologies Used

- **Backend**: ASP.NET Core API
- **Frontend**: React with Material-UI (MUI)
- **Database**: SQL Server (or any other database supported by [Dapper](https://www.learndapper.com/database-providers#:~:text=Dapper%20supports%20a%20variety%20of,like%20Entity%20Framework%20or%20NHibernate.))
- **Authentication**: JWT-based authentication
- **Hosting**: ASP.NET Core hosting (optional: separate hosting for API and frontend)

## Getting Started

### Prerequisites

- [.NET Core SDK 8.x.x](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/en/download/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or any other database supported by [Dapper](https://www.learndapper.com/database-providers#:~:text=Dapper%20supports%20a%20variety%20of,like%20Entity%20Framework%20or%20NHibernate.))

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Mixra/themepark.git
   ```
2. Navigate to the project directory:
   ```
   cd themepark-main
   ```

### Configuration

1. Update the `appsettings.json` file in the backend project with the appropriate connection string and JWT secret:
   ```json
   {
     "Logging": {
       "LogLevel": {
         "Default": "Information",
         "Microsoft.AspNetCore": "Warning"
       }
     },
     "ConnectionStrings": {
       "DefaultConnection": "YOUR_CONNECTION_STRING"
     },
     "JwtSecret": "YOUR_JWT_SECRET",
     "AllowedHosts": "*"
   }
   ```
   a base file is provided in the backend project called `appsettings.json.example` which you can rename to `appsettings.json` and update the connection string and JWT secret.
2. In the `frontend/components/db.ts` file, update the `baseURL` to point to the correct API endpoint:
   ```typescript
   const baseURL: string = "http://localhost:5194/api";
   ```
   it is currently set to the development environment, you can change it to the production environment.

### Running the Application

You have two options to run the application:

1. **Run both the backend and frontend simultaneously**:

   - Navigate to the base directory of the project:
   - Install the required dependencies:
     ```
     npm install
     ```
   - Run the development environment:
     ```
     npm run dev
     ```
     This will start both the .NET Core API server and the React development server concurrently.

2. **Run the backend and frontend separately**:
   - Navigate to the `backend` folder and run the .NET Core API:
     ```
     cd backend
     dotnet run
     ```
   - In a separate terminal, navigate to the `frontend` folder and start the React development server:
     ```
     npm install
     cd frontend
     npm run dev
     ```

If you choose to host both the API and static files in the same server, make sure to adjust the CORS settings in the `Program.cs` file of the backend project.

## API Documentation

The API documentation are generated using Swagger when ran in the dev environment. Once the application is running, you can access the API documentation at the `/swagger` endpoint.

## Deployment

The application can be deployed in various ways, depending on your infrastructure and requirements. Some options include:

1. **Hosting the API and Frontend Separately**: Deploy the .NET Core API to a hosting platform like Azure App Service or AWS Elastic Beanstalk, and the React frontend to a static hosting service like Azure Storage, AWS S3, or Netlify.
2. **Hosting Both API and Frontend in .NET Core**: Build the React frontend and copy the generated files to the `wwwroot` folder of the .NET Core API project, then deploy the entire .NET Core application to a hosting platform.
