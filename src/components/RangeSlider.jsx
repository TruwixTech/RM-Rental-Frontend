import React, { useState } from 'react';
import '../assets/csss/RangeSlider.css';

const RangeSlider = () => {
  const [value, setValue] = useState(50);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="range-slider">

      <input 
        type="range" 
        min="50" 
        max="9999" 
        value={value} 
        onChange={handleChange} 
        className="range" 
      />
      <div className="value">{value}</div>
    </div>
  );
};

export default RangeSlider;
