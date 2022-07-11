// There is a materialized view JOINED_CALLS which exists only for analytics purposes.
// This ensures that the view is refreshed.
// TODO document the view in code and possibly find another way to manage analytics data.

import { readFile } from 'fs';
import { logger } from '../config';
import { sequelize } from '../models';

const jobIntervalMillis = 1 * 60 * 60 * 1000;

const joinCallsSql = `
REFRESH MATERIALIZED VIEW joined_calls;
`;

function refreshJoinedCalls() {
  async function job() {
    try {
      logger.info('refreshJoinedCalls==========');
      sequelize.query(joinCallsSql);
    } catch (error) {
      logger.error('joined calls error %s', error);
    } finally {
      setTimeout(job, jobIntervalMillis);
    }
  }
  job();
}

export default refreshJoinedCalls;
