import { AllowNull, Column, Model, Table } from 'sequelize-typescript';

@Table
class Contact extends Model<Contact> {
  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  // TODO add validation based on country code and whatnot
  phoneNumber: string;

  @Column
  // TODO validate this
  // should have the format "{avatar_group}_{avatar_variant}" e.g. male_4, female_2
  avatar: string;
}

export default Contact;
