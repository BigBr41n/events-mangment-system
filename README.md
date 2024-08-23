<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test
```

### Event Management System

#### **Core Features**

1. **User Authentication and Roles**

   - **Registration/Login/refresh**: Allow users to register, log in, and refresh token.
   - **User Roles**: Implement different user roles, such as Admin, Organizer, and Attendee, with different permissions.

2. **Event Creation and Management**

   - **Create Events**: Users can create events with details like title, description, date, time, location, and capacity.
   - **Edit/Delete Events**: Organizers can update or remove their events.

3. **Event Scheduling and RSVP**

   - **Event Scheduling**: Allow users to view, filter, and search for upcoming events.
   - **RSVP Functionality**: Attendees can RSVP to events, and organizers can manage guest lists.

4. **Feedback and Ratings**

   - **Event Feedback**: Allow attendees to leave feedback or ratings for events they attended.

5. **Admin Dashboard**

   - **Event Management**: Admins can view, manage, and approve events.
   - **User Management**: Admins can manage user accounts and roles.

#### **Technical Considerations**

1. **Database Design**

   - **User Table**: For storing user information.
   - **Event Table**: For storing event details.
   - **RSVP Table**: For storing RSVPs and attendance data.
   - **Feedback Table**: For storing event feedback and ratings.
   - **Notification Table**: For storing Notifications
