/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-11-01 00:48:35
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-11-01 01:34:13
 * @FilePath: \site\js\import\NML\test\test_rotate.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */
import {NML} from "../index.js";
var { Matrix, Matrix_2, Matrix_3, Vector }=NML;

function log_m3(m){
    console.log(Matrix.create_Print(m,3));
}
NML.CONFIG.AXIS=0;
var f=false;



var m;

do{
   if(NML.CONFIG.AXIS===0)console.log("当前为转换到左手坐标系");
   if(NML.CONFIG.AXIS===1)console.log("当前为转换到右手坐标系");

    // 左手坐标系 旋转轴(1,1,1)旋转90度
    console.log("rotate: 90*DEG;  aixs: [1,1,1]");
    log_m3(m);
    console.log("vm",Matrix.multiplication([0,0,1],m,3,1,3));
    console.log("mv",Matrix.multiplication(m,[0,0,1],3,3,1));
    f=!f;
    NML.CONFIG.AXIS=1;
}while(f)