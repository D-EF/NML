/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-11-14 01:09:18
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-12-18 23:41:57
 * @FilePath: \site\js\import\NML\NML\Matrix_2D.js
 * @Description: 2D变换矩阵
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

/*h*/// open * 类型注释 * open
    /*h*//** @typedef {Float32Array} CONFIG.VALUE_TYPE 矩阵计算时缓存下标的类型; 决定了计算时矩阵的n的大小 可选值为 Uint_N_Array, Int_N_Array */
    /*h*//** @typedef {Number} int      整形数字 */
    /*h*//** @typedef {Number} double   双浮点数字 */
    /*h*//** @typedef {Number} float    单浮点数字 */
    /*h*//** @typedef {Number[]|Float32Array|Float64Array|Matrix} List_Value 数据的各种存储形式 */
/*h*/// end  * 类型注释 * end

import {copy_Array,approximately,CONFIG} from "./Config.js";
import {Vector} from "./Vector.js";
import { Matrix } from "./Matrix.js";
/*h*/const {sin,cos,asin,acos,abs,sqrt,tan}=Math;
/*h*/const _MATRIX_IDENTITY_3X3=new Matrix([1,0,0,0,1,0,0,0,1]);

/** 2D变换矩阵数据结构为3x3矩阵 */
class Matrix_2D extends Matrix{
    constructor(data){
        super(9);
        if(data){
            copy_Array(this,data,9);
        }
    }

    /** 创建单位矩阵
     * @return {Matrix_2D} 返回一个3x3矩阵
     */
    static create_Identity(){
        return new Matrix_2D(_MATRIX_IDENTITY_3X3);
    }

    /** 创建旋转矩阵
     * @param {Number} theta 顺时针 旋转角弧度
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_2D} 返回一个3x3矩阵
     */
    static create_Rotate(theta,_out){
        var s=sin(theta),
            c=cos(theta);
        CONFIG.COORDINATE_SYSTEM?0:s*=-1;
        var out=_out||new Matrix_2D();
        out[0]=c;   out[1]=s;   out[2]=0;
        out[3]=-s;  out[4]=c;   out[5]=0;
        out[6]=0;   out[7]=0;   out[8]=1;
        return out;
    }

    /** 创建旋转矩阵 从(1,0)旋转到目标向量
     * @param {Vector} vec 目标向量(2d)
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_2D} 返回一个3x3矩阵
     */
    static create_Rotate__Vector(vec,_out){
        var unit_v=Vector.is_Unit(vec)?vec:Vector.create_Normalization(vec),
            s=unit_v[1];
        CONFIG.COORDINATE_SYSTEM?0:s*=-1;
        var out=_out||new Matrix_2D();
        out[0]=c;   out[1]=s;   out[2]=0;
        out[3]=-s;  out[4]=c;   out[5]=0;
        out[6]=0;   out[7]=0;   out[8]=1;
        return out;
    }

    /** 创建缩放矩阵
     * @param {Number} scale_x x 轴方向上的缩放系数
     * @param {Number} scale_y y 轴方向上的缩放系数
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_2D} 返回一个3x3矩阵
     */
    static create_Scale(scale_x,scale_y,_out){
        var out=_out||new Matrix_2D();
        out[0]=scale_x; out[1]=0;       out[2]=0;
        out[3]=0;       out[4]=scale_y; out[5]=0;
        out[6]=0;       out[7]=0;       out[8]=1;
        return out;
    }

    /** 创建镜像矩阵(对称)
     * @param {Vector} normal 对称轴的法向坐标
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_2D} 返回一个3x3矩阵
     */
    static create_Horizontal(normal,_out){
        var i2xy=-2*normal[0]*normal[1];
        var out=_out||new Matrix_2D();
        out[0]=1-2*normal[0]*normal[0]; out[1]=i2xy;                    out[2]=0;
        out[3]=i2xy;                    out[4]=1-2*normal[1]*normal[1]; out[5]=0;
        out[6]=0;                       out[7]=0;                       out[8]=1;
        return out;
    }

    /** 创建切变矩阵
     * @param {Number} k_x x方向的切变系数
     * @param {Number} k_y y方向的切变系数
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_2D} 返回一个3x3矩阵
     */
    static create_Shear(k_x,k_y,_out){
        var out=_out||new Matrix_2D();
        out[0]=1;   out[1]=k_y; out[2]=0;
        out[3]=k_x; out[4]=1;   out[5]=0;
        out[6]=0;   out[7]=0;   out[8]=1;
        return out;
    }

    /** 创建等比缩放&旋转矩阵 根据向量生成矩阵
     * @param {List_Value} vec_l2 2d向量
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix}_2  返回一个3x3矩阵
     */
    static create_ByVector(vec_l2,_out){
        var s=vec_l2[1];
        CONFIG.COORDINATE_SYSTEM?0:s*=-1;
        var out=_out||new Matrix_2D();
        out[0]=vec_l2[0];   out[1]=-s;          out[2]=0;
        out[3]=s;           out[4]=vec_l2[0];   out[5]=0;
        out[6]=0;           out[7]=0;           out[8]=1;
        return out;
    }
}

Matrix_2D.ROTATE_90=new Matrix_2D([
    0, 1, 0,
   -1, 0, 0,
    0, 0, 1
]);
Matrix_2D.ROTATE_90_I=new Matrix_2D([0,-1,1,0]);
Matrix_2D.FLIP_HORIZONTAL=new Matrix_2D([-1,0,0,1]);

export{
    Matrix_2D
}