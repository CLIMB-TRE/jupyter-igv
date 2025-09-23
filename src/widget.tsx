import React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import JupyterIGV from 'jupyter-igv-component';

export class IGVWidget extends ReactWidget {
  constructor(
    httpPathHandler: (route: string) => Promise<Response>,
    s3PathHandler: (path: string) => Promise<void>,
    fileWriter: (path: string, content: string) => Promise<void>,
    version: string,
    name: string
  ) {
    super();
    this.addClass('igv-widget');
    this.httpPathHandler = httpPathHandler;
    this.s3PathHandler = s3PathHandler;
    this.fileWriter = fileWriter;
    this.version = version;
    this.name = name;
  }

  httpPathHandler: (route: string) => Promise<Response>;
  s3PathHandler: (path: string) => Promise<void>;
  fileWriter: (path: string, content: string) => Promise<void>;
  version: string;
  name: string;

  render(): JSX.Element {
    return (
      <JupyterIGV
        httpPathHandler={this.httpPathHandler}
        s3PathHandler={this.s3PathHandler}
        fileWriter={this.fileWriter}
        extVersion={this.version}
      />
    );
  }
}

export default IGVWidget;
