import Svg, { Path } from "react-native-svg";

export default function Wave() {
  return (
    <Svg
      width="100%"
      height={120}
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
    >
      <Path
        fill="#FFFFFF"
        d="M0,224L60,208C120,192,240,160,360,154.7C480,149,600,171,720,186.7C840,203,960,213,1080,202.7C1200,192,1320,160,1380,144L1440,128L1440,320L0,320Z"
      />
    </Svg>
  );
}