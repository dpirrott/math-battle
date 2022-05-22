import { useState } from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";

export const DifficultyButtons = () => {
  const [value, setValue] = useState([1, 3]);

  /*
   * The second argument that will be passed to
   * `handleChange` from `ToggleButtonGroup`
   * is the SyntheticEvent object, but we are
   * not using it in this example so we will omit it.
   */
  const handleChange = (val) => setValue(val);

  return (
    <ToggleButtonGroup type="radio" name="Difficulty" value={value} onChange={handleChange}>
      <ToggleButton id="tbg-btn-1" value={1}>
        Single
      </ToggleButton>
      <ToggleButton id="tbg-btn-2" value={2}>
        Double
      </ToggleButton>
      <ToggleButton id="tbg-btn-3" value={3}>
        Triple
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
