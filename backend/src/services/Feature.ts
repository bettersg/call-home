import { Edge } from '@call-home/shared/types/CallExperimentFlags';
import { UserExperimentConfig } from '../models';

const {
  ENABLE_ALLOWLIST_SMS,
  DISABLE_ALLOWLIST,
  ENABLE_DORM_VALIDATION,
  DISABLE_PERIODIC_JOBS,
  DISABLE_EDGE_EXPERIMENT,
} = process.env;

function shouldEnableAllowlistSms(): boolean {
  return Boolean(ENABLE_ALLOWLIST_SMS);
}

function shouldDisableAllowlist(): boolean {
  return Boolean(DISABLE_ALLOWLIST);
}

function shouldEnableDormValidation(): boolean {
  return Boolean(ENABLE_DORM_VALIDATION);
}

// Allows periodic jobs to be disabled. Might be necessary to prevent multiple instances from writing to the same database.
function shouldDisablePeriodicJobs(): boolean {
  return Boolean(DISABLE_PERIODIC_JOBS);
}

/**
 * Returns whether or not the 'edge' user experiment should be disabled.
 *
 * This gives us an escape hatch to disable the 'edge' experiment if it turns out to be disruptive.
 */
function shouldDisableEdgeExperiment(): boolean {
  return Boolean(DISABLE_EDGE_EXPERIMENT);
}

/**
 * Returns whether or not the 'edge' user experiment should be disabled.
 */
function getEdgeExperimentFlag(
  userExperimentConfig: UserExperimentConfig
): Edge {
  return shouldDisableEdgeExperiment()
    ? Edge.DEFAULT
    : userExperimentConfig.edge;
}

export {
  shouldDisableAllowlist,
  shouldEnableAllowlistSms,
  shouldEnableDormValidation,
  shouldDisablePeriodicJobs,
  getEdgeExperimentFlag,
};
