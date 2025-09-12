import React, { createRef } from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import igv from 'igv';

// const igvStyle = {
//   paddingTop: '10px',
//   paddingBottom: '10px',
//   margin: '8px',
//   border: '1px solid lightgray'
// };

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
    return (
      <div
        ref={this.container}
        // style={igvStyle}
      ></div>
    );
  }
}

/**
 * A Lumino Widget that wraps an IGVComponent.
 */
export class IGVWidget extends ReactWidget {
  /**
   * Constructs a new IGVWidget.
   */
  constructor() {
    super();
    this.addClass('jp-react-widget');
  }

  render(): JSX.Element {
    return <IGV />;
  }
}

export default IGVWidget;
