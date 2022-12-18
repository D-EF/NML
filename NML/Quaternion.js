/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-11-10 02:56:44
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-12-18 23:40:17
 * @FilePath: \site\js\import\NML\NML\Quaternion.js
 * @Description: 四元数
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

import { copy_Array } from "./Config.js";
import { Euler_Angles } from "./Euler_Angles.js";
import { Vector } from "./Vector.js";

/*h*/// open * 类型注释 * open
    /*h*//** @typedef {Float32Array} CONFIG.VALUE_TYPE 矩阵计算时缓存下标的类型; 决定了计算时矩阵的n的大小 可选值为 Uint_N_Array, Int_N_Array */
    /*h*//** @typedef {Number} int      整形数字 */
    /*h*//** @typedef {Number} double   双浮点数字 */
    /*h*//** @typedef {Number} float    单浮点数字 */
    /*h*//** @typedef {Number[]|Float32Array|Float64Array|Matrix} List_Value 数据的各种存储形式 */
/*h*/// end  * 类型注释 * end

/*h*/const {sin,cos,asin,acos,abs,sqrt,tan}=Math;

/*h*/// 四元数 var t=theta*0.5; return [...cos_Vector(t,v3),cos(t)]

/** 四元数 使用线性结构 [x,y,z,w] */
class Quaternion extends Vector{
    
    /** 
     * @param {float[]} data 四元数数据
     */
    constructor(data){
        super(4);
        if(data){
            copy_Array(this,data,4);
        }
    }

    /** 使用矩阵计算出四元数
     * @param {Matrix} mat 仅做过旋转变换的矩阵
     * @return {Quaternion} 返回四元数
     */
    static setup_Matrix(mat){
        // todo
    }

    /** 使用欧拉角计算四元数
     * @param {Euler_Angles} euler_angles 欧拉角数据
     * @param  {int[]}      [_axis] 创建旋转矩阵时的乘法顺序 [z,x,y] 默认为 [0,1,2] (BPH)(zxy)
     * @return {Quaternion} 返回四元数
     */
    static setup_EulerAngles(euler_angles){
        // todo
    }

    /**
     * 提取虚部(旋转轴向量)
     * @param {Quaternion} quat 四元数数据
     * @return {Vector} 返回长度为 3 的向量
     */
    static get_AxisVector(quat){
        return [
            quat[1],
            quat[2],
            quat[3],
        ]
    }

    /**
     * 四元数的共轭 (逆)
     * @param {List_Value|Quaternion} quat  原数据四元数
     * @param {List_Value|Quaternion} out   输出对象
     * @return {List_Value|Quaternion} 返回新的四元数
     */
    static instead(quat,_out){
        var out=_out||new Quaternion();
        out[0]=+quat[0];
        out[1]=-quat[1];
        out[2]=-quat[2];
        out[3]=-quat[3];
        return out;
    }

    static multiplication(quat_left,r,_out){
        var r=quat_right,
            l=quat_left;
        var out=_out||new Quaternion();
        // [x,y,z,w]
		out[0] = l[0]*r[3] + l[3]*r[0] + l[1]*r[2] - l[2]*r[1];
		out[1] = l[1]*r[3] + l[3]*r[1] + l[2]*r[0] - l[0]*r[2];
		out[2] = l[2]*r[3] + l[3]*r[2] + l[0]*r[1] - l[1]*r[0];
		out[3] = l[3]*r[3] - l[0]*r[0] - l[1]*r[1] - l[2]*r[2];

		return out;
    }
}

Quaternion.IDENTITY=new Quaternion([0,0,0,1]);

export{
    Quaternion
}