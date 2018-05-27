var selection  = {x:0, y:0};
var current    = {x:0, y:0};
var curBlack   = {x:0, y:0};
var wiKingPos  = {x:7, y:3};
var blKingPos  = {x:0, y:3};

var prevBoardStack = [];
var turnNumber = 1;

var rockadeWhiteLeft  = true;
var rockadeWhiteRight = true;
var rockadeBlackLeft  = true;
var rockadeBlackRight = true;

var enPassant = -1; //columb of en passant (-1 = not possible)

var takenWhite = "none";
var takenBlack = "none";
var movesList  = [];

var valueMap   = {WhiteTower  : 500,
                  WhiteKnight : 320,
                  WhiteBishup : 330,
                  WhiteKing   : 5000,
                  WhiteQueen  : 900,
                  WhitePawn   : 100,
                  BlackTower  : -500,
                  BlackKnight : -320,
                  BlackBishup : -330,
                  BlackKing   : -5000,
                  BlackQueen  : -900,
                  BlackPawn   : -100,
                  none        : 0
};

//--- draw functions ----------------------------------------------------------------------
function whiteKing(x, y) {
    canvas.beginPath();
    canvas.fillStyle = "White";
    canvas.font = c.width/8 + "px Arial";
    canvas.fillText(String.fromCharCode(9818), x*c.width/8 + c.width/300 ,y*c.width/8 + (c.width*9)/80);
}

function whiteQueen(x, y) {
    canvas.beginPath();
    canvas.fillStyle = "White";
    canvas.font = c.width/8 + "px Arial";
    canvas.fillText(String.fromCharCode(9819), x*c.width/8 + c.width/300 ,y*c.width/8 + (c.width*9)/80);
}

function whiteTower(x, y) {
    canvas.beginPath();
    canvas.fillStyle = "White";
    canvas.font = c.width/8 + "px Arial";
    canvas.fillText(String.fromCharCode(9820), x*c.width/8 + c.width/300 ,y*c.width/8 + (c.width*9)/80);
}

function whiteBishup(x, y) {
    canvas.beginPath();
    canvas.fillStyle = "White";
    canvas.font = c.width/8 + "px Arial";
    canvas.fillText(String.fromCharCode(9821), x*c.width/8 + c.width/300 ,y*c.width/8 + (c.width*9)/80);
}

function whiteKnight(x, y) {
    canvas.beginPath();
    canvas.fillStyle = "White";
    canvas.font = c.width/8 + "px Arial";
    canvas.fillText(String.fromCharCode(9822), x*c.width/8 + c.width/300 ,y*c.width/8 + (c.width*9)/80);
}

function whitePawn(x, y) {
    canvas.beginPath();
    canvas.fillStyle = "White";
    canvas.font = c.width/8 + "px Arial";
    canvas.fillText(String.fromCharCode(9823), x*c.width/8 + c.width/300  ,y*c.width/8 + (c.width*9)/80);
}

function blackKing(x, y) {
    canvas.beginPath();
    canvas.fillStyle = "Black";
    canvas.font = c.width/8 + "px Arial";
    canvas.fillText(String.fromCharCode(9818), x*c.width/8 + c.width/300 ,y*c.width/8 + (c.width*9)/80);
}

function blackQueen(x, y) {
    canvas.beginPath();
    canvas.fillStyle = "Black";
    canvas.font = c.width/8 + "px Arial";
    canvas.fillText(String.fromCharCode(9819), x*c.width/8 + c.width/300 ,y*c.width/8 + (c.width*9)/80);
}

function blackTower(x, y) {
    canvas.beginPath();
    canvas.fillStyle = "Black";
    canvas.font = c.width/8 + "px Arial";
    canvas.fillText(String.fromCharCode(9820), x*c.width/8 + c.width/300 ,y*c.width/8 + (c.width*9)/80);
}

function blackBishup(x, y) {
    canvas.beginPath();
    canvas.fillStyle = "Black";
    canvas.font = c.width/8 + "px Arial";
    canvas.fillText(String.fromCharCode(9821), x*c.width/8 + c.width/300 ,y*c.width/8 + (c.width*9)/80);
}

function blackKnight(x, y) {
    canvas.beginPath();
    canvas.fillStyle = "Black";
    canvas.font = c.width/8 + "px Arial";
    canvas.fillText(String.fromCharCode(9822), x*c.width/8 + c.width/300 ,y*c.width/8 + (c.width*9)/80);
}

function blackPawn(x, y) {
    canvas.beginPath();
    canvas.fillStyle = "Black";
    canvas.font = c.width/8 + "px Arial";
    canvas.fillText(String.fromCharCode(9823), x*c.width/8 + c.width/300 ,y*c.width/8 + (c.width*9)/80);
}

function paintPiece(i, j) {
  if(field[i][j].piece == "WhiteKing") {
    whiteKing(j, i);
  } else if(field[i][j].piece == "WhiteQueen") {
    whiteQueen(j, i);
  } else if(field[i][j].piece == "WhiteTower") {
    whiteTower(j, i);
  } else if(field[i][j].piece == "WhiteBishup") {
    whiteBishup(j, i);
  } else if(field[i][j].piece == "WhiteKnight") {
    whiteKnight(j, i);
  } else if(field[i][j].piece == "WhitePawn") {
    whitePawn(j, i);
  } else if(field[i][j].piece == "BlackKing") {
    blackKing(j, i);
  } else if(field[i][j].piece == "BlackQueen") {
    blackQueen(j, i);
  } else if(field[i][j].piece == "BlackTower") {
    blackTower(j, i);
  } else if(field[i][j].piece == "BlackBishup") {
    blackBishup(j, i);
  } else if(field[i][j].piece == "BlackKnight") {
    blackKnight(j, i);
  } else if(field[i][j].piece == "BlackPawn") {
    blackPawn(j, i);
  }
}

function paintPieces() {
  for (i = 0; i < 8; i++) {
    for (j = 0; j < 8; j++) {
      paintPiece(i, j);
    }
  }
}

