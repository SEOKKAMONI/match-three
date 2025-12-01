import { Container, makeStyles } from "@material-ui/core";
import { GameBar } from "./GameBar";
import { GameBoard } from "./GameBoard";
import { useDisableZoom } from "./useDisableZoom";

const useStyles = makeStyles(() => ({
  root: {
    touchAction: "none",
  },
}));

export const App = () => {
  const classes = useStyles();

  useDisableZoom(null);

  return (
    <Container maxWidth="xs" disableGutters className={classes.root}>
      <GameBar />
      <GameBoard />
    </Container>
  );
};
