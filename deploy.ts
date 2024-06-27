/** @format */

import prompts from 'prompts';
import { spawnSync } from 'child_process';

const projectList: any = {
  ['takabase-dev']: {
    url: 'https://takabase-dev-api.web.app'
  },
  ['takabase-local']: {
    url: 'https://takabase-local-api.web.app'
  },
  ['takabase-prod']: {
    url: 'https://takabase-prod-api.web.app'
  }
};

(async () => {
  const project: prompts.Answers<string> = await prompts({
    type: 'select',
    name: 'project',
    message: 'Select a environment',
    choices: Object.keys(projectList).map((key: string) => {
      return {
        title: key,
        value: key,
        description: projectList[key].url
      };
    }),
    initial: 0
  });

  const action: prompts.Answers<string> = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select an action',
    choices: [
      {
        title: 'Deploy function',
        value: 'function',
        description: projectList[project.project].url
      },
      {
        title: 'Deploy hosting',
        value: 'hosting',
        description: projectList[project.project].url
      }
    ],
    initial: 0
  });

  const confirm: prompts.Answers<string> = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: 'Can you confirm?',
    initial: project.project !== 'takabase-prod'
  });

  if (project.project && action.action && confirm.confirm) {
    const command: string[] = [`firebase use ${project.project}`];

    if (action.action === 'function') {
      command.push(`firebase deploy --only functions:ai`);
    }

    if (action.action === 'hosting') {
      command.push(`firebase deploy --only hosting:${project.project}-ai`);
    }

    /** RUN */

    spawnSync(command.join(' && '), {
      shell: true,
      stdio: 'inherit'
    });
  } else {
    console.log('Ok, Bye!');
  }
})();
