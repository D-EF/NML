/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-11-01 00:48:35
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-11-10 03:14:25
 * @FilePath: \site\js\import\NML\NML\Matrix_3D.js
 * @Description: 3D图形学矩阵
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
import Vector from "./Vector.js";
import { Matrix } from "./Matrix.js";
import { Matrix_2 } from "./Matrix_2D.js";
/*h*/const {sin,cos,asin,acos,abs,sqrt,tan}=Math;

/*h*/const _MAPPING_SHEAR_AXIS_TO_INDEX__3D=[6,3,1];
/*h*/const MAPPING_TRANSPOSE__3D  = new Int8Array([5,1,2,     -1,     6,3,7]);

/** 用于创建3D变换矩阵的静态类 */
class Matrix_3 extends Matrix{
    constructor(data){
        super(9);
        if(data){
            this[0]=data[0]||0;
            this[1]=data[1]||0;
            this[2]=data[2]||0;
            this[3]=data[3]||0;
            this[4]=data[4]||0;
            this[5]=data[5]||0;
            this[6]=data[6]||0;
            this[7]=data[7]||0;
            this[8]=data[8]||0;
        }
    }

    /** 创建单位矩阵
     * @return {Matrix_3} 返回一个2x2矩阵
     */
    static create_Identity(){
        return new Matrix_3([1,0,0,0,1,0,0,0,1]);
    }