function drawGradiant(x, y) {
  //Posission of field
  canvas.beginPath();
  canvas.rect(y*c.width/8, x*c.width/8, c.width/8, c.width/8);
  
  //Create gradient
  var grd=canvas.createRadialGradient(y*c.width/8+c.width/16, x*c.width/8+c.width/16, 5,
                                      y*c.width/8+c.width/16, x*c.width/8+c.width/16, c.width/16);
  if(white(x, y)) {
    grd.addColorStop(0,"LightGreen");
  } else if(black(x, y)) {
    grd.addColorStop(0,"FireBrick");
  } else {
    grd.addColorStop(0,"LawnGreen");
  }
  grd.addColorStop(1, field[x][y].color);

  //Fill with gradient
  canvas.fillStyle = grd;
  canvas.fill();
}

//--- end of draw functions ---------------------------------------------------------------

//--- test funtions -----------------------------------------------------------------------------------------------------
function white(x, y) {
  if(field[x][y].piece == "WhiteTower" || field[x][y].piece == "WhiteKnight" || field[x][y].piece == "WhiteBishup"
  || field[x][y].piece == "WhiteKing"  || field[x][y].piece == "WhiteQueen"  || field[x][y].piece == "WhitePawn") {
    return true;
  } else {
    return false;
  }
}
       
function black(x, y) {
  if(field[x][y].piece == "BlackTower" || field[x][y].piece == "BlackKnight" || field[x][y].piece == "BlackBishup"
  || field[x][y].piece == "BlackKing"  || field[x][y].piece == "BlackQueen"  || field[x][y].piece == "BlackPawn") {
      return true;
  } else {
    return false;
  }
}
//--- end of test functions -----------------------------------------------------------------------------------------------

//--- legal moves ---------------------------------------------------------------------------------------------------------
function move(startX, startY, endX, endY, real) {
  var moves = legalMoves(startX, startY); //gets list of legal moves
  
  for(x=0; x<moves.length; ++x) {
    if(moves[x][0] == endX && moves[x][1] == endY) { //tests if move is legal
      var newField = new Array(8);
      for(var x = 0;  x < 8; ++x) {
        newField[x] = new Array(8);
        for(var y = 0; y < 8; ++y) {
          newField[x][y] = JSON.parse(JSON.stringify(field[x][y]));
        }
      }
      prevBoardStack.push(newField);
    
      if(white(endX, endY) || field[endX][endY].piece == "none") { //tests if white piece is taken
        takenWhite = field[endX][endY].piece;
      }
      if(black(endX, endY) || field[endX][endY].piece == "none") { //tests if black piece is taken
        takenBlack = field[endX][endY].piece;
      }
      
      if(field[startX][startY].piece == "WhiteKing") {
        wiKingPos.x = endX;
        wiKingPos.y = endY;
      }
      if(field[startX][startY].piece == "BlackKing") {
        blKingPos.x = endX;
        blKingPos.y = endY;
      }
      
      if(field[startX][startY].piece == "WhitePawn" && (endY != startY) && field[endX][endY].piece == "none") { //en passant move white
        field[endX][endY].piece = field[startX][startY].piece;
        field[startX][endY].piece = "none"; //spesial case (en passant)
        field[startX][startY].piece = "none";
        takenBlack = "BlackPawn";
      } else if(field[startX][startY].piece == "BlackPawn" && (endY != startY) && field[endX][endY].piece == "none") { //en passant move black
        field[endX][endY].piece = field[startX][startY].piece;
        field[startX][endY].piece = "none"; //spesial case (en passant)
        field[startX][startY].piece = "none";
        takenWhite = "WhitePawn";
        
      } else if(field[startX][startY].piece == "WhitePawn" && endX == 0) { //white pawn raches goal
        field[endX][endY].piece = "WhitePawn";
        field[startX][startY].piece = "none";
        transform.classList.remove("is-hidden");
      } else if(field[startX][startY].piece == "BlackPawn" && endX == 7) { //black pawn raches goal
        field[endX][endY].piece = "BlackPawn";
        field[startX][startY].piece = "none";
        transform.classList.remove("is-hidden");
      } else { //moves piece normaly
        field[endX][endY].piece = field[startX][startY].piece;
        field[startX][startY].piece = "none";
      }
      //maps piece name to piece sprite
      pieceMap ={WhiteTower  : String.fromCharCode(9814),
                 WhiteKnight : String.fromCharCode(9816),
                 WhiteBishup : String.fromCharCode(9815),
                 WhiteKing   : String.fromCharCode(9812),
                 WhiteQueen  : String.fromCharCode(9813),
                 WhitePawn   : String.fromCharCode(9817),
                 BlackTower  : String.fromCharCode(9820),
                 BlackKnight : String.fromCharCode(9822),
                 BlackBishup : String.fromCharCode(9821),
                 BlackKing   : String.fromCharCode(9818),
                 BlackQueen  : String.fromCharCode(9819),
                 BlackPawn   : String.fromCharCode(9823)
      };
      
      AtoH = {0:"A", 1:"B", 2:"C", 3:"D", 4:"E", 5:"F", 6:"G", 7:"H"}; //maps index to character
      
      takenLog = "";
      if(takenWhite != "none" && !turn) {
        takenLog = "<strike>"+pieceMap[takenWhite]+"</strike>"
      }
      if(takenBlack != "none" && turn) {
        takenLog = "<strike>"+pieceMap[takenBlack]+"</strike>"
      }
      
      if(real) {
        document.getElementById("log").innerHTML = pieceMap[field[endX][endY].piece] + " " + AtoH[startY] + (startX + 1) + String.fromCharCode(8594) + AtoH[endY] + (endX + 1)
                                                 + takenLog +"<br>" + document.getElementById("log").innerHTML;
      }
      
      //dooing the rockade white
      if(field[endX][endY].piece == "WhiteKing" && endY == 1 && startY == 3) { //left
        field[7][2].piece = "WhiteTower";
        field[7][0].piece = "none";
      }
      if(field[endX][endY].piece == "WhiteKing" && endY == 6 && startY == 3) { //right
        field[7][5].piece = "WhiteTower";
        field[7][7].piece = "none";
      }
      
      //dooing the rockade black
      if(field[endX][endY].piece == "BlackKing" && endY == 1 && startY == 3) { //left
        field[0][2].piece = "BlackTower";
        field[0][0].piece = "none";
      }
      if(field[endX][endY].piece == "BlackKing" && endY == 6 && startY == 3) { //right
        field[0][5].piece = "BlackTower";
        field[0][7].piece = "none";
      }
      
      //disabling rockade
      if(field[endX][endY].piece == "WhiteKing") {
        rockadeWhiteLeft  = false;
        rockadeWhiteRight = false;
      }
      if(field[endX][endY].piece == "WhiteTower" && startY == 0) {
        rockadeWhiteLeft = false;
      }
      if(field[endX][endY].piece == "WhiteTower" && startY == 7) {
        rockadeWhiteRight = false;
      }
      
      //en passant setup
      if(field[endX][endY].piece == "WhitePawn" && startX == 6 && endX == 4) {
        enPassant = endY;
      } else if(field[endX][endY].piece == "BlackPawn" && startX == 1 && endX == 3) {
        enPassant = endY;
      } else {
        enPassant = -1;
      }
      paintBoard(); //redraws the board
      
      return true;
    }
  }
  return false;
}

