'use client';
import { useEffect, useRef, useState} from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";


const LEVEL_CONFIGS = {
  "1": { 
    rows: 5, cols: 8, speed: 4, 
    colors: ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#0ea5e9", "#10b981", "#f59e0b", "#ff007f", "#00ffff", "#ff00ff", "#7fff00", "#ff7f00", "#9932cc", "#00ff7f"] 
  },
  
  "2": { 
    rows: 6, cols: 10, speed: 4.3, 
    colors: ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#a855f7", "#0ea5e9", "#10b981", "#f59e0b", "#ff007f", "#00ffff", "#ff00ff", "#7fff00", "#ff7f00", "#9932cc", "#00ff7f"] 
  },
  "3": { 
    rows: 8, cols: 10, speed: 4.5, 
    colors: ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#a855f7", "#ec4899", "#0ea5e9", "#10b981", "#f59e0b", "#ff007f", "#00ffff", "#ff00ff", "#7fff00", "#ff7f00", "#9932cc", "#00ff7f"] 
  },
  "4": { 
    rows: 10, cols: 10, speed: 4.9,
    colors: ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#a855f7", "#ec4899", "#f97316", "#0ea5e9", "#10b981", "#f59e0b", "#ff007f", "#00ffff", "#ff00ff", "#7fff00", "#ff7f00", "#9932cc", "#00ff7f"] 
  },
  "5": { 
    rows: 10, cols: 12, speed: 4.7, 
    colors: ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#a855f7", "#ec4899", "#f97316", "#0ea5e9", "#10b981", "#f59e0b", "#ff007f", "#00ffff", "#ff00ff", "#7fff00", "#ff7f00", "#9932cc", "#00ff7f"] 
  },
  "6": { 
    rows: 10, cols: 14, speed: 5.3, 
    colors: ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#a855f7", "#ec4899", "#f97316", "#0ea5e9", "#10b981", "#f59e0b", "#ff007f", "#00ffff", "#ff00ff", "#7fff00", "#ff7f00", "#9932cc", "#00ff7f"] 
  },
  "7": { 
    rows: 10, cols: 16, speed: 5.9, 
    colors: ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#a855f7", "#ec4899", "#f97316", "#0ea5e9", "#10b981", "#f59e0b", "#ff007f", "#00ffff", "#ff00ff", "#7fff00", "#ff7f00", "#9932cc", "#00ff7f"] 
  },
  "8": { 
    rows: 10, cols: 18, speed: 6.2,
    colors: ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#a855f7", "#ec4899", "#f97316", "#0ea5e9", "#10b981", "#f59e0b", "#ff007f", "#00ffff", "#ff00ff", "#7fff00", "#ff7f00", "#9932cc", "#00ff7f"] 
  },
  "9": { 
    rows: 10, cols: 20, speed: 6.9, 
    colors: ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#a855f7", "#ec4899", "#f97316", "#0ea5e9", "#10b981", "#f59e0b", "#ff007f", "#00ffff", "#ff00ff", "#7fff00", "#ff7f00", "#9932cc", "#00ff7f"] 
  },
}


