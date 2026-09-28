# LeagueTrack

LeagueTrack is a Spring Boot based tournament management system designed to simplify team registration, round-robin fixture generation, match result management, and automatic tournament standings.

The application provides REST APIs for managing the complete tournament workflow and includes Swagger/OpenAPI documentation for easy API testing and exploration.

---

## 1. Project Overview

LeagueTrack manages a tournament through the following workflow:

**Register Teams → Generate Fixtures → Record Match Results → Calculate Standings**

The system reduces manual tournament-management work by automatically generating fixtures and updating team standings based on recorded match results.

---

## 2. Key Features

* Register tournament teams
* View all registered teams
* Update team information
* Delete teams with fixture-protection rules
* Generate round-robin tournament fixtures
* Prevent duplicate fixture generation
* View fixtures grouped by round
* Record match results
* Prevent duplicate result recording
* View individual match details
* View all tournament matches
* Automatically calculate tournament standings
* Validate incoming request data
* Handle application errors through centralized exception handling
* Use DTOs for clean API responses
* Use transaction management for database operations
* Use optimistic locking for match updates
* Provide Swagger/OpenAPI documentation
* Include automated tests for important service and controller functionality

---

## 3. Technology Stack

### Backend

* Java 21
* Spring Boot 4.1.1
* Spring Web
* Spring Data JPA
* Hibernate
* Spring Validation
* Maven

### Database

* MySQL 8.0

### API Documentation

* SpringDoc OpenAPI
* Swagger UI

### Testing

* JUnit
* Mockito
* Spring Boot Test

---

## 4. Project Architecture

LeagueTrack follows a layered Spring Boot architecture:

```text
Client / Frontend
        ↓
REST Controllers
        ↓
Service Layer
        ↓
Repository Layer
        ↓
MySQL Database
```

### Main packages

```text
Project.LeagueTrack
├── controller
├── service
├── repository
├── entity
├── dto
├── exception
└── config
```

### Layer responsibilities

**Controller Layer**

Handles HTTP requests and responses and exposes the REST API.

**Service Layer**

Contains the main tournament business logic such as fixture generation, result recording, and standings calculation.

**Repository Layer**

Provides database access through Spring Data JPA.

**Entity Layer**

Represents the database tables and relationships.

**DTO Layer**

Provides clean request and response structures for the REST API.

**Exception Layer**

Provides custom exceptions and centralized error handling.

**Config Layer**

Contains application configuration such as OpenAPI metadata.

---

## 5. Database

LeagueTrack uses a MySQL database named:

```text
leaguetrack
```

Create the database using:

```sql
CREATE DATABASE leaguetrack;
```

The application is configured to connect to:

```text
jdbc:mysql://localhost:3306/leaguetrack
```

Make sure MySQL Server is running before starting the application.

> Database username and password should be configured locally in `application.properties` and should not be committed to a public repository.

---

## 6. Running the Project

### Prerequisites

Install:

* Java 21
* Maven
* MySQL Server 8.0

### Step 1 — Clone the repository

```bash
git clone <your-github-repository-url>
```

### Step 2 — Open the project

Open the project in IntelliJ IDEA or another Java IDE.

### Step 3 — Configure MySQL

Create the database:

```sql
CREATE DATABASE leaguetrack;
```

Configure your MySQL username and password in:

```text
src/main/resources/application.properties
```

### Step 4 — Build and test

Run:

```bash
mvn clean package
```

A successful build should end with:

```text
BUILD SUCCESS
```

### Step 5 — Run the application

Using Maven:

```bash
mvn spring-boot:run
```

or using the packaged JAR:

```bash
java -jar target/LeagueTrack-0.0.1-SNAPSHOT.jar
```

The application runs on:

```text
http://localhost:8080
```

---

## 7. Swagger API Documentation

Swagger UI is available at:

```text
http://localhost:8080/swagger-ui.html
```

OpenAPI JSON is available at:

```text
http://localhost:8080/v3/api-docs
```

Swagger provides an interactive interface for viewing and testing the LeagueTrack REST APIs.

---

## 8. REST API Endpoints

### Teams

| Method | Endpoint              | Description     |
| ------ | --------------------- | --------------- |
| POST   | `/api/teams`          | Register a team |
| GET    | `/api/teams`          | Get all teams   |
| PUT    | `/api/teams/{teamId}` | Update a team   |
| DELETE | `/api/teams/{teamId}` | Delete a team   |

