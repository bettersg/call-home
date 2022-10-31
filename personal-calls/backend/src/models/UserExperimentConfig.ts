import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
  Unique,
  Validate,
} from 'sequelize-typescript';
import { Edge } from '@call-home/shared/types/CallExperimentFlags';

/**
 * This table stores a mapping of user to experiment value. For convenience, each
 * experiment is a column in this table instead of a separate table.
 */
@Table
class UserExperimentConfig extends Model<UserExperimentConfig> {
  @AllowNull(false)
  @Unique
  @Column
  userId: number;

  @AllowNull(false)
  @Validate({
    isIn: [Object.values(Edge)],
  })
  @Column(DataType.STRING)
  edge: Edge;
}

export default UserExperimentConfig;
