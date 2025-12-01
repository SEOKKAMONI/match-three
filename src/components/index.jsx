import React from "react";
import { App } from "./App";
import { MatchThreeManager } from "./MatchThreeManager";
import { ThemeProvider } from "./ThemeProvider";

export const Root = () => {
  return (
    <MatchThreeManager>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MatchThreeManager>
  );
};
