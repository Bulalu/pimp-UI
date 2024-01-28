import {
    ReactCompareSlider,
    ReactCompareSliderImage,
  } from "react-compare-slider";
  
  export const CompareSlider = ({ original, restored }) => {
    return (
      <ReactCompareSlider
      itemOne={<ReactCompareSliderImage src={original} alt="original photo" style={{ margin: 0 }} />}
      itemTwo={<ReactCompareSliderImage src={restored} alt="generated photo" style={{ margin: 0 }} />}
      portrait
      className="flex w-[600px] mt-5 h-96"
      style={{ backgroundColor: 'transparent' }}
  />
    );
  };

