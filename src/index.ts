import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './handler';

import { ITopBar } from 'jupyterlab-topbar';

import {createCountdown} from "./Countdown";

/**
 * Initialization data for the remaining-job-time extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'remaining-job-time:plugin',
  autoStart: true,
  requires: [ITopBar],
  activate: async (app: JupyterFrontEnd,
             topBar: ITopBar) => {
    const data = await requestAPI<any>('stop-time')
    if (data["end_time"] === "") {
      return;
    }
    const widget = createCountdown(data["end_time"]);
    topBar.addItem('remaining-job-time', widget);
  }
};

export default plugin;
