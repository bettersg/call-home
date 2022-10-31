import { AllowNull, Column, Model, Table, Unique } from 'sequelize-typescript';

@Table
class Dorm extends Model<Dorm> {
  @Unique
  @AllowNull(false)
  @Column
  name: string;
}

export default Dorm;
