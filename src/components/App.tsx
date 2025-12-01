import { Container } from "@mui/material";
import { GameBar } from "./GameBar";
import { GameBoard } from "./GameBoard";
import { useDisableZoom } from "./useDisableZoom";

export const App = () => {
  useDisableZoom(null);

  return (
    <Container maxWidth="xs" disableGutters={true} sx={{ touchAction: "none" }}>
      <GameBar />
      <GameBoard />
    </Container>
  );
};
