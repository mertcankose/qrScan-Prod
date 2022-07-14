import * as React from 'react';
import Svg, {Rect, Line} from 'react-native-svg';

const SvgPlusSquare = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-plus-square"
    {...props}>
    <Rect x={3} y={3} width={18} height={18} rx={2} ry={2} />
    <Line x1={12} y1={8} x2={12} y2={16} />
    <Line x1={8} y1={12} x2={16} y2={12} />
  </Svg>
);

export default SvgPlusSquare;
