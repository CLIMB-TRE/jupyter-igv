import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { MainAreaWidget } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { IGVWidget } from './widget';
import { igvIcon } from './icon';

/**
 * The command IDs used by the jlab-igv plugin.
 */
namespace CommandIDs {
  export const create = 'create-jlab-igv';
}

/**
 * Initialization data for the jlab-igv extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jlab-igv',
  description: 'JupyterLab Extension for IGV (Integrative Genomics Viewer).',
  autoStart: true,
  optional: [ILauncher],
  activate: (app: JupyterFrontEnd, launcher: ILauncher) => {
    const { commands } = app;

    const command = CommandIDs.create;
    commands.addCommand(command, {
      caption: 'IGV | Integrative Genomics Viewer',
      label: 'IGV',
      icon: igvIcon,
      execute: () => {
        const content = new IGVWidget();
        const widget = new MainAreaWidget<IGVWidget>({ content });
        widget.title.label = 'IGV';
        widget.title.icon = igvIcon;
        app.shell.add(widget, 'main');
      }
    });

    if (launcher) {
      launcher.add({
        command
      });
    }
  }
};

export default extension;
