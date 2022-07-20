import React from "react";

const Truncate = (input, len, small = false) =>
    input.length > len ? `${input.substring(0, len)}...${small ? input.substring(input.length - len, input.length) : ''}` : input;

export default Truncate;