function legalMoves(x, y) { //return legal moves for a field
  if(field[x][y].piece == "WhitePawn") {
    return pawnMoves(x, y, "White");
  } else if(field[x][y].piece == "BlackPawn") {
    return pawnMoves(x, y, "Black");
  } else if(field[x][y].piece == "WhiteKing") {
    return kingMoves(x, y, "White");
  } else if(field[x][y].piece == "BlackKing") {
    return kingMoves(x, y, "Black");
  } else if(field[x][y].piece == "WhiteTower") {
    return towerMoves(x, y, "White");
  } else if(field[x][y].piece == "BlackTower") {
    return towerMoves(x, y, "Black");
  } else if(field[x][y].piece == "WhiteBishup") {
    return bishupMoves(x, y, "White");
  } else if(field[x][y].piece == "BlackBishup") {
    return bishupMoves(x, y, "Black");
  } else if(field[x][y].piece == "WhiteQueen") {
    return towerMoves(x, y, "White").concat(bishupMoves(x, y, "White"));
  } else if(field[x][y].piece == "BlackQueen") {
    return towerMoves(x, y, "Black").concat(bishupMoves(x, y, "Black"));
  } else if(field[x][y].piece == "WhiteKnight") {
    return knightMoves(x, y, "White");
  } else if(field[x][y].piece == "BlackKnight") {
    return knightMoves(x, y, "Black");
  }else {
    return [];
  }
}

function whiteMoves() {
  var moves = []
  for(var i = 0; i < 8; ++i) {
    for(var j = 0; j < 8; ++j) {
      if(white(i, j)) {
        var ml = legalMoves(i, j);
        for(var m = 0; m < ml.length; ++m) {
          moves.push([i, j, ml[m][0], ml[m][1]]);
        }
      }
    }
  }
  return moves;
}
function blackMoves() {
  var moves = []
  for(var i = 0; i < 8; ++i) {
    for(var j = 0; j < 8; ++j) {
      if(black(i, j)) {
        var ml = legalMoves(i, j);
        for(var m = 0; m < ml.length; ++m) {
          moves.push([i, j, ml[m][0], ml[m][1]]);
        }
      }
    }
  }
  return moves;
}

function safeFrom(x, y, color) { //returns if king is safe on field
  //pawn test
  if(color === "Black") {
    if(x != 0) {
      if(y != 0) {
        if(field[x-1][y-1].piece == color + "Pawn") {
          return false;
        }
      }
      if(y != 7) {
        if(field[x-1][y+1].piece ==  color + "Pawn") {
          return false;
        }
      }
    }
  }
  
  if(color === "White") {
    if(x != 7) {
      if(y != 0) {
        if(white(x+1, y-1)) {
          return false;
        }
      }
      if(y != 7) {
        if(white(x+1, y+1)) {
          return false;
        }
      }
    }
  }
  //end of pawn test
  
  //tower/queen test
  for(var i = 1; i <= 7-x; ++i) {
    if(field[x+i][y].piece == color + "Tower" || field[x+i][y].piece == color + "Queen") {
      return false;
    }
    if(white(x+i, y) || black(x+i, y)) {
      break;
    }
  }
  for(var i = 1; i <= x; ++i) {
    if(field[x-i][y].piece == color + "Tower" || field[x-i][y].piece == color + "Queen") {
      return false;
    }
    if(white(x-i, y) || black(x-i, y)) {
      break;
    }
  }
  for(var i = 1; i <= 7-y; ++i) {
    if(field[x][y+i].piece == color + "Tower"|| field[x][y+i].piece == color + "Queen") {
      return false;
    }
    if(white(x, y+i) || black(x, y+i)) {
      break;
    }
  }
  for(var i = 1; i <= y; ++i) {
    if(field[x][y-i].piece == color + "Tower"|| field[x][y-i].piece == color + "Queen") {
      return false;
    }
    if(white(x, y-i) || black(x, y-i)) {
      break;
    }
  } //end of bishup test
  
  //bishup/queen test
  for(var i = 1; i <= 7-x && i<= 7-y; ++i) {
    if(field[x+i][y+i].piece == color + "Bishup" || field[x+i][y+i].piece == color + "Queen") {
      return false;
    }
    if(black(x+i, y+i) || white(x+i, y+i)) {
      break;
    }
  }
  for(var i = 1; i <= x && i <= y; ++i) {
    if(field[x-i][y-i].piece == color + "Bishup" || field[x-i][y-i].piece == color + "Queen") {
      return false;
    }
    if(black(x-i, y-i) || white(x-i, y-i)) {
      break;
    }
  }
  for(var i = 1; i <= 7-y && i <= x; ++i) {
    if(field[x-i][y+i].piece == color + "Bishup" || field[x-i][y+i].piece == color + "Queen") {
      return false;
    }
    if(black(x-i, y+i) || white(x-i, y+i)) {
      break;
    }
  }
  for(var i = 1; i <= y && i <= 7-x; ++i) {
    if(field[x+i][y-i].piece == color + "Bishup" || field[x+i][y-i].piece == color + "Queen") {
      return false;
    }
    if(black(x+i, y-i) || white(x+i, y-i)) {
      break;
    }
  } //end of bishup/queen test
  
  //knight test
  if(x < 6 && y != 7) {
    if(field[x+2][y+1].piece == color + "Knight") {
      return false;
    }
  }
  if(x != 7 && y < 6) {
    if(field[x+1][y+2].piece == color + "Knight") {
      return false;
    }
  }
  if(x < 6 && y != 0) {
    if(field[x+2][y-1].piece == color + "Knight") {
      return false;
    }
  }
  if(x != 7 && y > 1) {
    if(field[x+1][y-2].piece == color + "Knight") {
      return false;
    }
  }
  if(x > 1 && y != 7) {
    if(field[x-2][y+1].piece == color + "Knight") {
      return false;
    }
  }
  if(x != 0 && y < 6) {
    if(field[x-1][y+2].piece == color + "Knight") {
      return false;
    }
  }
  if(x > 1 && y != 0) {
    if(field[x-2][y-1].piece == color + "Knight") {
      return false;
    }
  }
  if(x != 0 && y > 1) {
    if(field[x-1][y-2].piece == color + "Knight") {
      return false;
    }
  } //end of knight test
  
  //king test
  if(x != 7) {
    if(field[x+1][y].piece == color + "King") {
      return false;
    }
    if(y != 7) {
      if(field[x+1][y+1].piece == color + "King") {
        return false;
      }
    }
  }
  if(x != 0) {
    if(field[x-1][y].piece == color + "King") {
      return false;
    }
    if(y != 0) {
      if(field[x-1][y-1].piece == color + "King") {
        return false;
      }
    }
  }
  if(y != 7) {
    if(field[x][y+1].piece == color + "King") {
      return false;
    }
    if(x != 0) {
      if(field[x-1][y+1].piece == color + "King") {
        return false;
      }
    }
  }
  if(y != 0) {
    if(field[x][y-1].piece == color + "King") {
     return false;
    }
    if(x != 7) {
      if(field[x+1][y-1].piece == color + "King") {
        return false;
      }
    }
  } //end of king test
  
  return true;
}