export default function gameplayPage() {
  const resolvedParams = useParams();
  const levelId = resolvedParams.id;
  const config = LEVEL_CONFIGS[levelId] || LEVEL_CONFIGS["1"];

  const FIELD_WIDTH = 480;
  const FIELD_HEIGHT = 480;
  const PADDLE_WIDTH = 80;
  const PADDLE_HEIGHT = 16;
  const BALL_SIZE = 16;

  const fieldRef = useRef(null);
  const [gameState, setGameState] = useState("ready");
  const [paddleX, setPaddleX] = useState((FIELD_WIDTH - PADDLE_WIDTH) / 2);
  const [ball, setBall] = useState({ x: FIELD_WIDTH / 2 - BALL_SIZE / 2, y: FIELD_HEIGHT - 40 });
  const [bricks, setBricks] = useState([]);

  
  const paddleXRef = useRef(paddleX);
  const ballRef = useRef(ball);
  const bricksRef = useRef(bricks);
  const gameStateRef = useRef(gameState);
  const velocityRef = useRef({ dx: 0, dy: 0 });

  useEffect(() => { paddleXRef.current = paddleX; }, [paddleX]);
  useEffect(() => { ballRef.current = ball; }, [ball]);
  useEffect(() => { bricksRef.current = bricks; }, [bricks]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const initGameData = () => {
    setPaddleX((FIELD_WIDTH - PADDLE_WIDTH) / 2);
    setBall({ x: FIELD_WIDTH / 2 - BALL_SIZE / 2, y: FIELD_HEIGHT - 40 });
    velocityRef.current = {
      dx: config.speed * (Math.random() > 0.5 ? 1 : -1),
      dy: -config.speed
    };

    const brickPadding = 4;
    const brickOffsetTop = 15;
    const brickOffsetLeft = 10;
    const availableWidth = FIELD_WIDTH - (brickOffsetLeft * 2);
    const brickWidth = (availableWidth - (brickPadding * (config.cols - 1))) / config.cols;
    const brickHeight = 18;

    const newBricks = [];
    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        newBricks.push({
          id: `brick-${r}-${c}`,
          x: c * (brickWidth + brickPadding) + brickOffsetLeft,
          y: r * (brickHeight + brickPadding) + brickOffsetTop,
          width: brickWidth,
          height: brickHeight,
          status: 1,
          color: config.colors[r % config.colors.length]
        });
      }
    }
    setBricks(newBricks);
  };

  useEffect(() => {
    initGameData();
  }, [levelId, config]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!fieldRef.current) return;
      const rect = fieldRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      if (relativeX > 0 && relativeX < FIELD_WIDTH) {
        setPaddleX(Math.max(0, Math.min(FIELD_WIDTH - PADDLE_WIDTH, relativeX - PADDLE_WIDTH / 2)));
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let frameId;

    const tick = () => {
      if (gameStateRef.current !== "playing") return;

      let { x, y } = ballRef.current;
      let { dx, dy } = velocityRef.current;
      const currentBricks = [...bricksRef.current];

      if (x + dx <= 0 || x + dx >= FIELD_WIDTH - BALL_SIZE) dx = -dx;
      if (y + dy <= 0) dy = -dy;

      const paddleTopY = FIELD_HEIGHT - PADDLE_HEIGHT - 10;
      if (y + BALL_SIZE + dy >= paddleTopY && y + dy <= paddleTopY + PADDLE_HEIGHT) {
        const curPaddleX = paddleXRef.current;
        if (x + BALL_SIZE >= curPaddleX && x <= curPaddleX + PADDLE_WIDTH) {
          const hitPos = ((x + BALL_SIZE / 2) - (curPaddleX + PADDLE_WIDTH / 2)) / (PADDLE_WIDTH / 2);
          dx = hitPos * config.speed;
          dy = -Math.abs(dy);
        }
      }
    
      if (y + dy >= FIELD_HEIGHT - BALL_SIZE) {
        setGameState("lost");
        return;
      }

      let brickHitOccurred = false;
      let updatedBricks = currentBricks.map(b => {
        if (b.status === 0) return b;

        const ballLeft = x + dx;
        const ballRight = x + dx + BALL_SIZE;
        const ballTop = y + dy;
        const ballBottom = y + dy + BALL_SIZE;

        if (ballRight > b.x && ballLeft < b.x + b.width && ballBottom > b.y && ballTop < b.y + b.height) {
          if (!brickHitOccurred) {
            dy = -dy;
            brickHitOccurred = true;
          }
          return { ...b, status: 0 };
        }
        return b;
      });

      const activeBricks = updatedBricks.filter(b => b.status === 1);
      if (activeBricks.length === 0) {
        setGameState("won");
        return;
      }
      velocityRef.current = { dx, dy };
      setBall({ x: x + dx, y: y + dy });
      if (brickHitOccurred) setBricks(updatedBricks);

      frameId = requestAnimationFrame(tick);
    };

    if (gameState === "playing") {
      frameId = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(frameId);
  }, [gameState]);

  const handleStartGame = () => {
    initGameData();
    setGameState("playing");
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#020617',
      padding: '24px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      boxSizing: 'border-box'
    }}>
      <div style={{ marginBottom: '16px', textAlign: 'center' ,}}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', letterSpacing: '-0.025em', margin: 0 }}>
          Level {levelId}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px', marginBottom: 0 }}>
          Move the mouse
        </p>
      </div>

      <div 
        ref={fieldRef}
        style={{ 
          position: 'relative',
          width: `${FIELD_WIDTH}px`, 
          height: `${FIELD_HEIGHT}px`,
          borderLeft: '4px solid #334155',   // Slate gray boundary left
          borderRight: '4px solid #334155',  // Slate gray boundary right
          borderTop: '4px solid #334155',
          borderBottom:'4px solid #334155'
        }}
      >
          {bricks.map((brick) => brick.status === 1 && (
          <div
            key={brick.id}
            style={{
              position: 'absolute',
              left: `${brick.x}px`,
              top: `${brick.y}px`,
              width: `${brick.width}px`,
              height: `${brick.height}px`,
              backgroundColor: brick.color,
              borderRadius: '2px',
              border: '1px solid rgba(0, 0, 0, 0.3)',
              boxSizing: 'border-box'
            }}
          />
        ))}

      
        <div
          style={{
            position: 'absolute',
            left: `${paddleX}px`,
            top: `${FIELD_HEIGHT - PADDLE_HEIGHT - 10}px`,
            width: `${PADDLE_WIDTH}px`,
            height: `${PADDLE_HEIGHT}px`,
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: `${ball.x}px`,
            top: `${ball.y}px`,
            width: `${BALL_SIZE}px`,
            height: `${BALL_SIZE}px`,
            backgroundColor: '#ff3b30',
            borderRadius: '50%',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
          }}
        />
        {gameState !== "playing" && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(4px)',
            borderRadius: '4px',
            border: '1px solid routerServerGlobal(0,0,0,0.3)',
          }}>
            {gameState === "ready" && (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>Ready to Play?</h3>
                <Button onClick={handleStartGame} size="lg">Start Level</Button>
              </div>
            )}
            {gameState === "lost" && (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '16px' }}>Game Over</h3>
                <Button onClick={handleStartGame} size="lg">Try Again</Button>
              </div>
            )}
            {gameState === "won" && (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8209b9', marginBottom: '16px' }}>Level Cleared!</h3>
                <Link href={`/games/breakout/levels/${parseInt(levelId) + 1}`}>
                  <Button size="lg">Next Level</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '24px' }}>
        <Link href="/games/breakout/levels">
          <Button variant="outline">Back to Levels</Button>
        </Link>
      </div>
    </div>
  );
}