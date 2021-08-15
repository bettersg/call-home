import { Edge } from '@call-home/shared/types/CallExperimentFlags';
import { UserExperimentConfig } from '../models';

const {
  ENABLE_ALLOWLIST_SMS,
  DISABLE_ALLOWLIST,
  ENABLE_DORM_VALIDATION,
  DISABLE_PERIODIC_JOBS,
  ENABLE_EDGE_EXPERIMENT,
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
 * Returns whether or not the 'edge' user experiment should be enabled.
 *
 * This allows us to opt-into the 'edge' experiment, which prevents accidental
 * push and gives us an escape hatch if it turns out to be disruptive.
 */
function shouldEnableEdgeExperiment(): boolean {
  return Boolean(ENABLE_EDGE_EXPERIMENT);
}

/**
 * Returns whether or not the 'edge' user experiment should be disabled.
 */
function getEdgeExperimentFlag(
  userExperimentConfig: UserExperimentConfig
): Edge {
  return shouldEnableEdgeExperiment()
    ? userExperimentConfig.edge
    : Edge.DEFAULT;
}

export {
  shouldDisableAllowlist,
  shouldEnableAllowlistSms,
  shouldEnableDormValidation,
  shouldDisablePeriodicJobs,
  getEdgeExperimentFlag,
};
