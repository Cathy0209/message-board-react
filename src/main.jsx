import { createRoot } from "react-dom/client";
import MessageBoard from "./components/MessageBoard";
import { ThemeProvider } from "styled-components";

const theme = {
  colors: {
    red: "#be002f",
    blue: "#44cef6",
    navy: "#2e4e7e",
  },
};

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <MessageBoard />
  </ThemeProvider>
);
