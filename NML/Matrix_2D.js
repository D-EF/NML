
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
/*h*/const {sin,cos,asin,acos,abs,sqrt,tan}=Math;

/** 用于创建2d变换矩阵的静态类 */
class Matrix_2 extends Matrix{
    constructor(data){
        super(4);
        if(data){
            this[0]=data[0]||0;
            this[1]=data[1]||0;
            this[2]=data[2]||0;
            this[3]=data[3]||0;
        }
    }

    /** 创建单位矩阵
     * @return {Matrix_2} 返回一个2x2矩阵
     */
    static create_Identity(){
        return new Matrix_2([1,0,0,1]);
    }

    /** 创建旋转矩阵
     * @param {Number} theta 顺时针 旋转角弧度
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_2} 返回一个2x2矩阵
     */
    static create_Rotate(theta,_out){
        var s=Math.sin(theta),
            c=Math.cos(theta);
        CONFIG.AXIS?0:s*=-1;
        var out=_out||new Matrix_2();
        out[0]=c;  out[1]=s;
        out[2]=-s; out[3]=c;
        return out;
    }

    /** 创建旋转矩阵 从(1,0)旋转到目标向量
     * @param {Vector} vec 目标向量(2d)
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_2} 返回一个2x2矩阵
     */
    static create_Rotate__Vector(vec,_out){
        var unit_v=Vector.is_Unit(vec)?vec:Vector.create_Normalization(vec),
            s=unit_v[1];
        CONFIG.AXIS?0:s*=-1;
        var out=_out||new Matrix_2();
        out[0]=c;  out[1]=s;
        out[2]=-s; out[3]=c;
        return out;
    }

    /** 创建缩放矩阵
     * @param {Number} scale_x x 轴方向上的缩放系数
     * @param {Number} scale_y y 轴方向上的缩放系数
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_2} 返回一个2x2矩阵
     */
    static create_Scale(scale_x,scale_y,_out){
        var out=_out||new Matrix_2();
            out[0]=scale_x; out[1]=0;
            out[2]=0;       out[3]=scale_y;
            return out;
    }

    /** 创建镜像矩阵(对称)
     * @param {Vector} normal 对称轴的法向坐标
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_2} 返回一个2x2矩阵
     */
    static create_Horizontal(normal,_out){
        var i2xy=-2*normal[0]*normal[1];
        var out=_out||new Matrix_2();
        out[0]=1-2*normal[0]*normal[0];  
        out[1]=i2xy;
        out[2]=i2xy;
        out[3]=1-2*normal[1]*normal[1];
        return out;
    }

    /** 创建切变矩阵
     * @param {Number} k_x x方向的切变系数
     * @param {Number} k_y y方向的切变系数
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix_2} 返回一个2x2矩阵
     */
    static create_Shear(k_x,k_y,_out){
        var out=_out||new Matrix_2();
        out[0]=1;   out[1]=k_y;
        out[2]=k_x; out[3]=1;
        return out;
    }

    /** 创建等比缩放&旋转矩阵 根据向量生成矩阵
     * @param {List_Value} vec_l2 2d向量
     * @param  {List_Value}  [_out] 接收数据的对象
     * @return {Matrix}_2  返回一个2x2矩阵
     */
    static create_ByVector(vec_l2,_out){
        var s=vec_l2[1];
        CONFIG.AXIS?0:s*=-1;
        var out=_out||new Matrix_2();
        out[0]=vec_l2[0];   out[1]=-s;
        out[2]=s;           out[3]=vec_l2[0];
        return out;
    }
}

Matrix_2.ROTATE_90=new Matrix_2([0,1,-1,0]);
Matrix_2.ROTATE_90_I=new Matrix_2([0,-1,1,0]);
Matrix_2.FLIP_HORIZONTAL=new Matrix_2([-1,0,0,1]);

class Transform_Matrix_2D{
    constructor(){
        // todo
    }
}

export{
    Matrix_2,
    Transform_Matrix_2D
}