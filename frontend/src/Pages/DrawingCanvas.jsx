import React, { useEffect, useRef, useState } from "react";
import { FaPaintBrush, FaPencilAlt, FaFillDrip } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import Sidebar from "../Components/Sidebar";

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [isErasing, setIsErasing] = useState(false);
  const [eraserPosition, setEraserPosition] = useState({ x: -100, y: -100 });
  const [isPencilActive, setIsPencilActive] = useState(false);
  const [isFillActive, setIsFillActive] = useState(false);
  const [isBinActive, setIsBinActive] = useState(false);

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#FFA500",
    "#00FFFF",
    "#808080",
    "#8B4513",
  ];

  // Function to dynamically set canvas size
  const setCanvasSize = () => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement; // Get parent container

    // Set canvas width to 90% of the screen width, and maintain aspect ratio
    canvas.width = parent.clientWidth * 0.9;
    canvas.height = canvas.width * 0.6; // Maintain aspect ratio (adjust as needed)

    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;
  };

  // Initial Setup & Resize Handling
  useEffect(() => {
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize); // Update canvas on window resize
    return () => window.removeEventListener("resize", setCanvasSize);
  }, []);

  // Handle Brush & Eraser Mode
  useEffect(() => {
    const ctx = contextRef.current;
    if (!ctx) return;
    if (isErasing) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = brushSize * 2;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = isPencilActive ? 0.5 : brushSize; // Apply pencil size
    }
  }, [color, brushSize, isErasing, isPencilActive]);

  // Track Eraser Cursor Position
  const updateEraserPosition = (e) => {
    if (isErasing) {
      const { offsetX, offsetY } = getScaledCoords(e);
      setEraserPosition({ x: offsetX, y: offsetY });
    }
  };

  // Handle Mouse Move for Eraser and Drawing
  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getScaledCoords(e);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    // Update eraser position when erasing
    if (isErasing) {
      updateEraserPosition(e);
    }
  };

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getScaledCoords(e);
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);

    // Update eraser position when erasing
    if (isErasing) {
      updateEraserPosition(e);
    }
  };

  // Stop Drawing
  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  // Function to Scale Mouse Coordinates Based on Canvas Size
  const getScaledCoords = (e) => {
    const canvas = canvasRef.current;
    const scaleX = canvas.width / canvas.offsetWidth;
    const scaleY = canvas.height / canvas.offsetHeight;
    return {
      offsetX: e.nativeEvent.offsetX * scaleX,
      offsetY: e.nativeEvent.offsetY * scaleY,
    };
  };

  // Convert hex color to RGB array
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255];
  };

  // Check if two colors match (RGBA comparison)
  const colorMatch = (c1, c2) => {
    return (
      c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2] && c1[3] === c2[3] // Compare alpha channel too
    );
  };

  // Flood fill function for the fill tool
  const floodFill = (startX, startY, targetColor, fillColor) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const getColorAt = (x, y) => {
      const index = (y * width + x) * 4;
      return [
        pixels[index], // Red
        pixels[index + 1], // Green
        pixels[index + 2], // Blue
        pixels[index + 3], // Alpha
      ];
    };

    const setColorAt = (x, y, color) => {
      const index = (y * width + x) * 4;
      pixels[index] = color[0];
      pixels[index + 1] = color[1];
      pixels[index + 2] = color[2];
      pixels[index + 3] = 255; // Full opacity
    };

    if (colorMatch(targetColor, fillColor)) return;

    const queue = [[startX, startY]];
    const visited = new Set();

    while (queue.length > 0) {
      const [x, y] = queue.shift();
      const key = `${x},${y}`;
      if (visited.has(key)) continue;
      visited.add(key);

      if (x < 0 || y < 0 || x >= width || y >= height) continue;
      if (!colorMatch(getColorAt(x, y), targetColor)) continue;

      setColorAt(x, y, fillColor);

      queue.push([x + 1, y]);
      queue.push([x - 1, y]);
      queue.push([x, y + 1]);
      queue.push([x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // Function to clear the canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the entire canvas
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Canvas */}
      <div className="flex flex-col items-center mt-5 w-full">
        {/* Color Palette */}
        <div className="flex gap-2 mb-4 p-2 bg-[#FBE6FF]">
          {colors.map((paletteColor) => (
            <button
              key={paletteColor}
              onClick={() => {
                setColor(paletteColor);
                setIsErasing(false);
              }}
              className={`w-8 h-8 rounded-2xl ${
                color === paletteColor
                  ? "border-black border-2"
                  : "border-2 border-gray-300"
              }`}
              style={{ backgroundColor: paletteColor }}
            />
          ))}
        </div>

        {/* Tools */}
        <div className="flex gap-3 mb-4">
          <div className="relative w-12 ">
            {/* Dustbin Icon Display */}
            <button
              onClick={() => {
                setIsBinActive(true); // Toggle bin active state
                clearCanvas(); // Clear the canvas when clicked
                setIsFillActive(false); // Deselect fill tool
                setIsPencilActive(false); // Deselect pencil tool
                setIsErasing(false); // Deselect eraser
              }}
              className={`absolute inset-y-0 left-0 flex items-center cursor-pointer border rounded-lg p-3 ${
                isBinActive ? "bg-[#6F0081] text-white" : "bg-[#FBE6FF]"
              }`}
            >
              <RiDeleteBin2Fill className="text-lg" />
            </button>
          </div>

          <div className="relative w-12 ">
            {/* Fill Color Icon Display */}
            <button
              onClick={() => {
                setIsFillActive(true);
                setIsPencilActive(false);
                setIsErasing(false);
                setIsBinActive(false);
              }}
              className={`absolute inset-y-0 left-0 flex items-center cursor-pointer border rounded-lg p-3 ${
                isFillActive ? "bg-[#6F0081] text-white" : "bg-[#FBE6FF]"
              }`}
            >
              <FaFillDrip className="text-lg" />
            </button>
          </div>

          <div className="relative w-12 ">
            {/* Pencil Icon Display */}
            <button
              onClick={() => {
                setIsPencilActive(true);
                setIsFillActive(false);
                setIsBinActive(false);
                setIsErasing(false);
                setBrushSize(0.5); // Thin like a real pencil
              }}
              className={`absolute inset-y-0 left-0 flex items-center cursor-pointer border rounded-lg p-3 ${
                isPencilActive ? "bg-[#6F0081] text-white" : "bg-[#FBE6FF]"
              }`}
            >
              <FaPencilAlt className="text-lg" />
            </button>
          </div>

          <div className="relative w-12 ">
            {/* Brush Icon Display */}
            <button
              onClick={() => {
                setIsPencilActive(false);
                setIsErasing(false);
                setIsFillActive(false);
                setIsBinActive(false);
              }}
              className={`absolute inset-y-0 left-0 flex items-center  border rounded-lg p-3 ${
                !isPencilActive && !isFillActive && !isErasing
                  ? "bg-[#6F0081] text-white"
                  : "bg-[#FBE6FF]"
              }`}
            >
              <FaPaintBrush className="text-xl" />
            </button>

            {/* Hidden and functioning Dropdown */}
            <select
              value={brushSize}
              onChange={(e) => {
                setIsPencilActive(false);
                setIsFillActive(false);
                setIsBinActive(false);
                setBrushSize(Number(e.target.value));
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            >
              <option value={2}>Thin</option>
              <option value={5}>Medium</option>
              <option value={10}>Thick</option>
            </select>
          </div>

          <button
            onClick={() => {
              setIsErasing(false);
              setIsBinActive(false);
            }}
            className={`px-6 py-2 rounded-md ${
              isErasing ? "bg-[#FBE6FF]" : "bg-[#6F0081] text-white"
            }`}
          >
            Draw
          </button>
          <button
            onClick={() => {
              setIsFillActive(false); // Deselect Fill
              setIsPencilActive(false); // Deselect Pencil
              setIsErasing(true);
            }}
            className={`px-6 py-2 rounded-md ${
              isErasing ? "bg-[#6F0081] text-white" : "bg-[#FBE6FF]"
            }`}
          >
            Erase
          </button>
        </div>

        {/*  Responsive Drawing Canvas */}
        <div className="relative w-[90%] max-w-[1200px]">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onClick={(e) => {
              if (isFillActive) {
                const { offsetX, offsetY } = getScaledCoords(e);
                const ctx = contextRef.current;
                const targetColor = ctx.getImageData(offsetX, offsetY, 1, 1)
                  .data;
                const fillColor = hexToRgb(color);

                if (!colorMatch(targetColor, fillColor)) {
                  floodFill(offsetX, offsetY, targetColor, fillColor);
                }
              }
            }}
            style={{ cursor: isFillActive ? "pointer" : "crosshair" }}
            className="border-black border-2 w-full"
          />

          {/*  Eraser Cursor */}
          {isErasing && (
            <div
              className="absolute border border-black bg-white opacity-80"
              style={{
                width: `${brushSize * 4}px`, // Make eraser more visible
                height: `${brushSize * 4}px`,
                top: `${eraserPosition.y + 10}px`,
                left: `${eraserPosition.x + 10}px`,
                transform: "translate(-50%, -50%)",
                position: "absolute",
                pointerEvents: "none",
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;
