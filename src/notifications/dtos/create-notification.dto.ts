//no validation because it is an inner dto
export class CreateNotificationDto {
  userId: string;
  eventId: string;
  type: 'Reminder' | 'Update';
  message: string;
  sentAt: Date;
}
