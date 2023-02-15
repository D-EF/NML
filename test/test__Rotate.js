/*!
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
import { DEG_90 } from "../NML/Config.js";
import { EulerAngles, Rotate_3D } from "../NML/Rotate_3D.js";
var { Matrix, Matrix_2, Matrix_3, Vector }=NML;

function log_m3(m){
    console.log(Matrix.create_Print(m,3));
}
NML.CONFIG.AXIS=0;

function test_rotate(){
    var f=false;
    var m;
    var axis=[2,1,2];



    do{

        if(NML.CONFIG.AXIS===0)console.log("当前为左手坐标系");
        if(NML.CONFIG.AXIS===1)console.log("当前为右手坐标系");

        console.log("生成旋转矩阵和欧拉角");
        m=Matrix_3.create_Rotate__EulerAngles([DEG*123,DEG*180,DEG*321],axis);
        log_m3(m);
        console.log("vm",Matrix.multiplication([1,1,1],m,1,3,3));
        console.log("mv",Matrix.multiplication(m,[1,1,1],3,3,1));
        
        var ea=EulerAngles.create_EulerAngles__Matrix(m,axis);
        console.log(ea);
        
        console.log("验证矩阵to欧拉角结果");
        m=Matrix_3.create_Rotate__EulerAngles(ea,axis);
        console.log("vm",Matrix.multiplication([1,1,1],m,1,3,3));
        console.log("mv",Matrix.multiplication(m,[1,1,1],3,3,1));
        
        f=!f;
        NML.CONFIG.AXIS=1;
    }while(f);
}

export{
    test_rotate
}