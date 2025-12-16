import React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import { requestAPI } from './handler';
import JupyterIGV from 'jupyter-igv-component';

export class JupyterIGVWidget extends ReactWidget {
  constructor(version: string, name: string) {
    super();
    this.version = version;
    this.name = name;

    // Add class for the widget
    this.addClass('jupyter-igv-widget');
  }

  version: string;
  name: string;

  // Handler for generating presigned S3 URLs
  s3PresignHandler = async (uri: string): Promise<string> => {
    const data = await requestAPI<any>('s3-presign', {}, ['uri', uri]);
    return data['url'];
  };

  render(): JSX.Element {
    return (
      <JupyterIGV
        version={this.version}
        s3PresignHandler={this.s3PresignHandler}
      />
    );
  }
}

export default JupyterIGVWidget;
