

 ## Escape plan Group 13
 
 
 - Multiplayer game 
 - using express framework with socket.io for backend part(Server)
 - using React framework for frontend part (escapeplan-frontend folder)
 
 
 ## Feature 

 - The server program shows the number of concurrent clients and clients that are
online.
 -  In the 5x5 blocks of the map in this game, there are 3 types of blocks including 19 free
blocks, 5 obstacle blocks (or 20% of map size) and 1 tunnel block. Moreover, there are
two characters in the game including a warder and a prisoner.
 -  Every free block must be accessible. The warder and the prisoner cannot access the
obstacle blocks and only the prisoner can access the tunnel block.
 -  When the game starts, the server places all the blocks randomly and then places the
characters randomly in the free blocks. 
 -  The server picks a character randomly for a player. The player who becomes the
warder will start to move first.
 -  For each turn, the players have only 10 seconds to move their characters to one of
the adjacent blocks
 -  If the warder accesses to the same block of the prisoner, the player who plays the
warder will win. On the other hand, if the prisoner accesses the tunnel block, the
player who plays the prisoner will win.
 -  The game then pops up the winner's name and the current scores of both of the
players. The winner will be the first player for the next game.
 -  The server has a reset button to reset the game and the players' scores. 


