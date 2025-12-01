import { Box } from "@material-ui/core";
import { motion } from "framer-motion";
import { isEqual } from "lodash-es";
import React, { useState } from "react";
import { Flipped } from "react-flip-toolkit";
import { Status, type Item, type Index } from "../match-three";
import { useMatchThree } from "../match-three/useMatchThree";
import { GameBoardItem } from "./GameBoardItem";

const toPercent = (decimal: number): string => `${decimal * 100}%`;

const selectedVariants = {
  notSelected: {
    scale: 1,
    opacity: 1,
  },
  selected: {
    scale: 1 + 1 / 3,
    opacity: 3 / 4,
  },
  hover: {
    scale: 0.9,
    opacity: 0.9,
  },
};

interface GameBoardSlotProps {
  rowIndex: number;
  columnIndex: number;
  boardHeight: number;
  boardWidth: number;
  item: Item;
}

export const GameBoardSlot = (props: GameBoardSlotProps) => {
  const { rowIndex, columnIndex, boardHeight, boardWidth, item } = props;

  const {
    grabbed,
    columnCount,
    rowCount,
    grab,
    drop,
    status,
  } = useMatchThree();
  const isCollapsing = status === Status.COLLAPSING;
  const isGrabbed = isEqual(grabbed, [columnIndex, rowIndex]);
  const [isHovering, setIsHovering] = useState(false);

  const variant = isCollapsing
    ? "notSelected"
    : isGrabbed
    ? "selected"
    : isHovering
    ? "hover"
    : "notSelected";

  const handleGrab = () => {
    if (isGrabbed) {
      drop([columnIndex, rowIndex]);
    } else {
      grab([columnIndex, rowIndex]);
    }
  };

  const handleDrop = () => {
    if (grabbed) {
      drop([columnIndex, rowIndex]);
    }
  };

  const styles = {
    position: "absolute" as const,
    top: toPercent(rowIndex / rowCount),
    left: toPercent(columnIndex / columnCount),
    width: boardWidth / columnCount,
    height: boardHeight / rowCount,
    zIndex: isGrabbed ? 2 : 1,
  };

  return (
    <Flipped key={item.id} flipId={item.id}>
      <Box style={styles} onMouseDown={handleGrab} onMouseEnter={handleDrop}>
        <motion.div
          onHoverStart={() => {
            setIsHovering(true);
          }}
          onHoverEnd={() => {
            setIsHovering(false);
          }}
          style={{ width: "100%", height: "100%" }}
          variants={selectedVariants}
          initial="notSelected"
          animate={variant}
        >
          <GameBoardItem item={item} />
        </motion.div>
      </Box>
    </Flipped>
  );
};
