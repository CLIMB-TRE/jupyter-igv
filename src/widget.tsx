import React, { useState, useRef, useEffect } from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import igv from 'igv';

type IGVOptionsProps = {
  genome: string;
  locus?: string;
};

/**
 * React component for IGV.
 *
 * @returns The React component
 */
function IGViewer(props: IGVOptionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const browserRef = useRef<any>(null);

  useEffect(() => {
    const igvOptions = { genome: 'hg38', locus: 'BRCA1' };
    igv
      .createBrowser(containerRef.current!, igvOptions)
      .then(browser => (browserRef.current = browser));
  }, []);

  useEffect(() => {
    if (browserRef.current) {
      if (props.genome) {
        browserRef.current.loadGenome(props.genome);
      }

      if (props.locus) {
        browserRef.current.search(props.locus);
      }
    }
  }, [props.genome, props.locus]);

  return <div ref={containerRef} />;
}

function IGV() {
  const [genome, setGenome] = useState('');
  const [locus, setLocus] = useState('');
  const [igvOptions, setIgvOptions] = useState<IGVOptionsProps>({
    genome,
    locus
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIgvOptions({ genome, locus });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '8px' }}>
        <input
          type="text"
          value={genome}
          onChange={e => setGenome(e.target.value)}
          placeholder="Enter genome (e.g., hg38)"
        />
        <input
          type="text"
          value={locus}
          onChange={e => setLocus(e.target.value)}
          placeholder="Enter locus (e.g., BRCA1)"
        />
        <button type="submit">Go</button>
      </form>
      <IGViewer {...igvOptions} />
    </div>
  );
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
