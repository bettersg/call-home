import { Edge } from '@call-home/shared/types/CallExperimentFlags';
import { UserExperimentConfig as UserExperimentConfigEntity } from '../models';

// Handle the nitty-gritty of generating a configuration.

/**
 * A config object that describes the relative frequency of each flag in the population.
 * Each entry in the array is [flag value, cumulative frequency] and is evaluated left-to-right.
 * For each entry, the cumulative frequency describes the proportion of the population that has the current flag or a preceding flag.
 */
type FlagFrequency<T> = Readonly<Array<Readonly<[T, number]>>>;
/**
 * An object that describes the frequencies for a set of experiments.
 */
type ExperimentFrequencies = {
  [key in ExperimentKey]: FlagFrequency<Edge>;
};
/**
 * An identifier for an experiment. This corresponds to a key in the UserExperimentConfig model.
 */
type ExperimentKey = 'edge';
/**
 * A single experiment config for a user. This describes the experiment flags in the UserExperimentConfig model.
 */
type ExperimentConfig = Pick<UserExperimentConfigEntity, ExperimentKey>;

/**
 * The actual experiments we want to have.
 */
const SUPPORTED_EXPERIMENTS: ExperimentKey[] = ['edge'];
/**
 * The actual experiments we want to have.
 */
const EXPERIMENT_FREQUENCIES: ExperimentFrequencies = {
  edge: [
    [Edge.DEFAULT, 0.33],
    [Edge.SINGAPORE_ONLY, 0.66],
    [Edge.SINGAPORE_ROAMING, 1.0],
  ],
} as const;

/**
 * Generates a random flag value based on a FlagFrequency.
 *
 * e.g. for cumulative frequencies of [0.2, 0.8, 1.0], we expect random flag values to be generated with frequencies of [0.2, 0.6, 0.2].
 *
 * @param flagFrequency The relative frequencies of the flag.
 * @return the flag value.
 */
function generateFlagValue<T>(flagFrequency: FlagFrequency<T>): T {
  // Generate a random number in the interval [0, 1);
  const choice = Math.random();
  // Since each entry is a cumulative frequency, each flag corresponds to a discrete interval.
  // We can find the corresponding interval by finding the first interval whose upper bound is greater than the random choice.
  const [flagValue] =
    flagFrequency.find(([, freq]) => choice <= freq) ||
    // This should not be necessary, but for type checking, we default to the first value.
    flagFrequency[0];
  return flagValue;
}

/**
 * Generate a single config for a user.
 *
 * @param expectedExperiments The experiments to generate values for.
 * @param experimentFrequencies An object describing the relative frequencies of the flags.
 * @return An experiment config with values for the expected experiments.
 */
export function generateConfig(
  expectedExperiments: ExperimentKey[],
  experimentFrequencies: ExperimentFrequencies
): ExperimentConfig {
  return expectedExperiments.reduce(
    (config, exp) => ({
      ...config,
      [exp]: generateFlagValue(experimentFrequencies[exp]),
    }),
    {} as ExperimentConfig
  );
}

// Actually call the db.
/**
 * UserExperimentConfigService service definition.
 */
interface UserExperimentConfigService {
  getOrUpsert: (userId: number) => Promise<UserExperimentConfigEntity>;
}

/**
 * UserExperimentConfigService service constructor.
 */
function UserExperimentConfigService(
  UserExperimentConfigModel: typeof UserExperimentConfigEntity
): UserExperimentConfigService {
  /**
   * Returns whether or not given config is valid for the current set of experiments.
   */
  function isConfigValid(
    userExperimentConfig: Partial<UserExperimentConfigEntity>
  ): boolean {
    if (!userExperimentConfig.userId) {
      return false;
    }
    // Return true if every supported experiment is present.
    return SUPPORTED_EXPERIMENTS.every((experiment) =>
      Boolean(userExperimentConfig[experiment])
    );
  }

  async function getOrUpsert(
    userId: number
  ): Promise<UserExperimentConfigEntity> {
    const currentConfig = await UserExperimentConfigEntity.findOne({
      where: {
        userId,
      },
    });

    if (currentConfig && isConfigValid(currentConfig)) {
      return currentConfig;
    }

    // If a config isn't found or if it isn't valid, we generate a new one.
    const newConfigData = {
      // Generate values for all flags.
      ...generateConfig(SUPPORTED_EXPERIMENTS, EXPERIMENT_FREQUENCIES),
      // Keep old values where possible.
      ...currentConfig,
      userId,
    };

    // This is a 'manual' upsert because the .upsert method doesn't always work as expected.
    let createdConfig: UserExperimentConfigEntity;
    if (!currentConfig) {
      createdConfig = await UserExperimentConfigModel.create(newConfigData);
    } else {
      await UserExperimentConfigModel.update(newConfigData, {
        where: { userId },
      });
      createdConfig = currentConfig;
      await createdConfig.reload();
    }
    return createdConfig;
  }

  return {
    getOrUpsert,
  };
}

export default UserExperimentConfigService;
