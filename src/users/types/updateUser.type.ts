export type UpdateUserData = {
  readonly username?: string;
  readonly email?: string;
  readonly passwordHash?: string;
  readonly role?: 'Admin' | 'Organizer' | 'Attendee';
};