function whiteKingsSafety(startX, startY, endX, endY) {
  var tempPiece = field[endX][endY].piece;
  var tempKing  = wiKingPos;
  
  if(field[startX][startY] == "WhiteKing") {
    wiKingPos = {x:endX, y:endY};
  }
  field[endX][endY].piece = field[startX][startY].piece;
  field[startX][startY].piece = "none";
  
  var safeStatus = safeFrom(wiKingPos.x, wiKingPos.y, "Black");
  
  field[startX][startY].piece = field[endX][endY].piece;
  field[endX][endY].piece = tempPiece;
  wiKingPos = tempKing;
  
  return safeStatus;
}

function blackKingsSafety(startX, startY, endX, endY) {
  var tempPiece = field[endX][endY].piece;
  var tempKing  = blKingPos;
  
  if(field[startX][startY] == "BlackKing") {
    blKingPos = {x:endX, y:endY};
  }
  field[endX][endY].piece = field[startX][startY].piece;
  field[startX][startY].piece = "none";
  
  var safeStatus = safeFrom(blKingPos.x, blKingPos.y, "White");
  
  field[startX][startY].piece = field[endX][endY].piece;
  field[endX][endY].piece = tempPiece;
  blKingPos = tempKing;
  
  return safeStatus;
}

function towerMoves(x, y, color) { //returns legal moves for white towers
  var moves = [];
  
  if(color === "White") {
    var safety = whiteKingsSafety;
    var enemy  = black;
    var block  = white;
  } else {
    var safety = blackKingsSafety;
    var enemy  = white;
    var block  = black;
  }
  
  //taking pieces on a diagonal
  for(var i = 1; i <= 7-x; ++i) {
    if(field[x+i][y].piece == "none"  && safety(x, y, x+i, y)) {
      moves.push([x+i, y]);
    }
    if(enemy(x+i, y) && safety(x, y, x+i, y)) {
      moves.push([x+i, y]);
      break;
    }
    if(block(x+i, y)) {
      break;
    }
  }
  for(var i = 1; i <= x; ++i) {
    if(field[x-i][y].piece == "none" && safety(x, y, x-i, y)) {
      moves.push([x-i, y]);
    }
    if(enemy(x-i, y)  && safety(x, y, x-i, y)) {
      moves.push([x-i, y]);
      break;
    }
    if(block(x-i, y)) {
      break;
    }
  }
  for(var i = 1; i <= 7-y; ++i) {
    if(field[x][y+i].piece == "none" && safety(x, y, x, y+i)) {
      moves.push([x, y+i]);
    }
    if(enemy(x, y+i) && safety(x, y, x, y+i)) {
      moves.push([x, y+i]);
      break;
    }
    if(block(x, y+i)) {
      break;
    }
  }
  for(var i = 1; i <= y; ++i) {
    if(field[x][y-i].piece == "none"  && safety(x, y, x, y-i)) {
      moves.push([x, y-i]);
    }
    if(enemy(x, y-i) && safety(x, y, x, y-i)) {
      moves.push([x, y-i]);
      break;
    }
    if(block(x, y-i)) {
      break;
    }
  }
  return moves;
}

