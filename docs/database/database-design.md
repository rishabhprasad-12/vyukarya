# VyuKarya — Database & Model Documentation

## 1. Overview

VyuKarya uses **MongoDB** as its primary database and **Mongoose** as the Object Data Modeling (ODM) library.

The database layer is responsible for storing and managing:

* Users
* Workspaces
* Workspace members
* Projects
* Project members
* Tasks
* Comments

The model layer defines the structure, validation rules, relationships, and constraints for these entities.

The database is designed around the application's core requirement:

> Teams work inside workspaces, workspaces contain projects, projects contain tasks, and users collaborate through task comments.

---

## 2. Database Architecture

The high-level relationship between the main entities is:

```text
User
 │
 ├──────────────┐
 │              │
 ▼              ▼
Workspace    WorkspaceMember
 │              │
 │              └──────► User
 │
 ├──────────────► Project
 │                  │
 │                  ├──────► ProjectMember
 │                  │           │
 │                  │           └──────► User
 │                  │
 │                  └──────► Task
 │                              │
 │                              ├──────► User
 │                              │
 │                              └──────► Comment
 │                                          │
 │                                          └──────► User
 │
 └──────────────► WorkspaceMember
```

The relationships are primarily implemented using MongoDB `ObjectId` references.

---

# 3. User Model

The `User` model represents an individual VyuKarya account.

## Responsibilities

The User model stores account-related information and identity information required throughout the application.

Typical responsibilities include:

* User registration
* Login
* User identification
* Profile information
* Workspace membership
* Project membership
* Task assignment
* Comment authorship

## Core Fields

```text
User
├── name
├── email
├── password
├── avatar
├── createdAt
└── updatedAt
```

### Important Constraints

* Email should be unique.
* Email should be normalized where appropriate.
* Password should never be stored in plaintext.
* Password hashing should happen before persistence.
* Password fields should not be returned unnecessarily in API responses.

---

# 4. Workspace Model

A workspace represents a team or organization area where collaborative work takes place.

A workspace is the highest-level collaboration boundary in the MVP.

Example:

```text
Acme Development Team
```

may have:

```text
Workspace
│
├── Members
├── Projects
├── Tasks
└── Collaboration
```

## Core Fields

```text
Workspace
├── name
├── description
├── owner
├── createdAt
└── updatedAt
```

The `owner` field references a `User`.

```text
Workspace.owner
        │
        ▼
      User
```

---

# 5. WorkspaceMember Model

A workspace can contain multiple users.

Instead of storing all membership information directly inside the User document, workspace membership is represented separately.

```text
WorkspaceMember
├── workspace
├── user
├── role
├── joinedAt
└── createdAt
```

## Workspace Roles

The MVP defines three workspace roles:

```text
OWNER
ADMIN
MEMBER
```

### OWNER

The workspace owner has complete control over the workspace.

Typical permissions include:

* Update workspace
* Manage members
* Manage roles
* Manage projects
* Delete workspace

### ADMIN

Administrators can perform most workspace management operations but do not own the workspace.

### MEMBER

Members have normal collaboration permissions but cannot perform administrative operations.

---

# 6. Project Model

Projects represent individual pieces of work inside a workspace.

Example:

```text
Workspace
└── VyuKarya Development
    ├── Authentication
    ├── Dashboard
    └── Task Management
```

## Core Fields

```text
Project
├── workspace
├── name
├── description
├── status
├── priority
├── startDate
├── dueDate
├── createdBy
├── createdAt
└── updatedAt
```

A project belongs to a workspace.

```text
Project.workspace
        │
        ▼
    Workspace
```

---

# 7. ProjectMember Model

Projects may contain a subset of workspace members.

The ProjectMember model represents which users are participating in a project.

```text
ProjectMember
├── project
├── user
└── createdAt
```

Relationship:

```text
Project
   │
   ├── ProjectMember
   │       └── User
   │
   └── Tasks
```

This allows a workspace to contain many users while individual projects can have their own participants.

---

# 8. Task Model

Tasks represent actionable pieces of work within a project.

Example:

```text
Project: Authentication

Tasks:
├── Create registration API
├── Implement login
├── Add JWT authentication
└── Protect private routes
```

## Core Fields

