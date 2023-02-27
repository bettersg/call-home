import { DateTime, Zone } from 'luxon';
import { Edge } from '@call-home/shared/types/CallExperimentFlags';
import { UserExperimentConfig } from '../models';

const {
  DISABLE_ALLOWLIST,
  DISABLE_PERIODIC_JOBS,
  DISABLE_WORKPASS_VALIDATION,
  ENABLE_ALLOWLIST_SMS,
  ENABLE_DORM_VALIDATION,
  ENABLE_EDGE_EXPERIMENT,
  ENABLE_FEEDBACK_DIALOG,
  ENABLE_FIN_VALIDATION,
  ENABLE_SUPPORT_SERVICES,
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

function shouldEnableFeedbackDialog() {
  return Boolean(ENABLE_FEEDBACK_DIALOG);
}

function shouldEnableCreditCap() {
  const cutoffDate = DateTime.fromObject({
    day: 1,
    month: 7,
    year: 2022,
    zone: 'Asia/Singapore',
  });
  const today = DateTime.now();

  return today >= cutoffDate;
}

function shouldEnableSupportServices() {
  return Boolean(ENABLE_SUPPORT_SERVICES);
}

function shouldDisableWorkpassValidation() {
  return Boolean(DISABLE_WORKPASS_VALIDATION);
}

function shouldEnableFinValidation() {
  return Boolean(ENABLE_FIN_VALIDATION);
}

export {
  shouldDisableAllowlist,
  shouldDisablePeriodicJobs,
  shouldDisableWorkpassValidation,
  shouldEnableAllowlistSms,
  shouldEnableCreditCap,
  shouldEnableDormValidation,
  shouldEnableFeedbackDialog,
  shouldEnableFinValidation,
  shouldEnableSupportServices,
  getEdgeExperimentFlag,
};