function bishupMoves(x, y, color) { //returns legal moves for white bushups
  var moves = [];
  
  if(color === "White") {
    var safety = whiteKingsSafety;
    var enemy  = black;
    var block  = white;
  } else {
    var safety = blackKingsSafety;
    var enemy  = white;
    var block  = black;
  }
  
  //taking pieces on a diagonal
  for(var i = 1; i <= 7-x && i<= 7-y; ++i) {
    if(field[x+i][y+i].piece == "none" && safety(x, y, x+i, y+i)) {
      moves.push([x+i, y+i]);
    }
    if(enemy(x+i, y+i)  && safety(x, y, x+i, y+i)) {
      moves.push([x+i, y+i]);
      break;
    }
    if(block(x+i, y+i)) {
      break;
    }
  }
  for(var i = 1; i <= x && i <= y; ++i) {
    if(field[x-i][y-i].piece == "none" && safety(x, y, x-i, y-i)) {
      moves.push([x-i, y-i]);
    }
    if(enemy(x-i, y-i)  && safety(x, y, x-i, y-i)) {
      moves.push([x-i, y-i]);
      break;
    }
    if(block(x-i, y-i)) {
      break;
    }
  }
  for(var i = 1; i <= 7-y && i <= x; ++i) {
    if(field[x-i][y+i].piece == "none"  && safety(x, y, x-i, y+i)) {
      moves.push([x-i, y+i]);
    }
    if(enemy(x-i, y+i) && safety(x, y, x-i, y+i)) {
      moves.push([x-i, y+i]);
      break;
    }
    if(block(x-i, y+i)) {
      break;
    }
  }
  for(var i = 1; i <= y && i <= 7-x; ++i) {
    if(field[x+i][y-i].piece == "none" && safety(x, y, x+i, y-i)) {
      moves.push([x+i, y-i]);
    }
    if(enemy(x+i, y-i) && safety(x, y, x+i, y-i)) {
      moves.push([x+i, y-i]);
      break;
    }
    if(block(x+i, y-i)) {
      break;
    }
  }
  return moves;
}

function pawnMoves(x, y, color) { //returns legal moves for white pawns
  var moves = [];
  
  if(color === "White") {
    //two moves forward
    if(x == 6) {
      if(field[x-1][y].piece == "none" && field[x-2][y].piece == "none" && whiteKingsSafety(x, y, x-1, y) && whiteKingsSafety(x, y, x-2, y)) {
        moves = [[x-1, y],[x-2, y]];
      } else if(field[x-1][y].piece == "none" && field[x-2][y].piece == "none" && x == 6  && whiteKingsSafety(x, y, x-2, y)) { //if king is in danger ans +2 forward is the only move
        return [[x-2, y]];
      }
    } else if(field[x-1][y].piece == "none" && whiteKingsSafety(x, y, x-1, y)) { //one move forward
      moves = [[x-1, y]];
    }
    
    //taking pieces on a diagonal
    if(y != 0) {
      if(black(x-1, y-1)  && whiteKingsSafety(x, y, x-1, y-1)) {
        moves.push([x-1, y-1]);
      }
      if(enPassant == y-1 && x == 3 && whiteKingsSafety(x, y, x-1, y-1)) { //en passant
        moves.push([x-1, y-1]);
      }
    }
    if(y != 7) {
      if(black(x-1, y+1) && whiteKingsSafety(x, y, x-1, y+1)) {
        moves.push([x-1, y+1]);
      }
      if(enPassant == y+1 && x == 3 && whiteKingsSafety(x, y, x-1, y+1)) { //en passant
        moves.push([x-1, y+1]);
      }
    }
  } else {
    if(x == 1) {
      if(field[x+1][y].piece == "none" && field[x+2][y].piece == "none" && blackKingsSafety(x, y, x+1, y) && blackKingsSafety(x, y, x+2, y)) {
        moves = [[x+1, y],[x+2, y]];
      } else if(field[x+1][y].piece == "none" && field[x+2][y].piece == "none" && x == 1  && blackKingsSafety(x, y, x+2, y)) { //if king is in danger ans +2 forward is the only move
        return [[x+2, y]];
      }
    } else if(field[x+1][y].piece == "none" && blackKingsSafety(x, y, x+2, y)) { //one move forward
      moves = [[x+1, y]];
    }
    
    //taking pieces on a diagonal
    if(y != 0) {
      if(white(x+1, y-1) && blackKingsSafety(x, y, x+1, y-1)) {
        moves.push([x+1, y-1]);
      }
      if(enPassant == y-1 && x == 4 && blackKingsSafety(x, y, x-1, y-1)) { //en passant
        moves.push([x+1, y-1]);
      }
    }
    if(y != 7) {
      if(white(x+1, y+1) && blackKingsSafety(x, y, x+1, y+1)) {
        moves.push([x+1, y+1]);
      }
      if(enPassant == y+1 && x == 4 && blackKingsSafety(x, y, x+1, y+1)) { //en passant
        moves.push([x+1, y+1]);
      }
    }
  }
  
  return moves;
}

function kingMoves(x, y, color) { //returns legal moves for white king
  var moves = [];
  
  if(color === "White") {
    var safety = "Black";
    var enemy  = black;
  } else {
    var safety = "White";
    var enemy  = white;
  }
  
  if(x != 7) {
    if((field[x+1][y].piece == "none" || enemy(x+1, y)) && safeFrom(x+1, y, safety)) {
      moves.push([x+1, y]);
    }
    if(y != 7) {
      if((field[x+1][y+1].piece == "none" || enemy(x+1, y+1)) && safeFrom(x+1, y+1, safety)) {
        moves.push([x+1, y+1]);
      }
    }
  }
  if(x != 0) {
    if((field[x-1][y].piece == "none" || enemy(x-1, y)) && safeFrom(x-1, y, safety)) {
      moves.push([x-1, y]);
    }
    if(y != 0) {
      if((field[x-1][y-1].piece == "none" || enemy(x-1, y-1)) && safeFrom(x-1, y-1, safety)) {
        moves.push([x-1, y-1]);
      }
    }
  }
  if(y != 7) {
    if((field[x][y+1].piece == "none" || enemy(x, y+1)) && safeFrom(x, y+1, safety)) {
      moves.push([x, y+1]);
    }
    if(x != 0) {
      if((field[x-1][y+1].piece == "none" || enemy(x-1, y+1)) && safeFrom(x-1, y+1, safety)) {
        moves.push([x-1, y+1]);
      }
    }
  }
  if(y != 0) {
    if((field[x][y-1].piece == "none" || enemy(x, y-1)) && safeFrom(x, y-1, safety)) {
      moves.push([x, y-1]);
    }
    if(x != 7) {
      if((field[x+1][y-1].piece == "none" || enemy(x+1, y-1)) && safeFrom(x+1, y-1, safety)) {
        moves.push([x+1, y-1]);
      }
    }
  }
  
  //rockade
  if(color === "White") { //White
    if(rockadeWhiteLeft && field[7][1].piece == "none" && field[7][2].piece == "none" && safeFrom(7, 1, "Black") && safeFrom(7, 3, "Black")) {
      moves.push([7, 1]);
    }
    if(rockadeWhiteRight && field[7][6].piece == "none" && field[7][5].piece == "none" && field[7][4].piece == "none" && safeFrom(7, 6, "Black") && safeFrom(7, 3, "Black")) {
      moves.push([7, 6]);
    }
  } else { //Black
    if(rockadeBlackLeft && field[0][1].piece == "none" && field[0][2].piece == "none" && safeFrom(0, 1, "White") && safeFrom(0, 3, "White")) {
      moves.push([0, 1]);
    }
    if(rockadeBlackRight && field[0][6].piece == "none" && field[0][5].piece == "none" && field[0][4].piece == "none" && safeFrom(0, 6, "White") && safeFrom(0, 3, "White")) {
      moves.push([0, 6]);
    }
  }
  
  return moves;
}

