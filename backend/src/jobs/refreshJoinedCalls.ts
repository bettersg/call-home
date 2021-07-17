// There is a materialized view JOINED_CALLS which exists only for analytics purposes.
// This ensures that the view is refreshed.
// TODO document the view in code and possibly find another way to manage analytics data.

import { logger } from '../config';
import { sequelize } from '../models';
import { readFile } from 'fs';

const jobIntervalMillis = 24 * 60 * 60 * 1000;

function refreshJoinedCalls() {
  async function job() {
    try {
      logger.info('refreshJoinedCalls==========');
      await readFile('join_calls.sql', 'utf8', (_, sql) => sequelize.query(sql));
    } catch (error) {
      logger.error(error);
    } finally {
      setTimeout(job, jobIntervalMillis);
    }
  }
  job();
}

export default refreshJoinedCalls;
