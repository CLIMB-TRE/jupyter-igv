import { LabIcon } from '@jupyterlab/ui-components';
import DNA_ICON from './../style/icons/dna.svg';
import INNER_JOIN_ICON from './../style/icons/inner_join.svg';
import OPEN_FILE_ICON from './../style/icons/open_file.svg';

export const dnaIcon = new LabIcon({
  name: 'jlab-igv:dna',
  svgstr: DNA_ICON
});

export const innerJoinIcon = new LabIcon({
  name: 'jlab-igv:inner-join',
  svgstr: INNER_JOIN_ICON
});

export const openFileIcon = new LabIcon({
  name: 'jlab-igv:open-file',
  svgstr: OPEN_FILE_ICON
});
