import * as React from 'react';
import Svg, {Circle, Line} from 'react-native-svg';

const SvgXCircle = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-x-circle"
    {...props}>
    <Circle cx={12} cy={12} r={10} />
    <Line x1={15} y1={9} x2={9} y2={15} />
    <Line x1={9} y1={9} x2={15} y2={15} />
  </Svg>
);

export default SvgXCircle;
