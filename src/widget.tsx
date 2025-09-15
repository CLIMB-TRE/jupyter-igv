import React, { createRef } from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import igv from 'igv';

/**
 * React component for IGV.
 *
 * @returns The React component
 */
class IGV extends React.Component {
  container: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    this.container = createRef<HTMLDivElement>();
  }

  componentDidMount() {
    const igvOptions = { genome: 'hg38', locus: 'BRCA1' };
    igv.createBrowser(this.container.current!, igvOptions);
  }

  render() {
    return <div ref={this.container}></div>;
  }
}

/**
 * A Lumino Widget that wraps an IGVComponent.
 */
export class IGVWidget extends ReactWidget {
  constructor(name: string) {
    super();
    this.addClass('igv-widget');
    this.name = name;
  }

  name: string;

  render(): JSX.Element {
    return <IGV />;
  }
}

export default IGVWidget;
