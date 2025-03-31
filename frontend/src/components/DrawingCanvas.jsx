import React, { useEffect, useRef, useState } from "react";
import { FaPaintBrush, FaPencilAlt } from "react-icons/fa";

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [isErasing, setIsErasing] = useState(false);
  const [eraserPosition, setEraserPosition] = useState({ x: -100, y: -100 });
  const [isPencilActive, setIsPencilActive] = useState(false);

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#808080",
  ];

  // 📏 Function to dynamically set canvas size
  const setCanvasSize = () => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement; // Get parent container

    // Set canvas width to 90% of the screen width, and maintain aspect ratio
    canvas.width = parent.clientWidth * 0.9;
    canvas.height = canvas.width * 0.6; // Maintain aspect ratio (adjust as needed)

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;
  };

  // 🖌️ Initial Setup & Resize Handling
  useEffect(() => {
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize); // Update canvas on window resize
    return () => window.removeEventListener("resize", setCanvasSize);
  }, []);

  // ✏️ Handle Brush & Eraser Mode
  useEffect(() => {
    const ctx = contextRef.current;
    if (!ctx) return;
    if (isErasing) {
      contextRef.current.globalCompositeOperation = "destination-out";
      contextRef.current.lineWidth = brushSize * 2;
    } else {
      contextRef.current.globalCompositeOperation = "source-over";
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = isPencilActive ? 0.5 : brushSize; // Apply pencil size
    }
  }, [color, brushSize, isErasing, isPencilActive]);

  // ✍️ Start Drawing
  const startDrawing = (e) => {
    const { offsetX, offsetY } = getScaledCoords(e);
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  // 🖋️ Draw on Canvas
  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getScaledCoords(e);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  // 🛑 Stop Drawing
  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  // 📍 Function to Scale Mouse Coordinates Based on Canvas Size
  const getScaledCoords = (e) => {
    const canvas = canvasRef.current;
    const scaleX = canvas.width / canvas.offsetWidth;
    const scaleY = canvas.height / canvas.offsetHeight;
    return {
      offsetX: e.nativeEvent.offsetX * scaleX,
      offsetY: e.nativeEvent.offsetY * scaleY,
    };
  };

  return (
    <div className="flex flex-col items-center mt-5 w-full">
      {/* 🎨 Color Palette */}
      <div className="flex gap-2 mb-4 p-2 bg-[#FBE6FF]">
        {colors.map((paletteColor) => (
          <button
            key={paletteColor}
            onClick={() => {
              setColor(paletteColor);
              setIsErasing(false);
            }}
            className={`w-8 h-8 rounded-2xl ${
              color === paletteColor ? "border-black" : "border-gray-300"
            }`}
            style={{ backgroundColor: paletteColor }}
          />
        ))}
      </div>

      {/* 🛠️ Tools */}
      <div className="flex gap-3 mb-4">
        <div className="relative w-12 ">
          {/* 🎨 Brush Icon Display */}
          <button
            onClick={() => {
              setIsPencilActive(true);
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
          {/* 🎨 Brush Icon Display */}
          <div
            className={`absolute inset-y-0 left-0 flex items-center  border rounded-lg p-3 ${
              isPencilActive ? "bg-[#FBE6FF]" : "bg-[#6F0081] text-white"
            }`}
          >
            <FaPaintBrush className="text-xl" />
          </div>

          {/* 🎛️ Hidden Dropdown but still functional */}
          <select
            value={brushSize}
            onChange={(e) => {
              setIsPencilActive(false);
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
          onClick={(e) => {
            setIsErasing(false);
          }}
          className={`px-6 py-2 rounded-md ${
            isErasing ? "bg-[#FBE6FF]" : "bg-[#6F0081] text-white"
          }`}
        >
          Draw
        </button>
        <button
          onClick={() => {
            setIsErasing(true);
            setIsPencilActive(false);
          }}
          className={`px-6 py-2 rounded-md ${
            isErasing ? "bg-[#6F0081] text-white" : "bg-[#FBE6FF]"
          }`}
        >
          Erase
        </button>
      </div>

      {/* 🖌️ Responsive Drawing Canvas */}
      <div className="relative w-[90%] max-w-[1200px]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={(e) => {
            draw(e);
            if (isErasing) {
              const { offsetX, offsetY } = getScaledCoords(e);
              setEraserPosition({ x: offsetX, y: offsetY });
            }
          }}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{
            cursor: isPencilActive
              ? "default" // Correct path
              : "crosshair",
          }}
          className="border-black border-2 w-full"
        ></canvas>

        {/* 🧽 Eraser Cursor */}
        {isErasing && (
          <div
            className="absolute border border-black bg-white opacity-80"
            style={{
              width: brushSize * 2,
              height: brushSize * 2,
              border: 2,
              top: `${eraserPosition.y}`,
              left: `${eraserPosition.x}`,
              // transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default DrawingCanvas;