```text
Task
├── project
├── title
├── description
├── assignedTo
├── status
├── priority
├── dueDate
├── createdBy
├── createdAt
└── updatedAt
```

---

# 9. Task Status

The MVP defines four task statuses:

```text
TODO
IN_PROGRESS
IN_REVIEW
DONE
```

The intended workflow is:

```text
TODO
  ↓
IN_PROGRESS
  ↓
IN_REVIEW
  ↓
DONE
```

The application may later allow more flexible transitions depending on product requirements.

---

# 10. Task Priority

Tasks use four priority levels:

```text
LOW
MEDIUM
HIGH
URGENT
```

Priority allows users to distinguish between normal work and work requiring immediate attention.

---

# 11. Comment Model

Comments provide basic collaboration functionality.

A comment belongs to:

* A task
* A user

Relationship:

```text
Task
 │
 └── Comments
       │
       └── User
```

## Core Fields

```text
Comment
├── task
├── user
├── content
├── createdAt
└── updatedAt
```

Comments allow team members to discuss individual tasks without requiring a separate communication system.

---

# 12. Relationship Summary

| Entity          | Relationship                      |
| --------------- | --------------------------------- |
| User            | Can belong to multiple workspaces |
| Workspace       | Has an owner and multiple members |
| WorkspaceMember | Connects User and Workspace       |
| Workspace       | Contains multiple projects        |
| Project         | Belongs to one workspace          |
| ProjectMember   | Connects User and Project         |
| Project         | Contains multiple tasks           |
| Task            | Belongs to one project            |
| Task            | Can be assigned to a user         |
| Comment         | Belongs to one task               |
| Comment         | Written by one user               |

---

# 13. Data Ownership

The application uses hierarchical ownership:

```text
Workspace
    │
    └── Project
           │
           └── Task
                  │
                  └── Comment
```

This hierarchy is important for authorization.

For example:

```text
User
 ↓
Workspace Membership
 ↓
Project Membership
 ↓
Task Access
 ↓
Comment Access
```

Authorization should therefore verify not only that a user is authenticated, but also that the user has access to the relevant workspace/project/task.

---

# 14. Validation Strategy

Model-level validation should protect database integrity.

Validation should cover:

* Required fields
* String length
* Valid enum values
* Valid ObjectId references
* Unique constraints where appropriate
* Date relationships
* Email format
* Password requirements where applicable

However, Mongoose validation should **not** be the only validation layer.

The application should eventually use:

```text
Request
   ↓
Request Validation
   ↓
Controller
   ↓
Service
   ↓
Mongoose Model
   ↓
MongoDB
```

This provides validation at both the API and database layers.

---

# 15. Indexing Strategy

Indexes should be added based on actual query patterns.

Likely candidates include:

```text
User.email
WorkspaceMember.workspace + user
Project.workspace
ProjectMember.project + user
Task.project
Task.assignedTo
Comment.task
```

Compound indexes should be considered where queries commonly filter by multiple fields.

Indexes should not be added blindly because unnecessary indexes increase storage requirements and write overhead.

---

# 16. Duplicate Membership Prevention

Membership models should prevent duplicate relationships.

For example, a user should not be added twice to the same workspace.

Conceptually:

```text
workspace + user = unique
```

Similarly:

```text
project + user = unique
```

This should be enforced at the database level using appropriate unique indexes.

---

# 17. Timestamps

Models that require auditing should use:

```text
createdAt
updatedAt
```

Mongoose timestamps can automatically maintain these fields.

This allows the application to determine:

* When a record was created
* When it was last modified
* Recently created projects/tasks
* Recently updated collaboration data

---

# 18. Population

MongoDB stores references using `ObjectId`.

For example:

```text
Task.assignedTo
        │
        ▼
      User
```

When API responses require related information, Mongoose `populate()` can be used.

Example conceptual response:

```json
{
  "title": "Implement login",
  "assignedTo": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Population should be used deliberately rather than populating every possible relationship on every query.

---

# 19. Model Layer Responsibility

Models should primarily be responsible for:

* Database structure
* Schema definitions
* Model-level validation
* Database indexes
* Relationships/references
* Schema-level behavior

Models should not contain large amounts of business logic.

Business logic should eventually live in the service layer.

Recommended architecture:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MongoDB
```

---


