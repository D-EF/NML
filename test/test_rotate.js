import {NML} from "../index.js";
var { Matrix, Matrix_2, Matrix_3, Vector }=NML;

function log_m3(m){
    console.log(Matrix.create_Print(m,3));
}


var m;



//  test 左手

console.log("转换到左手坐标系");
NML.CONFIG.AXIS=0;

// 左手坐标系 旋转轴(1,1,1)旋转90度
console.log("rotate: 90*DEG;  aixs: [1,1,1]");
log_m3(m);
console.log("vm",Matrix.multiplication([0,0,1],m,3,1,3));
console.log("mv",Matrix.multiplication(m,[0,0,1],3,3,1));



// test 右手

console.log("转换到右手坐标系");
NML.CONFIG.AXIS=1;

// 右手坐标系 旋转轴(1,1,1)旋转90度
console.log("rotate: 90*DEG;  aixs: [1,1,1]");
log_m3(Matrix_3.create_Rotate__Axis(90*DEG,[1,1,1]));
console.log("vm",Matrix.multiplication([0,0,1],m,3,1,3));
console.log("mv",Matrix.multiplication(m,[0,0,1],3,3,1));
