# VyuKarya — Product Requirements

**Project Status:** In Development
**Version:** 0.1.0
**Project Type:** Collaborative Project Management SaaS

---

## 1. Project Overview

**VyuKarya** is a collaborative project and team management platform designed to help small teams organize their work, manage projects, assign tasks, track progress, and collaborate from a centralized workspace.

The application will provide teams with a structured environment where members can create projects, break projects into tasks, assign responsibilities, track task status and priorities, and communicate through task comments.

The project is being developed as a **real-world, production-oriented learning project**. Along with application development, the project will demonstrate modern software engineering practices including TypeScript, Git/GitHub workflows, automated testing, Docker, CI/CD, and AWS deployment.

---

## 2. Vision

The goal of VyuKarya is to provide a simple but powerful workspace where teams can answer three fundamental questions:

* What are we working on?
* Who is responsible for it?
* What is the current progress?

VyuKarya should reduce the need for scattered spreadsheets, chat messages, and manual task tracking by bringing project information into one organized system.

---

## 3. Problem Statement

Small development teams, student teams, freelancers, and organizations often manage projects using a combination of messaging applications, spreadsheets, documents, and disconnected tools.

This can lead to:

* Unclear task ownership
* Poor visibility into project progress
* Missed deadlines
* Difficulty tracking project status
* Scattered communication
* Lack of centralized team information

VyuKarya aims to solve these problems by providing a centralized project management workspace.

---

## 4. Target Users

The initial target users are:

### Team Owners

Users who create and manage workspaces.

They can:

* Create workspaces
* Manage workspace members
* Create projects
* Manage projects
* Manage team access

### Administrators

Users who help manage a workspace.

They can:

* Manage projects
* Manage tasks
* Manage members according to their permissions

### Team Members

Users who participate in projects.

They can:

* View assigned projects
* Create and update tasks according to permissions
* Update task status
* Add comments
* Track their work

---

## 5. Core Goals

The MVP should allow users to:

1. Create an account and securely authenticate.
2. Create and manage a workspace.
3. Invite/add members to a workspace.
4. Assign appropriate workspace roles.
5. Create and manage projects.
6. Create and manage project tasks.
7. Assign tasks to team members.
8. Track task status and priority.
9. Set task due dates.
10. Comment on tasks.
11. View important project and task information through a dashboard.

---

## 6. MVP Features

### 6.1 Authentication

The system will provide:

* User registration
* User login
* User logout
* Current authenticated user
* Protected routes
* Role-based authorization

Future authentication features may include:

* Email verification
* Forgot password
* Password reset
* OAuth/social login

---

### 6.2 Workspace Management

Users will be able to:

* Create a workspace
* View workspace information
* Update workspace information
* Manage workspace members
* Assign workspace roles

Initial workspace roles:

```text
Owner
Admin
Member
```

---

### 6.3 Project Management

Workspace members with appropriate permissions will be able to:

* Create projects
* View projects
* Update projects
* Delete projects
* Set project descriptions
* Set project status
* Set project priority
* Set project dates
* Manage project members

---

### 6.4 Task Management

Users with appropriate permissions will be able to:

* Create tasks
* View tasks
* Update tasks
* Delete tasks
* Assign tasks
* Set priorities
* Set due dates
* Update task status
* Filter tasks
* Search tasks

Initial task statuses:

```text
TODO
IN_PROGRESS
IN_REVIEW
DONE
```

Initial priorities:

```text
LOW
MEDIUM
HIGH
URGENT
```

---

### 6.5 Collaboration

The MVP will include task-based collaboration through:

* Task comments
* Comment creation
* Comment viewing
* Comment management according to permissions

Real-time collaboration and notifications are intentionally postponed until the core system is stable.

---

### 6.6 Dashboard

The dashboard will provide an overview of important information such as:

* Total projects
* Total tasks
* Completed tasks
* Pending tasks
* Overdue tasks
* Recent activity

Charts and advanced productivity analytics may be introduced later.

---

## 7. High-Level User Flow

A typical user journey will look like:

```text
Register
   ↓
Login
   ↓
Create / Join Workspace
   ↓
Workspace Dashboard
   ↓
Create Project
   ↓
Add / Manage Members
   ↓
Create Tasks
   ↓
Assign Tasks
   ↓
Update Task Status
   ↓
Comment / Collaborate
   ↓
Track Project Progress
```

---

## 8. High-Level Application Architecture

The initial architecture will follow:

```text
React + TypeScript
        ↓
Redux Toolkit
        ↓
REST API
        ↓
Node.js + Express + TypeScript
        ↓
Authentication / Authorization
        ↓
Validation + Business Logic
        ↓
MongoDB + Mongoose
```

Infrastructure will later include:

```text
Docker
   ↓
GitHub Actions
   ↓
AWS
```

The exact production AWS architecture will be decided after the application requirements are better understood.

---

## 9. Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Redux Toolkit
* Axios

Potentially:

