# SupportDesk

## Objective

SupportDesk is a Customer Support Ticket System where customers can raise support requests, support agents can manage and resolve tickets, and administrators can manage users, ticket assignments, and overall system operations.

## User Roles

### Customer

- Register and log in
- Create support tickets
- View their own tickets
- Reply to their tickets
- Track ticket status
- Close or reopen eligible tickets

### Agent

- View assigned tickets
- View unassigned tickets
- Assign tickets to themselves
- Reply to customers
- Update ticket priority
- Change ticket status
- Resolve tickets

### Admin

- View all tickets
- Assign tickets to agents
- Manage users and roles
- Change ticket status and priority
- View system-level dashboard metrics

## Ticket Statuses

- OPEN
- IN_PROGRESS
- WAITING_FOR_CUSTOMER
- RESOLVED
- CLOSED

## Ticket Priorities

- LOW
- MEDIUM
- HIGH
- URGENT

## Ticket Categories

- TECHNICAL
- BILLING
- ACCOUNT
- FEATURE_REQUEST
- GENERAL

## Core Features

- User registration and login
- JWT authentication
- Role-based authorization
- Create and manage tickets
- Ticket assignment
- Status and priority updates
- Ticket conversation or replies
- Search, filtering, sorting, and pagination
- Customer and agent dashboards

## Authorization Rules

- Customers can only view and update their own tickets
- Agents can view support tickets and manage assigned tickets
- Admins can view and manage all tickets
- Only admins can manage user roles
- Public registration always creates a CUSTOMER account
- Users cannot assign themselves an ADMIN role
- Authorization must be enforced on the backend

## MVP Exclusions

- File attachments
- Email notifications
- Real-time chat
- SLA tracking
- Customer satisfaction ratings
- Multi-tenant organizations
- Knowledge base

## Success Criteria

- Customer can create and track tickets
- Agent can manage and resolve tickets
- Admin can assign tickets and manage users
- Unauthorized users cannot access restricted data
- Ticket listing supports filters and pagination

## Assumptions

- One ticket belongs to one customer
- One ticket can be assigned to only one agent at a time
- Public registration creates only CUSTOMER users
- Only backend authorization will be considered final

## Future Enhancements

- File attachments
- Email notifications
- Real-time updates
- SLA tracking
- Customer feedback and ratings