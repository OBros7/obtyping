import React, { useState } from 'react';

const Toggle = () => {
  // useState is used to keep track of the toggle's state
  const [isOn, setIsOn] = useState(false);

  // handleClick is the function that will be called when the button is clicked
  const handleClick = () => {
    setIsOn(!isOn); // Switch the state between true and false
  };

  return (
    <div>
      {/* Display the current state */}
      <p>Keyboard {isOn ? 'ON' : 'OFF'}</p>

      {/* Button to change the state */}
      <button onClick={handleClick}>
        Turn {isOn ? 'OFF' : 'ON'}
      </button>
    </div>
  );
}

export default Toggle;