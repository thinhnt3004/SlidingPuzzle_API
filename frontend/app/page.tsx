'use client';

import { useState, useEffect } from 'react';

// --- INTERFACE ---
interface GameState {
  board: number[][];
  moves: number;
  is_solved: boolean;
  size: number;
}

interface ApiResponse {
  message?: string;
  valid?: boolean;
  data: GameState;
}

type Position = [number, number];
const API_URL = 'http://127.0.0.1:5000/api';

export default function Home() {
  // State quản lý màn hình
  const [inMenu, setInMenu] = useState<boolean>(true); // Mặc định vào là thấy Menu

  const [board, setBoard] = useState<number[][]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);

  // Hàm bắt đầu game với độ khó (level = kích thước)
  const startGame = async (level: number) => {
    setLoading(true);
    setSelectedPos(null);
    try {
      const res = await fetch(`${API_URL}/new-game`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: level }) // Gửi độ khó lên server
      });
      
      if (!res.ok) throw new Error("Lỗi Server");
      const data: ApiResponse = await res.json();
      
      updateGameState(data.data);
      setInMenu(false); // Tắt Menu, chuyển sang màn hình chơi
    } catch (error) {
      console.error(error);
      alert("Không kết nối được Server!");
    } finally {
      setLoading(false);
    }
  };

  const updateGameState = (data: GameState) => {
    setBoard(data.board);
    setMoves(data.moves);
    setIsSolved(data.is_solved);
  };

  const handleTileClick = async (r: number, c: number) => {
    if (isSolved) return;
    if (selectedPos === null) {
      setSelectedPos([r, c]);
      return;
    }
    const [prevR, prevC] = selectedPos;
    if (prevR === r && prevC === c) {
      setSelectedPos(null);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/swap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pos1: [prevR, prevC], pos2: [r, c] }),
      });
      const result: ApiResponse = await res.json();
      if (result.valid) {
        updateGameState(result.data);
        setSelectedPos(null);
      } 
    } catch (error) { console.error("Lỗi swap:", error); }
  }
  const backToMenu = () => {
    setInMenu(true);
    setIsSolved(false);
  };

  if (inMenu) {
    return (
      <main className="game-container">
        <h1 style={{ fontSize: '3rem', marginBottom: '40px' }}>🧩 Sliding Puzzle</h1>
        <p style={{ marginBottom: '20px' }}>Chọn mức độ khó:</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button className="btn" onClick={() => startGame(3)} style={{ backgroundColor: '#4CAF50' }}>
            Dễ (3x3)
          </button>
          <button className="btn" onClick={() => startGame(4)} style={{ backgroundColor: '#FF9800' }}>
            Vừa (4x4)
          </button>
          <button className="btn" onClick={() => startGame(5)} style={{ backgroundColor: '#f44336' }}>
            Khó (5x5)
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="game-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '10px' }}>
        <button onClick={backToMenu} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}>
           ⬅ Menu
        </button>
        <h1>Level {board.length}x{board.length}</h1>
        <div style={{ width: '50px' }}></div> {/* Spacer */}
      </div>
      
      {/* Grid động theo kích thước bàn cờ */}
      <div 
        className="grid" 
        style={{ 
          gridTemplateColumns: `repeat(${board.length}, 80px)` // Tự động chia cột
        }}
      >
        {loading ? <p>Đang tạo màn chơi...</p> : board.map((row, rIndex) => (
          row.map((num, cIndex) => {
            const isSelected = selectedPos?.[0] === rIndex && selectedPos?.[1] === cIndex;
            return (
              <div 
                key={`${rIndex}-${cIndex}`} 
                className={`tile ${num === 0 ? 'empty' : ''} ${isSelected ? 'selected' : ''}`}
                style={{ width: '80px', height: '80px', fontSize: '2rem' }} // Thu nhỏ xíu cho vừa màn hình nếu size lớn
                onClick={() => handleTileClick(rIndex, cIndex)}
              >
                {num !== 0 ? num : ''}
              </div>
            );
          })
        ))}
      </div>

      <div className="info">
        <p>Số bước: <strong>{moves}</strong></p>
        {isSolved && <p className="win-msg">🏆 CHIẾN THẮNG! 🏆</p>}
      </div>

      {isSolved && (
        <button className="btn" onClick={backToMenu} style={{ marginTop: '20px' }}>
          Chọn màn khác
        </button>
      )}
    </main>
  );
}