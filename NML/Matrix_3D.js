/*!
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-11-01 00:48:35
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-11-22 19:01:54
 * @FilePath: \site\js\import\NML\NML\Matrix_3D.js
 * @Description: 3D图形学矩阵
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

/*h*/// open * 类型注释 * open
    /*h*//** @typedef {Float32Array} CONFIG.VALUE_TYPE 矩阵计算时缓存下标的类型; 决定了计算时矩阵的n的大小 可选值为 Uint_N_Array, Int_N_Array */
    /*h*//** @typedef {number} int      整形数字 */
    /*h*//** @typedef {number} double   双浮点数字 */
    /*h*//** @typedef {number} float    单浮点数字 */
    /*h*//** @typedef {number[]|Float32Array|Float64Array} List_Value 数据的各种存储形式 */
/*h*/// end  * 类型注释 * end

import {copy_Array,approximately,CONFIG, SAFE_MATH_TOOLS} from "./Config.js";
import {Vector} from "./Vector.js";
import { Matrix } from "./Matrix.js";
/*h*/const {sin,cos,asin,acos,abs,sqrt,tan}=SAFE_MATH_TOOLS;

/*h*/const _MAPPING_SHEAR_COORDINATE_SYSTEM_TO_INDEX__3D=[8,4,1,9,6,2];
/*h*/const MAPPING_TRANSPOSE__3D  = new Int8Array([11,7,3,6,2,1, -1 ,4,8,9,12,13,14]);
/*h*/const _MATRIX_IDENTITY_4X4=new Matrix([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);

/** 用于创建3D变换矩阵的静态类 */
class Matrix_3D extends Matrix{
    constructor(data){
        super(16);
        if(data){
            copy_Array(this,data,16);
        }
    }

    /** 创建单位矩阵
     * @return {Matrix_3D} 返回一个2x2矩阵
     */
    static create_Identity(){
        return new Matrix_3D(_MATRIX_IDENTITY_4X4);
    }

    /** 矩阵转置
     * @param {Matrix_3D} out 要转置的矩阵
     * @return {Matrix_3D} 修改并返回 out
     */
    static transpose(out){
        var i=MAPPING_TRANSPOSE__3D.length-1,
            j=0;
        var temp_value;
        do{
            temp_value=out[i];
            out[i]=out[j];
            out[j]=temp_value;
            ++j;--i;
        }while(i!==j);
        return out;
    }

    /** 创建缩放矩阵
     * @param {flot} scale_x x坐标中的缩放系数
     * @param {flot} scale_y y坐标中的缩放系数
     * @param {flot} scale_z z坐标中的缩放系数
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_3D} 返回一个4x4矩阵
     */
    static create_Scale(scale_x,scale_y,scale_z,_out){
        return copy_Array(_out||new Matrix_3D(),[
            scale_x,    0,          0,          0,
            0,          scale_y,    0,          0,
            0,          0,          scale_z,    0,
            0,          0,          0,          1,
        ],16);
    }

    /** 创建旋转矩阵
     * @param {float} theta 旋转弧度
     * @param {int} axis 旋转中心轴  [z,x,y]
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_3D} 返回一个4x4矩阵
     */
    static create_Rotate(theta,axis,_out){
        // todo
        var out=_out||new Matrix_3D();
        var s=sin(CONFIG.COORDINATE_SYSTEM?-theta:theta),
            c=cos(theta);
            
        switch(axis){
            case 0: 
                // X
                copy_Array(out,[
                    1, 0, 0, 0,
                    0, c, s, 0,
                    0,-s, c, 0,
                    0, 0, 0, 1,
                ],16);
            break;
            
            case 1: 
                // Y
                copy_Array(out,[
                    c, 0,-s, 0,
                    0, 1, 0, 0,
                    s, 0, c, 0,
                    0, 0, 0, 1,
                ],16);
            break;
            
            case 2: 
                // Z
                copy_Array(out,[
                    c, s, 0, 0,
                   -s, c, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1,
                ],16);
            break;
        }
    }

    /** 创建旋转矩阵 使用任意旋转轴
     * @param {float} theta 旋转弧度
     * @param {List_Value} axis 一个3D向量表示的旋转轴
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_3D} 返回一个4x4矩阵
     */
    static create_Rotate__Axis(theta,axis,_out){
        var k     = Vector.is_Unit(axis)?axis:Vector.create_Normalization(axis),
            sin_t = sin(theta),
            cos_t = cos(theta),
            skx   = sin_t*k[0],
            sky   = sin_t*k[1],
            skz   = sin_t*k[2];

        var mat_3x3 = Matrix.create_TensorProduct(axis,axis,1,3,3,1);

        Matrix.np_b(mat_3x3,1-cos_t);

        mat_3x3[0] += cos_t;      mat_3x3[1] -= skz;        mat_3x3[2] += sky;
        mat_3x3[3] += skz;        mat_3x3[4] += cos_t;      mat_3x3[5] -= skx;
        mat_3x3[6] -= sky;        mat_3x3[7] += skx;        mat_3x3[8] += cos_t;

        var out=Matrix.create_NewSize(mat_3x3,3,4,3,4,0,0);

        if(_out){
            out=copy_Array(_out,out,16);
        }

        if(!CONFIG.COORDINATE_SYSTEM){
            Matrix_3D.transpose(out);
        }

        return out;
    }

    /** 创建旋转矩阵, 使用欧拉角
     * @param {List_Value} euler_angles 欧拉角参数 各旋转角角的弧度
     * @param {List_Value} [_axis] 矩阵乘法的旋转轴顺序 [z,x,y] 默认为 [0,1,2] (BPH)(zxy)
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_3D} 返回一个4x4矩阵
     */
    static create_Rotate__EulerAngles(euler_angles,_axis,_out){
        var axis=_axis||[0,1,2];
        var rtn = Matrix_3D.create_Rotate(euler_angles[0],axis[0]);
        for(var i=1;i<3;++i){
            rtn=Matrix.multiplication(rtn,Matrix_3D.create_Rotate(euler_angles[i],axis[i]),4,4);
        }
        if(_out) return copy_Array(_out,rtn);
        return rtn;
    }

    /** 创建旋转矩阵, 使用四元数
     * @param {List_Value} quat 欧拉角参数 各旋转角角的弧度
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_3D} 返回一个4x4矩阵
     */
    static create_Rotate__QUAT(quat,_out){
        // todo
    }

    /** 创建正交投影(平行投影)矩阵
     * @param {List_Value} normal 使用3d向量表示 投影面的法向
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_3D} 返回一个4x4矩阵
     */
    static create_Projection__Orthographic(normal,_out){
        var n= Vector.is_Unit(normal)?normal:Vector.create_Normalization(normal);
        var xx=n[0]*n[0],
            xy=n[0]*n[1],
            xz=n[0]*n[2],
            yy=n[1]*n[1],
            yz=n[1]*n[2],
            zz=n[2]*n[2];
        return copy_Array(_out||new Matrix_3D(),[
            1-xx,   -xy,    -xz,    0,
            -xy,    1-yy,   -yz,    0,
            -xz,    -yz,    1-zz,   0,
            0,      0,      0,      1
        ],16);
    }
    
    /** 创建切变矩阵
     * @param {List_Value[]} k_point  切变系数, 使用二维向量表示
     * @param {number} axis 在哪个面上进行切变 [xy,xz,yz]
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_3D} 返回一个4x4矩阵
     */
    static create_Shear(k_point,axis,_out){
        var rtn=Matrix_3D.create_Identity();
        rtn[_MAPPING_SHEAR_COORDINATE_SYSTEM_TO_INDEX__3D[axis]]    =k_point[0];
        rtn[_MAPPING_SHEAR_COORDINATE_SYSTEM_TO_INDEX__3D[axis+3]]  =k_point[1];
        if(_out) return copy_Array(_out,rtn);
        return rtn;
    }
    
    /** 创建镜像矩阵
     * @param {List_Value} normal 镜面的法向 3D向量
     * @return {Matrix_3D} 返回一个4x4矩阵
     */
    static create_Horizontal(normal){
        var i2xy=-2*normal[0]*normal[1],
            i2xz=-2*normal[0]*normal[2],
            i2yz=-2*normal[1]*normal[2];
        return copy_Array(_out||new Matrix_3D(),[
            1-2*normal[0]*normal[0],    i2xy,                       i2xz,                       0,
            i2xy,                       1-2*normal[1]*normal[1],    i2yz,                       0,
            i2xz,                       i2yz,                       1-2*normal[2]*normal[2],    0,
            0,                          0,                          0,                          1,
        ],16);
    }
}

Matrix_3D.ROTATE_RIGHT_X_CW_90DEG  =
Matrix_3D.ROTATE_LEFT_X_CCW_90DEG  = new Matrix_3D([ 1, 0, 0, 0, 0, 0, 1, 0, 0,-1, 0, 0, 0, 0, 0, 1]);

Matrix_3D.ROTATE_RIGHT_X_CCW_90DEG =
Matrix_3D.ROTATE_LEFT_X_CW_90DEG   = new Matrix_3D([ 1, 0, 0, 0, 0, 0,-1, 0, 0, 1, 0, 0, 0, 0, 0, 1]);

Matrix_3D.ROTATE_X_180DEG          = new Matrix_3D([ 1, 0, 0, 0, 0,-1, 0, 0, 0, 0,-1, 0, 0, 0, 0, 1]);

Matrix_3D.ROTATE_RIGHT_Y_CW_90DEG  =
Matrix_3D.ROTATE_LEFT_Y_CCW_90DEG  = new Matrix_3D([ 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]);

Matrix_3D.ROTATE_RIGHT_Y_CCW_90DEG =
Matrix_3D.ROTATE_LEFT_Y_CW_90DEG   = new Matrix_3D([ 0, 0,-1, 0, 0, 1, 0, 0,-1, 0, 0, 0, 0, 0, 0, 1]);

Matrix_3D.ROTATE_Y_180DEG          = new Matrix_3D([-1, 0, 0, 0, 0, 1, 0, 0, 0, 0,-1, 0, 0, 0, 0, 1]);

Matrix_3D.ROTATE_RIGHT_Z_CW_90DEG  =
Matrix_3D.ROTATE_LEFT_Z_CCW_90DEG  = new Matrix_3D([ 0, 1, 0, 0,-1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

Matrix_3D.ROTATE_RIGHT_Z_CCW_90DEG =
Matrix_3D.ROTATE_LEFT_Z_CW_90DEG   = new Matrix_3D([ 0,-1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

Matrix_3D.ROTATE_Z_180DEG          = new Matrix_3D([-1, 0, 0, 0, 0,-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

export{
    Matrix_3D
}