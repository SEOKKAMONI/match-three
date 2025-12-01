import { Box, useTheme } from "@mui/material";
import { blue, green, purple, red, yellow } from "@mui/material/colors";
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

interface ItemProps {
  item: Item;
}

const DefaultItem = ({ item }: ItemProps) => {
  const theme = useTheme();
  const muiColor = colorToMuiColor(item.color);

  return (
    <Box
      sx={{
        borderRadius: theme.spacing(1),
        width: "100%",
        height: "100%",
        background: muiColorToGradient(muiColor),
      }}
    />
  );
};

const RadiusBombItem = ({ item }: ItemProps) => {
  const muiColor = colorToMuiColor(item.color);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: muiColotToBombGradient(muiColor),
      }}
    />
  );
};

const ColorBombItem = ({ item }: ItemProps) => {
  const theme = useTheme();
  const muiColor = colorToMuiColor(item.color);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: "transparent",
        borderRadius: "50%",
        border: `${theme.spacing(1)} solid ${muiColor[600]}`,
      }}
    />
  );
};

const LineBombItem = ({ item }: ItemProps) => {
  const theme = useTheme();
  const muiColor = colorToMuiColor(item.color);

  return (
    <Box
      sx={{
        borderRadius: theme.spacing(1),
        width: "100%",
        height: "100%",
        background: "transparent",
        border: `${theme.spacing(1)} solid ${muiColor[600]}`,
      }}
    />
  );
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