### Fixtures

| Method | Endpoint                 | Description                       |
| ------ | ------------------------ | --------------------------------- |
| POST   | `/api/fixtures/generate` | Generate the round-robin fixture  |
| GET    | `/api/fixtures`          | Get all fixtures grouped by round |

### Matches

| Method | Endpoint                        | Description           |
| ------ | ------------------------------- | --------------------- |
| GET    | `/api/matches`                  | Get all matches       |
| GET    | `/api/matches/{matchId}`        | Get a specific match  |
| PUT    | `/api/matches/{matchId}/result` | Record a match result |

### Standings

| Method | Endpoint         | Description                      |
| ------ | ---------------- | -------------------------------- |
| GET    | `/api/standings` | Get current tournament standings |

---

## 9. Example API Requests

### Register a Team

**POST**

```text
/api/teams
```

Request body:

```json
{
  "name": "CSE Titans"
}
```

### Record a Match Result

**PUT**

```text
/api/matches/{matchId}/result
```

Example:

```json
{
  "homeScore": 3,
  "awayScore": 1
}
```

The result is recorded only once for a match.

---

## 10. Business Rules

LeagueTrack includes several rules to maintain tournament consistency.

### Fixture Generation

A round-robin fixture is generated for the registered teams.

Fixture generation is restricted so that the same tournament fixture cannot be generated repeatedly.

### Match Results

A match result can be recorded only once.

Attempting to record another result for the same match returns a conflict response.

### Team Deletion

A team that has already been included in a tournament fixture cannot be deleted.

This prevents existing matches and standings from becoming invalid.

### Standings

Standings are automatically updated when a match result is recorded.

The current points configuration is:

```text
Win  = 3 points
Draw = 1 point
Loss = 0 points
```

---

## 11. Validation and Error Handling

The application validates incoming requests and provides centralized exception handling.

Examples include:

* Invalid team requests
* Invalid match scores
* Team not found
* Match not found
* Duplicate fixture generation
* Duplicate match result
* Team deletion when already used in fixtures
* Concurrent match update conflicts

Appropriate HTTP status codes are returned for these situations.

---

## 12. DTO-Based API Responses

LeagueTrack uses Data Transfer Objects for API responses instead of directly exposing all internal relationships.

Examples include:

* `StandingsResponse`
* `MatchResponse`
* `FixtureResponse`

This keeps API responses structured and easier for frontend applications to consume.

---

## 13. Testing

The project includes automated tests using JUnit and Mockito.

Current test coverage includes:

* Standings calculation for a win
* Standings calculation for a draw
* Standings calculation for a loss
* Team controller GET request

The project has been verified with:

```text
Tests run: 5
Failures: 0
Errors: 0
Skipped: 0
```

The Maven package build was also successfully verified.

---

## 14. Current Tournament Example

The current development database contains four teams:

```text
CSE Titans
ECE Warriors
MECH United
CIVIL Kings
```

The tournament contains:

```text
3 rounds
6 matches
```

Current standings in the development data are:

| Team         | Played | Won | Drawn | Lost | Points |
| ------------ | -----: | --: | ----: | ---: | -----: |
| MECH United  |      3 |   2 |     1 |    0 |      7 |
| CSE Titans   |      3 |   2 |     0 |    1 |      6 |
| ECE Warriors |      3 |   0 |     2 |    1 |      2 |
| CIVIL Kings  |      3 |   0 |     1 |    2 |      1 |

These values represent the current local development database and are not required for a fresh installation.

---

## 15. Project Status

### Backend

* REST API development — Complete
* MySQL integration — Complete
* Tournament fixture generation — Complete
* Match result management — Complete
* Automatic standings — Complete
* Validation — Complete
* Exception handling — Complete
* DTO responses — Complete
* Swagger/OpenAPI documentation — Complete
* Automated tests — Complete for the implemented test cases
* Maven package verification — Complete

### Next Phase

The next development phase is the **LeagueTrack frontend**, which will consume the existing REST APIs and provide a user-friendly tournament management interface.

---

## 16. Author

**LeagueTrack**

A student project developed using Java, Spring Boot, MySQL, and REST API technologies.
