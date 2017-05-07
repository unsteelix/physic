'use strict';
var en_top = 0;
var en_right = 0;

var car_y = 100;
var car_x = 100;

var press_top   = false; //нажата ли кнопка вверх
var press_right = false; //нажата ли кнопка вправа
var press_left = false; //нажата ли кнопка влева
var press_bot = false; //нажата ли кнопка вниз

// top    - 38
// right  - 39
// left   - 37
// bottom - 40
// space  - 32
//

var ground_h = 100; //высота земли

var camera_x = 0; // позиция нижней левой точки камеры
var camera_y = 0;

var camera_gate_w = 360; // ширина камеры
var camera_gate_h = 200;

var offset_x = 0; // сдвиг камеры по x
var offset_y = 0; 


var canvas_1 = document.getElementById('canvas_1');
var ctx_1 = canvas_1.getContext('2d');
////////////////////////////////////// глоб переменные


class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let cp = new Point(25, 8);


class Spark {

  constructor(x, y, en) {
    this.x = x;
    this.y = y;
    this.en = en;
    this.r = 5;
    this.live();
  }

  update() {
    this.x = this.x + 5;
    this.y = this.y;
    this.en = this.en - 1;
    this.r = this.r + 1;
    
    if( this.en < 5 ){
       this.death();   
    }
    
    this.draw();
    console.log('upd '+this.x + ' - ' + this.y + ' - ' + this.en);
  }
    
  draw(){      
    ctx_1.save();
    translateCamera();
    ctx_1.strokeRect(this.x, 500-this.y, this.r, this.r);
    ctx_1.restore();
  }
    
  live() {
    console.log('live '+this.x+'-'+this.y+'-'+this.en);
    this.id = setInterval(() => (this.update()), 33);
  }
    
  death() {
    console.log('death');
    this.x = 0;
    this.y = 0;
    this.en = 0;
    this.r = 0;
    clearInterval(this.id);
  }
  coord(){
      console.log(this.x+'=='+this.y);
  }
}

let spark = new Spark(100, 100, 500);


function game_update(){
   
    ////////длительное нажатие
    //вверх
    if(press_top){
        en_top = en_top + 5;  
    }
    
    //вниз
    if(press_bot){
        en_top = en_top - 5;
        console.log('press_bot');
    }
    
    if ( (!press_top) && (!press_bot) ) {
        en_top = en_top - 5;  
    }
    

    //вправа
    if(press_right){
        en_right = en_right + 15;  
    }
    
    //влево
    if(press_left){
        en_right = en_right - 15;  
    }
    
    if ( (!press_left) && (!press_right) ) {
        en_right = en_right * 0.8;
    }
    
    //////////////////////////
    
    //////////////////////////
    //// новые координаты ////
    
    en_top = en_top * 0.9;
    en_right = en_right * 0.6;
    
    car_x = car_x + (en_right / 5) ;
    car_y = car_y + (en_top / 5);
    
    //console.log(car_x.toFixed() + ' - ' + car_y.toFixed());
    //console.log(en_top.toFixed() + ' - ' + en_right.toFixed());
    
    //////////////////////////
    

    

    collision();
    calcCameraPosition();
    
    ctx_1.save();
    clearCanvas(canvas_1);

    /////////////////////////////
    // перемещение и отрисовка //
    translateCamera();
    
    draw_ground();
    draw_car();
    drawFrameGate();
    
    ctx_1.restore();
    /////////////////////////////
}


// перемещаем камеру
function translateCamera(){

    ctx_1.translate(-camera_x+((500-camera_gate_w)/2), camera_y-((500-camera_gate_h)/2)); //!!!!!!
       
}

// вычисляем позицию камеры исходя из положения героя
function calcCameraPosition(){
    
    if(car_x < camera_x){
        camera_x = car_x;
        console.log(offset_x);
    } 
    if(car_x > camera_x + camera_gate_w){
        camera_x = car_x - camera_gate_w;
    }

    if(car_y < camera_y){
        camera_y = car_y;   
    }
    if(car_y > camera_y + camera_gate_h){
        camera_y = car_y - camera_gate_h;
    }

    //console.log('cam: '+ camera_x.toFixed() + ' -- ' + camera_y.toFixed());
}

function drawFrameGate(){
    ctx_1.fillStyle = 'green';
    
    ctx_1.fillRect(camera_x, 500-camera_y, 1, -camera_gate_h);               // H
    ctx_1.fillRect(camera_x+camera_gate_w, 500-camera_y, 1, -camera_gate_h); // H
    ctx_1.fillRect(camera_x, 500-camera_y, camera_gate_w, 1);
    ctx_1.fillRect(camera_x, 500-camera_y-camera_gate_h, camera_gate_w, 1);
    
    ctx_1.fillStyle = 'black';
}

function collision(){
    
    //столкновение с землей
    if ( car_y <= ground_h ) {
        //console.log('aaaaaaaaaaaaa');
        car_y = ground_h;
        en_top = 50;
    }
    
    
   
    
    
    //console.log(car_y);
}




function draw_car(){
    
    ctx_1.strokeRect(car_x, 500 - car_y, 1, 1);
  
    
}

function clearCanvas(canvas){
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);//чистка
}

function draw_ground(){
    ctx_1.clearRect(0, 0, canvas_2.width, canvas_2.height);//чистка
    ctx_1.strokeRect(0, 400, 500, 100);
}

function untap(code){
    
    ////////одиночное нажатие
    //вверх
    if(code == 38){
        press_top = false;
        en_top = en_top + 10;  
    }
    
    //вниз
    if(code == 40){
        press_bot = false;
    }
    
    //влево
    if(code == 37){
        press_left = false;
    }
    
    //вправа
    if(code == 39){
        press_right = false;
        
        //en_right = en_right + 10;  
    }
    /////////////////////////
    
}

function tap(code){

    // клик мыши
    if(code === undefined){
        //en_top = en_top + 100;   
        let spark = new Spark(car_x, car_y, 50);
    }
    
    //вверх
    if(code == 38){
       press_top = true;
    }
    
    //вниз
    if(code == 40){
        press_bot = true;
    }
    
    //влево
    if(code == 37){
        press_left = true;
    }
    
    //вправа
    if(code == 39){
       press_right = true;
    }
        
}


function start(){
    var intervalID = setInterval(game_update, 33);
}

function restart(){
    
    start();
}

function gameover(){
    clearInterval(intervalID);

    restart();
}

// перевод градусов в радианы
Number.prototype.degree = function () {
	return this * Math.PI / 180;
};
//console.log((90).degree()); 


start();