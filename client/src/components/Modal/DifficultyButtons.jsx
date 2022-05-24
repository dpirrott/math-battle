import { useState } from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";

export const DifficultyButtons = ({ value, setValue }) => {
  /*
   * The second argument that will be passed to
   * `handleChange` from `ToggleButtonGroup`
   * is the SyntheticEvent object, but we are
   * not using it in this example so we will omit it.
   */
  const handleChange = (val) => setValue(val);

  return (
    <ToggleButtonGroup
      type="radio"
      name="Difficulty"
      value={value}
      onChange={handleChange}
      style={{ display: "block" }}
    >
      <ToggleButton id="tbg-btn-1" value={1}>
        Eazy
      </ToggleButton>
      <ToggleButton id="tbg-btn-2" value={2}>
        Medium
      </ToggleButton>
      <ToggleButton id="tbg-btn-3" value={3}>
        Hard
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
