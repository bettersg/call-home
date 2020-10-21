import { Column, Default, Model, Table } from 'sequelize-typescript';

// Feature flags for features that may need rapid toggling
@Table
class FeatureFlag extends Model<FeatureFlag> {
  @Default(false)
  @Column
  smsUserWhenAddedToAllowedList: boolean;
}

export default FeatureFlag;
