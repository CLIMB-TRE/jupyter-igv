import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import {
  ICommandPalette,
  MainAreaWidget,
  WidgetTracker
} from '@jupyterlab/apputils';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { ILauncher } from '@jupyterlab/launcher';
import { requestAPI, requestAPIResponse } from './handler';
import { IGVWidget } from './widget';
import { igvIcon } from './icon';

export const PLUGIN_NAMESPACE = '@jupyter-igv';
const PLUGIN_ID = `${PLUGIN_NAMESPACE}:plugin`;

const tracker = new WidgetTracker<MainAreaWidget<IGVWidget>>({
  namespace: PLUGIN_NAMESPACE
});

/**
 * Initialization data for the jupyter-igv extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  description: 'JupyterLab Extension for IGV (Integrative Genomics Viewer).',
  autoStart: true,
  requires: [ICommandPalette, IDocumentManager],
  optional: [ILauncher, ILayoutRestorer],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    documentManager: IDocumentManager,
    launcher: ILauncher | null,
    restorer: ILayoutRestorer | null
  ) => {
    console.log(`JupyterLab extension ${PLUGIN_NAMESPACE} is activated!`);

    // Define command IDs and categories
    const igvCommandID = 'jupyter_igv:open';
    const category = 'CLIMB-TRE';

    // Retrieve extension version and log to the console
    let version = '';
    requestAPI<any>('version')
      .then(data => {
        version = data['version'];
        console.log(
          `JupyterLab extension ${PLUGIN_NAMESPACE} version: ${version}`
        );
      })
      .catch(error =>
        console.error(`Failed to fetch ${PLUGIN_NAMESPACE} version: ${error}`)
      );

    // Handle layout restoration
    if (restorer) {
      void restorer.restore(tracker, {
        command: igvCommandID,
        args: widget => ({ name: widget.content.name }),
        name: widget => widget.content.name
      });
    }

    // Function to create new IGV widgets
    const createIGVWidget = async (
      name?: string
    ): Promise<MainAreaWidget<IGVWidget>> => {
      // Generate a unique name if not provided
      if (!name) {
        name = Date.now().toString();
      }

      // Create the IGVWidget instance
      const content = new IGVWidget(
        route => Promise.resolve(requestAPIResponse(route)),
        _ => Promise.resolve(),
        _ => Promise.resolve(),
        version,
        name
      );

      // Define the MainAreaWidget with the IGVWidget content
      const widget = new MainAreaWidget({ content });
      widget.id = `igv-widget-${name}`;
      widget.title.label = 'IGV';
      widget.title.icon = igvIcon;
      widget.title.closable = true;

      return widget;
    };

    // Add commands to the command registry
    // Command to launch IGV
    app.commands.addCommand(igvCommandID, {
      caption: 'IGV | Integrative Genomics Viewer',
      label: 'IGV',
      icon: igvIcon,
      execute: async args => {
        const name = args['name'] as string;
        let widget: MainAreaWidget<IGVWidget>;

        if (name) {
          // Restore existing widget
          const existingWidget = tracker.find(w => w.content.name === name);
          if (existingWidget) {
            widget = existingWidget;
          } else {
            widget = await createIGVWidget(name);
          }
        } else {
          // Create new widget
          widget = await createIGVWidget();
        }

        // Add the widget to the tracker if it's not there
        if (!tracker.has(widget)) {
          tracker.add(widget);
        }

        // Attach the widget to the main work area if it's not there
        if (!widget.isAttached) {
          app.shell.add(widget, 'main');
        }

        // Activate and return the widget
        app.shell.activateById(widget.id);
        return widget;
      }
    });

    // Add commands to the command palette
    palette.addItem({ command: igvCommandID, category: category });

    // Add commands to the launcher
    if (launcher) {
      launcher.add({
        command: igvCommandID,
        category: category
      });
    }
  }
};

export default plugin;
