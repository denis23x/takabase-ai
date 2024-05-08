const prompts = require('prompts');
const spawn = require('child_process').spawn;
const config = require('dotenv').config;

config({
  path: '.env.takabase-local',
  override: false
});

const projectList = {
  ['takabase-dev']: {
    url: 'https://takabase-dev-api.web.app'
  },
  ['takabase-prod']: {
    url: 'https://takabase-prod-api.web.app'
  },
};

(async () => {
  const project = await prompts({
    type: 'select',
    name: 'project',
    message: 'Select a environment',
    choices: [
      {
        title: 'takabase-dev',
        value: 'takabase-dev',
        description: 'https://takabase-dev-ai.web.app',
      },
      {
        title: 'takabase-local',
        value: 'takabase-local',
        description: 'https://takabase-local-ai.web.app',
      },
      {
        title: 'takabase-prod',
        value: 'takabase-prod',
        description: 'https://takabase-prod-ai.web.app',
      },
    ],
    initial: 0
  });

  const action = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select an action',
    choices: [
      {
        title: 'Deploy function',
        value: 'function',
        description: projectList[project.project].url,
      },
      {
        title: 'Deploy hosting',
        value: 'hosting',
        description: projectList[project.project].url,
      }
    ],
    initial: 0
  });

  const confirm = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: 'Can you confirm?',
    initial: project.project !== 'takabase-prod'
  });

  if (project.project && action.action && confirm.confirm) {
    const command = [`firebase use ${project.project}`];

    if (action.action === 'function') {
      command.push(`firebase deploy --only functions:ai`);
    }

    if (action.action === 'hosting') {
      command.push(`firebase deploy --only hosting:${project.project}-ai`);
    }

    /** RUN */

    spawn(command.join(' && '), {
      shell: true,
      stdio:'inherit'
    });
  } else {
    console.log('Ok, Bye!');
  }
})();
