import { makeStyles } from "@material-ui/core";
import { blue, green, purple, red, yellow } from "@material-ui/core/colors";
import { motion } from "framer-motion";
import { useRef } from "react";
import { ItemType, type Color, Item } from "../match-three/board";
import { useDisableZoom } from "./useDisableZoom";

type MaterialUIColor = typeof red | typeof yellow | typeof blue | typeof green | typeof purple;

const muiColorToGradient = (muiColor: MaterialUIColor): string =>
  `radial-gradient(${muiColor[400]}, ${muiColor[900]})`;

const muiColotToBombGradient = (muiColor: MaterialUIColor): string =>
  `repeating-linear-gradient(${muiColor[400]}, ${muiColor[900]})`;

const colorToMuiColor = (color: Color): MaterialUIColor => ({ red, yellow, blue, green, purple }[color]);

interface StyleProps {
  color: Color;
}

const useStyles = makeStyles((theme) => ({
  item: {
    borderRadius: theme.spacing(1),
    width: "100%",
    height: "100%",
    background: ({ color }: StyleProps) => muiColorToGradient(colorToMuiColor(color)),
  },

  radiusBomb: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: ({ color }: StyleProps) => muiColotToBombGradient(colorToMuiColor(color)),
  },

  colorBomb: {
    width: "100%",
    height: "100%",
    background: "transparent",
    borderRadius: "50%",
    border: ({ color }: StyleProps) =>
      `${theme.spacing(1)}px solid ${colorToMuiColor(color)[600]}`,
  },

  lineBomb: {
    borderRadius: theme.spacing(1),
    width: "100%",
    height: "100%",
    background: "transparent",

    border: ({ color }: StyleProps) =>
      `${theme.spacing(1)}px solid ${colorToMuiColor(color)[600]}`,
  },
}));

interface ItemProps {
  item: Item;
}

const DefaultItem = ({ item }: ItemProps) => {
  const classes = useStyles({ color: item.color });

  return <div className={classes.item} />;
};

const RadiusBombItem = ({ item }: ItemProps) => {
  const classes = useStyles({ color: item.color });

  return <div className={classes.radiusBomb} />;
};

const ColorBombItem = ({ item }: ItemProps) => {
  const classes = useStyles({ color: item.color });

  return <div className={classes.colorBomb} />;
};

const LineBombItem = ({ item }: ItemProps) => {
  const classes = useStyles({ color: item.color });

  return <div className={classes.lineBomb} />;
};

export const GameBoardItem = ({ item }: ItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useDisableZoom(ref.current);

  return (
    <motion.div
      style={{ zIndex: 100, width: "100%", height: "100%" }}
      ref={ref}
      initial={{
        scale: 0,
        transformOrigin: "center",
      }}
      animate={{
        scale: 0.85,
        transformOrigin: "center",
      }}
      exit={{
        transformOrigin: "center",
        scale: 0,
      }}
    >
      {(() => {
          switch (item.type) {
            case ItemType.LineBomb:
              return <LineBombItem item={item} />;
            case ItemType.RadiusBomb:
              return <RadiusBombItem item={item} />;
            case ItemType.ColorBomb:
              return <ColorBombItem item={item} />;
            default:
              return <DefaultItem item={item} />;
          }
        })()}
    </motion.div>
  );
};