* React Hook Form
* Zod
* RTK Query

These will be introduced only when they solve an actual problem.

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT/authentication mechanism
* bcrypt
* Zod

### Development & Engineering

* Git
* GitHub
* ESLint
* Prettier
* GitHub Issues
* GitHub Projects
* Pull Requests
* Code Reviews
* GitHub Actions

### DevOps & Cloud

* Docker
* Docker Compose
* AWS
* Container registry
* CI/CD

Specific AWS services will be selected as deployment requirements become clear.

---

## 10. Initial Data Entities

The initial domain is expected to contain:

```text
User
Workspace
WorkspaceMember
Project
Task
Comment
```

The exact database schema is **not locked yet**.

Schemas will be designed from actual application requirements rather than creating unnecessary models at the beginning.

Additional entities such as notifications or dedicated project membership may be introduced when their requirements become clear.

---

## 11. Non-Goals for the MVP

The following will not be part of the initial MVP:

* Real-time chat
* Video conferencing
* Payment processing
* AI project management
* Advanced analytics
* Complex notification infrastructure
* Mobile application
* Microservices architecture
* Kubernetes
* Multi-region deployment

These may be considered after the core product is stable.

---

## 12. Future Scope

Potential future features include:

* Email notifications
* In-app notifications
* Real-time updates
* Advanced dashboards
* Productivity analytics
* File attachments
* Activity timeline
* Calendar integration
* Kanban boards
* OAuth authentication
* AI-assisted task/project management
* Mobile application
* Advanced AWS infrastructure

Future features will be evaluated based on actual product requirements rather than added simply to increase the technology stack.

---

## 13. Engineering & Learning Objectives

VyuKarya is also a structured learning project.

The development process will be used to learn:

### TypeScript

* Types
* Interfaces
* Generics
* Unions
* Type narrowing
* API types
* React types
* Backend types
* Type-safe architecture

### React

* Component architecture
* Routing
* Forms
* API integration
* State management

### Redux Toolkit

* Global client state
* Slices
* Async operations
* State organization
* Server-state considerations

### Backend

* Express architecture
* REST APIs
* Authentication
* Authorization
* Validation
* Error handling
* Service-layer design

### Database

* MongoDB
* Mongoose
* Relationships
* Indexing
* Query design

### DevOps

* Docker
* Containers
* Docker Compose
* GitHub Actions
* CI/CD

### AWS

AWS will be learned through actual deployment requirements rather than attempting to learn the entire AWS ecosystem at once.

---

## 14. GitHub Engineering Workflow

Development will follow:

```text
Issue
  ↓
Feature Branch
  ↓
Implementation
  ↓
Commit
  ↓
Push
  ↓
Pull Request
  ↓
CI
  ↓
Code Review
  ↓
Changes if required
  ↓
Approval
  ↓
Merge
  ↓
Documentation
  ↓
Release
```

Example branch names:

```text
feature/authentication
feature/workspace
feature/projects
feature/tasks

fix/login-validation

chore/docker
chore/github-actions
chore/documentation
```

---

## 15. Documentation Strategy

Documentation will be created alongside development rather than after the project is finished.

Documentation will cover:

* Requirements
* Architecture
* Database design
* API design
* Development setup
* Git workflow
* Deployment
* Architectural decisions
* Testing
* Infrastructure

Important technical decisions will be recorded using Architecture Decision Records (ADRs).

---

## 16. Success Criteria

The project will be considered successful when:

* Users can securely authenticate.
* Users can create/manage workspaces.
* Workspace members can collaborate according to their roles.
* Projects can be created and managed.
* Tasks can be created, assigned, tracked, and completed.
* Users can collaborate through task comments.
* The dashboard provides useful project information.
* The application has automated testing.
* The project uses Docker appropriately.
* CI/CD is implemented.
* The application is deployed to AWS.
* The repository demonstrates professional Git/GitHub practices.
* Architecture and important technical decisions are documented.

---

## 17. Project Philosophy

VyuKarya will follow a **build-to-learn** approach.

We will not introduce a technology simply because it is popular.

Instead:

> **Requirement → Problem → Technology → Implementation → Evaluation**

Every major technology should answer a real engineering problem.

The project will also document mistakes, trade-offs, architectural decisions, and lessons learned instead of presenting only the final polished result.

---

## 18. Current Status

**Phase:** Project Foundation

Current work:

* [x] Project concept defined
* [x] MVP direction defined
* [x] Initial technology direction defined
* [x] GitHub workflow defined
* [x] Documentation strategy defined
* [ ] Repository foundation
* [ ] TypeScript setup
* [ ] Frontend setup
* [ ] Backend setup
* [ ] Authentication
* [ ] Workspace management
* [ ] Project management
* [ ] Task management
* [ ] Collaboration
* [ ] Dashboard
* [ ] Testing
* [ ] Docker
* [ ] CI/CD
* [ ] AWS deployment
* [ ] v1.0 production release