function knightMoves(x, y, color) { //returns legal moves for white knight
  var moves = [];
  
  if(color === "White") {
    var safety = whiteKingsSafety;
    var enemy  = black;
  } else {
    var safety = blackKingsSafety;
    var enemy  = white;
  }
  
  if(x < 6 && y != 7) {
    if((field[x+2][y+1].piece == "none" || enemy(x+2, y+1)) && safety(x, y, x+2, y+1)) {
      moves.push([x+2, y+1]);
    }
  }
  if(x != 7 && y < 6) {
    if((field[x+1][y+2].piece == "none" || enemy(x+1, y+2)) && safety(x, y, x+1, y+2)) {
      moves.push([x+1, y+2]);
    }
  }
  if(x < 6 && y != 0) {
    if((field[x+2][y-1].piece == "none" || enemy(x+2, y-1)) && safety(x, y, x+2, y-1)) {
      moves.push([x+2, y-1]);
    }
  }
  if(x != 7 && y > 1) {
    if((field[x+1][y-2].piece == "none" || enemy(x+1, y-2)) && safety(x, y, x+1, y-2)) {
      moves.push([x+1, y-2]);
    }
  }
  if(x > 1 && y != 7) {
    if((field[x-2][y+1].piece == "none" || enemy(x-2, y+1)) && safety(x, y, x-2, y+1)) {
      moves.push([x-2, y+1]);
    }
  }
  if(x != 0 && y < 6) {
    if((field[x-1][y+2].piece == "none" || enemy(x-1, y+2)) && safety(x, y, x-1, y+2)) {
      moves.push([x-1, y+2]);
    }
  }
  if(x > 1 && y != 0) {
    if((field[x-2][y-1].piece == "none" || enemy(x-2, y-1)) && safety(x, y, x-2, y-1)) {
      moves.push([x-2, y-1]);
    }
  }
  if(x != 0 && y > 1) {
    if((field[x-1][y-2].piece == "none" || enemy(x-1, y-2)) && safety(x, y, x-1, y-2)) {
      moves.push([x-1, y-2]);
    }
  }
  
  return moves;
}
//--- end of legal moves --------------------------------------------------------------------------------------------------

//--- start of events -----------------------------------------------------------------------------------------------------
function getMousePos(c, event) {
  var rect = c.getBoundingClientRect();
  return {
    x: parseInt(8*(event.clientY - rect.left)/c.width),
    y: parseInt(8*(event.clientX - rect.top) /c.height)
  };
}

var turn = true;
c.addEventListener('click', function(event) {
  //gets posission of click
  var mousePos = getMousePos(c, event);
  selection.x = mousePos.x;
  selection.y = mousePos.y;
  
  if(turn) {
    //selects a piece
    if(white(selection.x, selection.y)) {
      paintBoard();
      drawGradiant(selection.x, selection.y)
      current.x = selection.x;
      current.y = selection.y;
      
      movesList = legalMoves(current.x, current.y);
    
      //paints legal moves with gradiants
      for(x=0; x<movesList.length; ++x) {
        drawGradiant(movesList[x][0], movesList[x][1]);
      }
      paintPieces(); //paints pieces over eventual gradiants
      
    } else {
      if(move(current.x, current.y, selection.x, selection.y, true)) { //moves a piece
        if(blackMoves().length == 0) {
          endMessage.innerHTML = "Congratulations! <br> You won"
          checkMate.classList.remove("is-hidden");
        }
        //console.log(field);
        turn = false;
        //bruteForceWrapper();
        paintBoard();
        if(whiteMoves().length == 0) {
          checkMate.classList.remove("is-hidden");
        }
      }
    }
  //} else {
  //  bruteForce();
  //  paintBoard();
  //  turn = true;
  } else {
    //selects a piece
    if(black(selection.x, selection.y)) {
      paintBoard();
      drawGradiant(selection.x, selection.y)
      curBlack.x = selection.x;
      curBlack.y = selection.y;
      
      movesList = legalMoves(curBlack.x, curBlack.y);
    
      //paints legal moves with gradiants
      for(x=0; x<movesList.length; ++x) {
        drawGradiant(movesList[x][0], movesList[x][1]);
      }
      paintPieces(); //paints pieces over eventual gradiants
    } else {
      if(move(curBlack.x, curBlack.y, selection.x, selection.y, true)) { //moves a piece
        if(whiteMoves().length == 0) {
          endMessage.innerHTML = "Check mate! <br> You lose"
          checkMate.classList.remove("is-hidden");
        }
        //console.log(field);
        turn = true;
        //bruteForceWrapper();
        paintBoard();
        if(blackMoves().length == 0) {
          checkMate.classList.remove("is-hidden");
        }
      }
    }
  }
}, false);

