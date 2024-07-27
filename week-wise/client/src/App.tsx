import React from 'react';
import Homepage from './components/homepage';
import { ThemeProvider } from "@/components/theme-provider"

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {<Homepage></Homepage>}
    </ThemeProvider>
  );
};
export default App
