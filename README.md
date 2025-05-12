# CSE 604 - Artificial Intelligence Project

# MinichessAI

## Overview

**MinichessAI** is an intelligent chess engine designed for the exciting 6x5 Minichess variant—a fast-paced, compact version of the classic game. This project challenges the boundaries of artificial intelligence and game theory by building an AI that can compete with both human and computer opponents. The core objective is to apply advanced algorithms to strategic gameplay while providing a seamless and interactive user experience.

---

## Project Highlights

- **Smart Game Tree Search:** Efficient navigation and exploration of possible game states using optimized search techniques.
- **Minimax with Alpha-Beta Pruning:** Powerful move selection powered by the minimax algorithm, enhanced with alpha-beta pruning to drastically reduce unnecessary computations.
- **Dynamic Evaluation Function:** A carefully crafted evaluation function assesses board positions to guide the AI’s strategy at every step.
- **Early Termination Mechanism:** The AI can intelligently halt its search when certain criteria are met, ensuring timely and responsive gameplay.
- **Intuitive User Interface:** Play Minichess against the AI through an easy-to-use interface, with graphical enhancements encouraged for a richer experience.
- **Robust Version Control:** All work is tracked via Git, enabling collaboration, reproducibility, and transparency.

---

## Features

### 🔍 Search Algorithm
- Explore the game tree with depth-limited search, balancing speed and foresight.

### ♟️ Minimax Decision-Making
- Employ the minimax algorithm to anticipate opponent moves and select the most promising strategy.

### ✂️ Alpha-Beta Pruning
- Improve efficiency by pruning branches that cannot influence the outcome, allowing deeper search within the same time frame.

### 📈 Evaluation Function
- Quantify the strength of a given board state using piece values, positional factors, and dynamic heuristics.

### 🛑 Early Stopping
- Return the best move so far if a time constraint, forced mate, or other early stop condition is detected.

### 🖥️ User Interface
- Engage with the AI through a simple command-line or graphical UI. Enhanced graphics/UI features are welcome for extra credit and user enjoyment.

### 🗂️ Version Control
- All code, documentation, and assets are managed in a Git repository for easy tracking and collaboration.

---

## Goals

- Build a competitive Minichess AI that challenges human and AI opponents.
- Demonstrate mastery of game tree search, minimax, and alpha-beta pruning.
- Design a robust, insightful evaluation function for board analysis.
- Provide a user-friendly platform for playing and testing Minichess.
- Maintain clear, well-documented code and project history via Git.

---

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Tashrif-007/MiniChessAI.git
   ```
2. **Install Requirements**
   ```bash
   pip install -r requirements.txt
   ```
3. **Run the Game**
   ```bash
   python main.py
   ```
4. **Play and Enjoy!**
   - Interact with the AI via the provided UI.
   - Experiment with different strategies and difficulty levels.