var fieldValue = {
                  
WhitePawn : [[  0,  0,  0,  0,  0,  0,  0,  0],
             [-50,-50,-50,-50,-50,-50,-50,-50],
             [-10,-10,-20,-30,-30,-20,-10,-10],
             [ -5, -5,-10,-25,-25,-10,-5,  -5],
             [  0,  0,  0,-20,-20,  0,  0,  0],
             [ -5,  5, 10,  0,  0, 10,  5, -5],
             [ -5,-10,-10, 20, 20,-10,-10, -5],
             [  0,  0,  0,  0,  0,  0,  0,  0]],
                   
BlackPawn : [[ 0,  0,  0,  0,  0,  0,  0,  0],
             [ 5, 10, 10,-20,-20, 10, 10,  5],
             [ 5, -5,-10,  0,  0,-10, -5,  5],
             [ 0,  0,  0, 20, 20,  0,  0,  0],
             [ 5,  5, 10, 25, 25, 10,  5,  5],
             [10, 10, 20, 30, 30, 20, 10, 10],
             [50, 50, 50, 50, 50, 50, 50, 50],
             [ 0,  0,  0,  0,  0,  0,  0,  0]],
                    
WhiteKnight : [[50, 40, 30, 30, 30, 30, 40, 50],
               [40, 20,  0,  0,  0,  0, 20, 40],
               [30,  0,-10,-15,-15,-10,  0, 30],
               [30, -5,-15,-20,-20,-15, -5, 30],
               [30,  0,-15,-20,-20,-15,  0, 30],
               [30, -5,-10,-15,-15,-10, -5, 30],
               [40, 20,  0, -5, -5,  0, 20, 40],
               [50, 40, 30, 30, 30, 30, 40, 50]],
                     
BlackKnight : [[-50,-40,-30,-30,-30,-30,-40,-50],
               [-40,-20,  0,  5,  5,  0,-20,-40],
               [-30,  5, 10, 15, 15, 10,  5,-30],
               [-30,  0, 15, 20, 20, 15,  0,-30],
               [-30,  5, 15, 20, 20, 15,  5,-30],
               [-30,  0, 10, 15, 15, 10,  0,-30],
               [-40,-20,  0,  0,  0,  0,-20,-40],
               [-50,-40,-30,-30,-30,-30,-40,-50]],
                     
WhiteBishup : [[20, 10, 10, 10, 10, 10, 10, 20],
               [10,  0,  0,  0,  0,  0,  0, 10],
               [10,  0, -5,-10,-10, -5,  0, 10],
               [10, -5, -5,-10,-10, -5, -5, 10],
               [10,  0,-10,-10,-10,-10,  0, 10],
               [10,-10,-10,-10,-10,-10,-10, 10],
               [10, -5,  0,  0,  0,  0, -5, 10],
               [20, 10, 10, 10, 10, 10, 10, 20]],
                      
BlackBishup : [[-20,-10,-10,-10,-10,-10,-10,-20],
               [-10,  5,  0,  0,  0,  0,  5,-10],
               [-10, 10, 10, 10, 10, 10, 10,-10],
               [-10,  0, 10, 10, 10, 10,  0,-10],
               [-10,  5,  5, 10, 10,  5,  5,-10],
               [-10,  0,  5, 10, 10,  5,  0,-10],
               [-10,  0,  0,  0,  0,  0,  0,-10],
               [-20,-10,-10,-10,-10,-10,-10,-20]],
                    
WhiteQueen : [[20, 10, 10,  5,  5, 10, 10, 20],
              [10,  0,  0,  0,  0,  0,  0, 10],
              [10,  0, -5, -5, -5, -5,  0, 10],
              [ 5,  0, -5, -5, -5, -5,  0,  5],
              [ 0,  0, -5, -5, -5, -5,  0,  5],
              [10, -5, -5, -5, -5, -5,  0, 10],
              [10,  0, -5,  0,  0,  0,  0, 10],
              [20, 10, 10,  5,  5, 10, 10, 20]],
                     
BlackQueen : [[-20,-10,-10, -5, -5,-10,-10,-20],
              [-10,  0, -5,  0,  0,  0,  0,-10],
              [-10, -5,  5,  5,  5,  5,  0,-10],
              [  0,  0,  5,  5,  5,  5,  0, -5],
              [ -5,  0,  5,  5,  5,  5,  0, -5],
              [-10,  0,  5,  5,  5,  5,  0,-10],
              [-10,  0,  0,  0,  0,  0,  0,-10],
              [-20,-10,-10, -5, -5,-10,-10,-20]],

WhiteTower : [[ 0,  0,  0,  0,  0,  0,  0,  0],
              [-5,-10,-10,-10,-10,-10,-10, -5],
              [ 5,  0,  0,  0,  0,  0,  0,  5],
              [ 5,  0,  0,  0,  0,  0,  0,  5],
              [ 5,  0,  0,  0,  0,  0,  0,  5],
              [ 5,  0,  0,  0,  0,  0,  0,  5],
              [ 5,  0,  0,  0,  0,  0,  0,  5],
              [ 0,  0,  0, -5, -5,  0,  0,  0]],
                     
BlackTower : [[ 0,  0,  0,  5,  5,  0,  0,  0],
              [-5,  0,  0,  0,  0,  0,  0, -5],
              [-5,  0,  0,  0,  0,  0,  0, -5],
              [-5,  0,  0,  0,  0,  0,  0, -5],
              [-5,  0,  0,  0,  0,  0,  0, -5],
              [-5,  0,  0,  0,  0,  0,  0, -5],
              [ 5, 10, 10, 10, 10, 10, 10,  5],
              [ 0,  0,  0,  0,  0,  0,  0,  0]],
                     
WhiteKing : [[ 30, 40, 40, 50, 50, 40, 40, 30],
             [ 30, 40, 40, 50, 50, 40, 40, 30],
             [ 30, 40, 40, 50, 50, 40, 40, 30],
             [ 30, 40, 40, 50, 50, 40, 40, 30],
             [ 20, 30, 30, 40, 40, 30, 30, 20],
             [ 10, 20, 20, 20, 20, 20, 20, 10],
             [-20,-20,  0,  0,  0,  0,-20,-20],
             [-20,-30,-10,  0,  0,-10,-30,-20]],
                    
BlackKing : [[ 20, 30, 10,  0,  0, 10, 30, 20],
             [ 20, 20,  0,  0,  0,  0, 20, 20],
             [-10,-20,-20,-20,-20,-20,-20,-10],
             [-20,-30,-30,-40,-40,-30,-30,-20],
             [-30,-40,-40,-50,-50,-40,-40,-30],
             [-30,-40,-40,-50,-50,-40,-40,-30],
             [-30,-40,-40,-50,-50,-40,-40,-30],
             [-30,-40,-40,-50,-50,-40,-40,-30]],

none : [[0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]]
};
                    
