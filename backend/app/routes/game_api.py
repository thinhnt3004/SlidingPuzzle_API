from flask import Blueprint, jsonify, request
from app.models.game import SlidingPuzzleGame

api_bp = Blueprint('game_api', __name__)
current_game = SlidingPuzzleGame()

@api_bp.route('/new-game', methods=['POST']) # Đổi thành POST để gửi dữ liệu dễ hơn
def start_new_game():
    # Nhận độ khó từ Frontend gửi lên (mặc định là 3)
    data = request.get_json() or {}
    level = data.get('level', 3) 
    
    current_game.reset_game(int(level))
    current_game.shuffle() # Tự động xáo trộn theo độ khó
    
    return jsonify({"message": "New game started", "data": current_game.get_data()}), 200

# ... (Các hàm /state, /move, /swap GIỮ NGUYÊN KHÔNG CẦN SỬA) ...
# Chỉ cần đảm bảo copy lại các hàm đó vào dưới đây nếu bạn xóa sạch file
@api_bp.route('/state', methods=['GET'])
def get_game_state():
    return jsonify({"data": current_game.get_data()}), 200

@api_bp.route('/move', methods=['POST'])
def move_tile():
    payload = request.get_json()
    if not payload or 'direction' not in payload:
        return jsonify({"valid": False, "message": "Missing direction"}), 400
    
    direction = payload['direction'].upper()
    success, msg = current_game.make_move(direction)
    
    if success:
        return jsonify({"valid": True, "data": current_game.get_data()}), 200
    else:
        return jsonify({"valid": False, "message": msg}), 400

@api_bp.route('/swap', methods=['POST'])
def swap_tiles_api():
    payload = request.get_json()
    if not payload or 'pos1' not in payload or 'pos2' not in payload:
        return jsonify({"valid": False, "message": "Thiếu tọa độ"}), 400
    
    r1, c1 = payload['pos1']
    r2, c2 = payload['pos2']
    
    success, msg = current_game.swap_two_tiles(r1, c1, r2, c2)
    
    if success:
        return jsonify({"valid": True, "data": current_game.get_data()}), 200
    else:
        return jsonify({"valid": False, "message": msg}), 400