---
title: "Zombies"
layout: "layouts/game.html"
heading: "Zombies"
canvasId: "zombiesCanvas"
scripts: ["zombies.js"]
newGameId: "zombiesNewGame"
gameButtons: [
  {
    "label": "Move Zombies",
    "id": "moveZombiesButton"
  },
  {
    "label": "Move Humans",
    "id": "moveHumansButton"
  }
]
gameLabels: [
  {
    "id": "entities"
  }
]
---
This is a Zombie Apocalypse simulator. Zombies, humans and obstacles can be added to squares in the grid.

When an entity is moved, the sim uses a Breadth First Search of the grid to computer a distance field from the specified entity (on moving the humans, the zombie distance field is computed, when moving the zombies, the human distance field is computed).

A move is then selected from each entity's possible moves (humans can move in 8 directions: N, NE, E, SE, S, SW, W, NW, zombies in 4: N, E, S, W). Zombies choose the move that gets them closest to a human, humans flee the zombies.

If a zombie catches a human (or a group catches a group of humans), the caught humans become zombies.