function boardValue() {
  var value = 0;
  for(var x = 0;  x < 8; ++x) {
    for(var y = 0; y < 8; ++y) {
      value += -valueMap[field[x][y].piece] + fieldValue[field[x][y].piece][x][y];
    }
  }
  return value;
}

function skeletonMove(startX, startY, endX, endY, whiteKingPos, blackKingPos) {
  var newField = new Array(8);
  for(var x = 0;  x < 8; ++x) {
    newField[x] = new Array(8);
    for(var y = 0; y < 8; ++y) {
      newField[x][y] = JSON.parse(JSON.stringify(field[x][y]));
    }
  }

  var wKing    = whiteKingPos;
  var bKing    = blackKingPos;
  
  if(white(endX, endY) || field[endX][endY].piece == "none") { //tests if white piece is taken
    takenWhite = field[endX][endY].piece;
  }
  if(black(endX, endY) || field[endX][endY].piece == "none") { //tests if black piece is taken
    takenBlack = field[endX][endY].piece;
  }
  
  var taken = takenWhite;
  if(white(startX, startY)) {
    taken = takenBlack;
  }
  
  if(field[startX][startY].piece == "WhiteKing") {
    wKing.x = endX;
    wKing.y = endY;
  }
  if(field[startX][startY].piece == "BlackKing") {
    bKing.x = endX;
    bKing.y = endY;
  }
  
  if(field[startX][startY].piece == "WhitePawn" && (endY != startY) && field[endX][endY].piece == "none") { //en passant move white
    newField[endX][endY].piece = field[startX][startY].piece;
    newField[startX][endY].piece = "none"; //spesial case (en passant)
    newField[startX][startY].piece = "none";
    takenBlack = "BlackPawn";
  } else if(field[startX][startY].piece == "BlackPawn" && (endY != startY) && field[endX][endY].piece == "none") { //en passant move black
    newField[endX][endY].piece = field[startX][startY].piece;
    newField[startX][endY].piece = "none"; //spesial case (en passant)
    newField[startX][startY].piece = "none";
    takenWhite = "WhitePawn";
    
  } else if(field[startX][startY].piece == "WhitePawn" && endX == 0) { //white pawn raches goal
    newField[endX][endY].piece = "WhiteQueen";
    newField[startX][startY].piece = "none";
  } else if(field[startX][startY].piece == "BlackPawn" && endX == 7) { //black pawn raches goal
    newField[endX][endY] = "BlackQueen";
    newField[startX][startY] = "none";
  } else { //moves piece normaly
    newField[endX][endY].piece = field[startX][startY].piece;
    newField[startX][startY].piece = "none";
  }
  
  return {wiKingPos:whiteKingPos, blKingPos:blackKingPos, field:newField, value:valueMap[taken]};
}

function undo() {
  var field = prevBoardStack.pop().slice();
  
  /* var taken = takenBlack;
  if(isComputer) {
    taken = takenWhite;
  }
  field[prevMove[0]][prevMove[1]].piece = field[prevMove[2]][prevMove[3]].piece;
  field[prevMove[2]][prevMove[3]].piece = taken; */
}

function bruteForceWrapper() {
  var fieldBackup = new Array(8);
  for(var x = 0;  x < 8; ++x) {
    fieldBackup[x] = new Array(8);
    for(var y = 0; y < 8; ++y) {
      fieldBackup[x][y] = JSON.parse(JSON.stringify(field[x][y]));
    }
  };
  var wiKingBackup = wiKingPos;
  var blKingBackup = blKingPos;
  
  result = bruteForce(n_steps, true);
  
  field     = fieldBackup.slice();
  wiKingPos = wiKingBackup;
  blKingPos = blKingBackup;
  
  if(move(result.beMove[0], result.beMove[1], result.beMove[2], result.beMove[3], true)) {
    //console.log("tick");
  }
}

function bruteForce(n, isComputer) {
  var lm    = [];
  
  if(!isComputer) {
    lm = whiteMoves();
  } else {
    lm = blackMoves();
  }
  
  var reality   = new Array(lm.length);
  var bestMove = [];
  
  var enemyBestValue = new Array(lm.length);
  
  if(n == 0) {
    return {beValue : boardValue(), beMove : []};
  } else if(!isComputer) {
    var bestValue = -99999;
    for (var i = 0; i < lm.length; ++i) {
      move(lm[i][0], lm[i][1], lm[i][2], lm[i][3], false);
      var newCandidate = bruteForce(n-1, true).beValue;
      if((newCandidate > bestValue)) { //|| (newCandidate == bestValue && Math.random() > 0.5)) {
        bestMove = [lm[i][0], lm[i][1], lm[i][2], lm[i][3]];
        bestValue = newCandidate;
      }
      undo();
    }
  } else {
    var bestValue = 99999;
    for (var i = 0; i < lm.length; ++i) {
      move(lm[i][0], lm[i][1], lm[i][2], lm[i][3], false);
      var newCandidate = bruteForce(n-1, false).beValue;
      if((newCandidate < bestValue)) { //|| (newCandidate == bestValue && Math.random() > 0.5)) {
        bestMove = [lm[i][0], lm[i][1], lm[i][2], lm[i][3]];
        bestValue = newCandidate;
      }
      undo();
    }
  }
  return {beMove : bestMove, beValue : bestValue};
}