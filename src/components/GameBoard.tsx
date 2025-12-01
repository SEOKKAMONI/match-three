import { Box } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { Flipper } from "react-flip-toolkit";
import { useMatchThree } from "../match-three/useMatchThree";
import { GameBoardSlot } from "./GameBoardSlot";
import { useSize } from "./useSize";
import { useCursorStyle } from "./useCursorStyle";

export const GameBoard = () => {
  const { board, columnCount, rowCount } = useMatchThree();
  const cursorStyle = useCursorStyle();

  const ref = useRef<HTMLDivElement>(null);
  const [boardWidth] = useSize(ref);
  const boardHeight = (boardWidth / columnCount) * rowCount;

  const flipKey = JSON.stringify(board);

  return (
    <Box
      ref={ref}
      sx={{
        ...cursorStyle,
        width: "100%",
        height: boardHeight,
        position: "relative",
      }}
    >
      <Flipper flipKey={flipKey}>
        <AnimatePresence>
            {board.map((column, columnIndex) =>
              column.map((item, rowIndex) =>
                item ? (
                  <GameBoardSlot
                    key={item.id}
                    rowIndex={rowIndex}
                    columnIndex={columnIndex}
                    item={item}
                    boardHeight={boardHeight}
                    boardWidth={boardWidth}
                  />
                ) : null
              )
            )}
        </AnimatePresence>
      </Flipper>
    </Box>
  );
};
