import { AllowNull, Column, Model, Table } from 'sequelize-typescript';

interface PlainCall {
  userId: number;
  contactId: number;
  phoneNumber: string;
  incomingTwilioCallSid: string;
  outgoingTwilioCallSid: string;
}

// This contains the parameters used to create the call and the resulting twilio information.
@Table
class Call extends Model<PlainCall> {
  @AllowNull(false)
  @Column
  userId: number;

  @AllowNull(false)
  @Column
  contactId: number;

  @AllowNull(false)
  @Column
  phoneNumber: string;

  @AllowNull(false)
  @Column
  incomingTwilioCallSid: string;

  // This needs to be determined later
  @Column
  outgoingTwilioCallSid: string;
}

export default Call;