    /** 矩阵转置
     * @param {Matrix_3} out 要转置的矩阵
     * @return {Matrix_3} 修改并返回 out
     */
    static transpose(out){
        var i=MAPPING_TRANSPOSE__3D.length,
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
     * @returns {Matrix_3} 返回一个3x3矩阵
     */
    static create_Scale(scale_x,scale_y,scale_z,_out){
        return copy_Array(_out||new Matrix_3(),[
            scale_x,    0,          0,
            0,          scale_y,    0,
            0,          0,          scale_z
        ],9);
    }

    /** 创建旋转矩阵
     * @param {float} theta 旋转弧度
     * @param {int} axis 旋转中心轴  [z,x,y] 默认为 0 (z)
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_3} 返回一个3x3矩阵
     */
    static create_Rotate(theta,axis,_out){
        var out=_out||new Matrix_3([1,0,0,0,1,0,0,0,1]);
        return Matrix.setup(out,Matrix_2.create_Rotate(theta),2,3,2,3,axis,axis);
    }

    /** 创建旋转矩阵 使用任意旋转轴
     * @param {float} theta 旋转弧度
     * @param {List_Value} axis 一个3D向量表示的旋转轴
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_3} 返回一个3x3矩阵
     */
    static create_Rotate__Axis(theta,axis,_out){
        var k     = Vector.is_Unit(axis)?axis:Vector.create_Normalization(axis),
            sin_t = sin(theta),
            cos_t = cos(theta),
            rtn   = Matrix.create_TensorProduct(axis,axis,1,3,3,1),
            skx   = sin_t*k[0],
            sky   = sin_t*k[1],
            skz   = sin_t*k[2];

        Matrix.np_b(rtn,1-cos_t);

        rtn[0] += cos_t;      rtn[1] -= skz;        rtn[2] += sky;
        rtn[3] += skz;        rtn[4] += cos_t;      rtn[5] -= skx;
        rtn[6] -= sky;        rtn[7] += skx;        rtn[8] += cos_t;

        CONFIG.AXIS?rtn:Matrix.transpose(rtn,3,3);
        if(_out) return copy_Array(_out,rtn);
        return rtn;
    }

    /** 创建旋转矩阵, 使用欧拉角
     * @param {List_Value} euler_angles 欧拉角参数 各旋转角角的弧度
     * @param {List_Value} [_axis] 矩阵乘法的旋转轴顺序 [z,x,y] 默认为 [0,1,2] (BPH)(zxy)
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_3} 返回一个3x3矩阵
     */
    static create_Rotate__EulerAngles(euler_angles,_axis,_out){
        var axis=_axis||[0,1,2]
        var rtn = Matrix_3.create_Rotate(euler_angles[0],axis[0]);
        for(var i=1;i<3;++i){
            rtn=Matrix.multiplication(rtn,Matrix_3.create_Rotate(euler_angles[i],axis[i]),3,3);
        }
        if(_out) return copy_Array(_out,rtn);
        return rtn;
    }

    /** 创建旋转矩阵, 使用四元数
     * @param {List_Value} quat 欧拉角参数 各旋转角角的弧度
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_3} 返回一个3x3矩阵
     */
    static create_Rotate__QUAT(quat,_out){
        // todo
    }

    /** 创建正交投影(平行投影)矩阵
     * @param {List_Value} normal 使用3d向量表示 投影面的法向
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_3} 返回一个3x3矩阵
     */
    static create_Projection__Orthographic(normal,_out){
        var n= Vector.is_Unit(normal)?normal:Vector.create_Normalization(normal);
        var xx=n[0]*n[0],
            xy=n[0]*n[1],
            xz=n[0]*n[2],
            yy=n[1]*n[1],
            yz=n[1]*n[2],
            zz=n[2]*n[2];
        return copy_Array(_out||new Matrix_3(),[
            1-xx,   -xy,    -xz,
            -xy,    1-yy,   -yz,
            -xz,    -yz,    1-zz
        ],9);
    }
    
    /** 创建切变矩阵
     * @param {List_Value[]} k_point  切变系数, 使用二维向量表示
     * @param {Number} axis 在哪个面上进行切变 [xy,xz,yz]
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_3} 返回一个3x3矩阵
     */
    static create_Shear(k_point,axis,_out){
        var rtn=new Matrix_3([1,0,0,0,1,0,0,0,1]);
        var i=_MAPPING_SHEAR_AXIS_TO_INDEX__3D[axis]
        rtn[i]=k_point[0];
        ++i;
        rtn[i]?++i:0;
        rtn[i]=k_point[1];
        if(_out) return copy_Array(_out,rtn);
        return rtn;
    }
    
    /** 创建镜像矩阵
     * @param {List_Value} normal 镜面的法向 3D向量
     * @return {Matrix_3} 返回一个3x3矩阵
     */
    static create_Horizontal(normal){
        var i2xy=-2*normal[0]*normal[1],
            i2xz=-2*normal[0]*normal[2],
            i2yz=-2*normal[1]*normal[2];
        return copy_Array(_out||new Matrix_3(),[
            1-2*normal[0]*normal[0],    i2xy,                       i2xz,
            i2xy,                       1-2*normal[1]*normal[1],    i2yz,
            i2xz,                       i2yz,                       1-2*normal[2]*normal[2]
        ],9);
    }
}

Matrix_3.ROTATE_X_CCW_90DEG = new Matrix_3([1, 0, 0, 0, 0, 1, 0, -1, 0 ]);
Matrix_3.ROTATE_X_CW_90DEG  = new Matrix_3([1, 0, 0, 0, 0, 1, 0, -1, 0 ]);
Matrix_3.ROTATE_X_180DEG    = new Matrix_3([1, 0, 0, 0, -1, 0, 0, -0, -1 ]);
Matrix_3.ROTATE_Y_CCW_90DEG = new Matrix_3([0, 0, -1, 0, 1, 0, 1, 0, 0 ]);
Matrix_3.ROTATE_Y_CW_90DEG  = new Matrix_3([0, 0, -1, 0, 1, 0, 1, 0, 0 ]);
Matrix_3.ROTATE_Y_180DEG    = new Matrix_3([-1, 0, -0, 0, 1, 0, 0, 0, -1 ]);
Matrix_3.ROTATE_Z_CCW_90DEG = new Matrix_3([0, 1, 0, -1, 0, 0, 0, 0, 1 ]);
Matrix_3.ROTATE_Z_CW_90DEG  = new Matrix_3([0, 1, 0, -1, 0, 0, 0, 0, 1 ]);
Matrix_3.ROTATE_Z_180DEG    = new Matrix_3([-1, 0, 0, -0, -1, 0, 0, 0, 1 ]);
    
class Transform_Matrix_3D{
    constructor(){
        // todo
    }
}

export{
    Matrix_3,
    Transform_Matrix_3D
}