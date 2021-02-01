/*
 * Copyright 2021 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { configApiRef, InfoCard, useApi } from '@backstage/core';
import { Stepper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useMemo } from 'react';
import { ImportFlows, ImportState, useImportState } from '../useImportState';
import {
  defaultGenerateStepper,
  defaultStepper,
  StepperProvider,
  StepperProviderOpts,
} from './defaults';

const useStyles = makeStyles(() => ({
  stepperRoot: {
    padding: 0,
  },
}));

export const ImportStepper = ({
  initialUrl,
  generateStepper = defaultGenerateStepper,
  variant,
  opts,
}: {
  initialUrl?: string;
  generateStepper?: (
    flow: ImportFlows,
    defaults: StepperProvider,
  ) => StepperProvider;
  variant?: string;
  opts?: StepperProviderOpts;
}) => {
  const configApi = useApi(configApiRef);
  const classes = useStyles();
  const state = useImportState({ initialUrl });

  const states = useMemo<StepperProvider>(
    () => generateStepper(state.activeFlow, defaultStepper),
    [generateStepper, state.activeFlow],
  );

  return (
    <InfoCard variant={variant}>
      <Stepper
        classes={{ root: classes.stepperRoot }}
        activeStep={state.activeStepNumber}
        orientation="vertical"
      >
        {states.analyze(
          state as Extract<ImportState, { activeState: 'analyze' }>,
          { apis: { configApi }, opts },
        )}
        {states.prepare(
          state as Extract<ImportState, { activeState: 'prepare' }>,
          { apis: { configApi }, opts },
        )}
        {states.review(
          state as Extract<ImportState, { activeState: 'review' }>,
          { apis: { configApi }, opts },
        )}
        {states.finish(
          state as Extract<ImportState, { activeState: 'finish' }>,
          { apis: { configApi }, opts },
        )}
      </Stepper>
    </InfoCard>
  );
};
