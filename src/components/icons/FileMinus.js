import * as React from 'react';
import Svg, {Path, Polyline, Line} from 'react-native-svg';

const SvgFileMinus = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-file-minus"
    {...props}>
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
    <Line x1={9} y1={15} x2={15} y2={15} />
  </Svg>
);

export default SvgFileMinus;
