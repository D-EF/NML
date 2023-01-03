/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-11-10 02:56:44
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-12-30 17:49:29
 * @FilePath: \site\js\import\NML\NML\Quaternion.js
 * @Description: 四元数
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

import { copy_Array, SAFE_MATH_TOOLS } from "./Config.js";
import { Euler_Angles } from "./Euler_Angles.js";
import { Vector } from "./Vector.js";

/*h*/// open * 类型注释 * open
    /*h*//** @typedef {Float32Array} CONFIG.VALUE_TYPE 矩阵计算时缓存下标的类型; 决定了计算时矩阵的n的大小 可选值为 Uint_N_Array, Int_N_Array */
    /*h*//** @typedef {Number} int      整形数字 */
    /*h*//** @typedef {Number} double   双浮点数字 */
    /*h*//** @typedef {Number} float    单浮点数字 */
    /*h*//** @typedef {Number[]|Float32Array|Float64Array|Matrix} List_Value 数据的各种存储形式 */
/*h*/// end  * 类型注释 * end

/*h*/const {sin,cos,asin,acos,abs,sqrt,tan}=SAFE_MATH_TOOLS;

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

    /** 使用旋转轴和旋转弧度生成四元数
     * @param {Number} theta 旋转弧度
     * @param {Vector} axis 旋转轴向量 (3d单位向量)
     */
    static create_Axis(theta,axis){
        var theta_over2=theta*0.5;
        var sin_t=sin(theta_over2),
            cos_t=cos(theta_over2);
        return new Quaternion([sin_t*axis[0],sin_t*axis[1],sin_t*axis[2],cos_t]);
    }

    /** 使用四元数计算出旋转弧度
     * @param {Quaternion} quat  四元数
     * @return {float} 返回旋转弧度
     */
    static clac_Angle(quat){
        var theta_over2=acos(quat[3]);
        return theta_over2*2;
    }
    
    /** 使用四元数计算出旋转轴
     * @param {Quaternion} quat 四元数
     * @param {Vector} _out 输出对象
     * @return {Vector} 返回旋转向量
     */
    static clac_Axis(quat,_out){
        var w=quat[3];
        var sin_theta_over2_sq=1.0-w*w;
        var one_over_sin_theta_over2=1.0/sqrt(sin_theta_over2_sq);
        return copy_Array(_out||new Vector(3),[
            quat[0]*one_over_sin_theta_over2,
            quat[1]*one_over_sin_theta_over2,
            quat[2]*one_over_sin_theta_over2
        ]);
    }

    /** 使用矩阵生成四元数
     * @param {Matrix} mat 仅做过旋转变换的矩阵
     * @return {Quaternion} 返回四元数
     */
    static create_Matrix(mat){
        // todo
    }

    /** 使用欧拉角生成四元数
     * @param {Euler_Angles} euler_angles 欧拉角数据
     * @param  {int[]}      [_axis] 创建旋转矩阵时的乘法顺序 [z,x,y] 默认为 [0,1,2] (BPH)(zxy)
     * @return {Quaternion} 返回四元数
     */
    static create_EulerAngles(euler_angles){
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
        // [x,y,z,w]
        return copy_Array(_out||new Quaternion(),[
            l[3]*r[0] + l[0]*r[3] + l[2]*r[1] - l[1]*r[2], // x
            l[3]*r[1] + l[1]*r[3] + l[0]*r[2] - l[2]*r[0], // y
            l[3]*r[2] + l[2]*r[3] + l[1]*r[0] - l[0]*r[1], // z
            l[3]*r[3] - l[0]*r[0] - l[1]*r[1] - l[2]*r[2]  // w
        ]);
    }

}

/** @type {Quaternion} 此处定义单位四元数为: 旋转轴[1,0,0], 旋转弧度0 的四元数 */
Quaternion.IDENTITY=new Quaternion([1,0,0,0]);

export{
    Quaternion
}