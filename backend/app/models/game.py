import random
import copy

class SlidingPuzzleGame:
    def __init__(self):
        self.size = 3
        self.reset_game(3)

    def reset_game(self, size=3):
        self.size = size
        self.GOAL_STATE = []
        count = 1
        for r in range(size):
            row = []
            for c in range(size):
                if r == size - 1 and c == size - 1:
                    row.append(0)
                else:
                    row.append(count)
                    count += 1
            self.GOAL_STATE.append(row)
        
        self.board = copy.deepcopy(self.GOAL_STATE)
        self.empty_pos = (size - 1, size - 1)
        self.moves_count = 0
        self.is_solved = True

    def get_data(self):
        return {
            "board": self.board,
            "moves": self.moves_count,
            "is_solved": self.board == self.GOAL_STATE,
            "size": self.size
        }

    def shuffle(self, steps=None):
        if steps is None:
            steps = self.size * 20
        actions = ['UP', 'DOWN', 'LEFT', 'RIGHT']
        for _ in range(steps):
            move = random.choice(actions)
            self.make_move(move)
        self.moves_count = 0 
        self.is_solved = False

    def make_move(self, direction):
        r, c = self.empty_pos
        nr, nc = r, c

        if direction == 'UP': nr += 1
        elif direction == 'DOWN': nr -= 1
        elif direction == 'LEFT': nc += 1
        elif direction == 'RIGHT': nc -= 1
        else:
            return False, "Invalid direction"

        if 0 <= nr < self.size and 0 <= nc < self.size:
            self.board[r][c], self.board[nr][nc] = self.board[nr][nc], self.board[r][c]
            self.empty_pos = (nr, nc)
            self.moves_count += 1
            return True, "Success"
        return False, "Hit wall"

    def swap_two_tiles(self, r1, c1, r2, c2):
        if not (0 <= r1 < self.size and 0 <= c1 < self.size and 0 <= r2 < self.size and 0 <= c2 < self.size):
            return False, "Tọa độ không hợp lệ"

        dist = abs(r1 - r2) + abs(c1 - c2)
        if dist == 1:
            self.board[r1][c1], self.board[r2][c2] = self.board[r2][c2], self.board[r1][c1]
            self.moves_count += 1
            
            if self.board[r1][c1] == 0: self.empty_pos = (r1, c1)
            if self.board[r2][c2] == 0: self.empty_pos = (r2, c2)
            return True, "Success"
        else:
            return False, "Chỉ được đổi 2 ô nằm cạnh nhau!"