/*!
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-11-10 02:49:29
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-12-01 16:34:40
 * @FilePath: \site\js\import\NML\NML\Euler_Angles.js
 * @Description: 欧拉角
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

import { CONFIG, SAFE_MATH_TOOLS } from "../Config__NML.js";
import { Matrix } from "./Matrix.js";
import { Matrix_3D } from "./Matrix_3D.js";
import {Vector} from "./Vector.js";

/*h*/const {sin,cos,asin,acos,abs,sqrt,tan}=SAFE_MATH_TOOLS;

// open * 部分映射函数和映射表 * open

    /** @type {int[]} 对应轴向[z,x,y] (BPH)的旋转矩阵的空行/列的uv*/
    const _MAPPING__EulerAngles_NULL_UV_MATRIX=new Int8Array([2,0,1]);

    /** @type {int[]} 左手坐标系的 对应轴向[z,x,y] (BPH)的旋转矩阵的-sin的下标*/
    const _MAPPING__EulerAngles_INVERSE_INDEX_MATRIX__LEFT=new Int8Array([3,7,2]);

    /** @type {int[]} 右手坐标系的 对应轴向[z,x,y] (BPH)的旋转矩阵的-sin的下标*/
    const _MAPPING__EulerAngles_INVERSE_INDEX_MATRIX__RIGHT=new Int8Array([1,5,6]);

    /** @type {int[]} 典型欧拉角的cos值uv值映射 */
    const _MAPPING__PROPER_EULER_ANGLE_COS=new Int8Array([
        -1,
        1, // [0,1,0] 01
        0, // [0,2,0] 10
        1, // [1,0,1] 10
        -1,
        2, // [1,2,1] 01
        0, // [2,0,2] 01
        2  // [2,1,2] 10
    ]);

    /** @type {int[]} 典型欧拉角是否使用置负的uv值映射 */
    const _MAPPING__PROPER_EULER_ANGLE_INVERSE=new Int8Array([-1,0,1,1,-1,0,0,1]);

    /** 获取atan2时使用的数据 
     * @param {List_Value} out         输出对象
     * @param {int}        op_static   静指针(下标)
     * @param {int}        op_move     动指针(下标)
     * @param {List_Value} mat         矩阵数据
     * @param {int[]}      map_inverse 坐标系-sin映射表
     * @param {boolean}    uv_o_vu     静指针-动指针 是u-v(true)还是v-u(false)
     * @param {int}        cos_uv      cos的uv
     * @param {boolean}    f_inverse   是否使用置负
     */
    function load_MK__EulerAngles_setup_Matrix(out,op_static,op_move,mat,map_inverse,uv_o_vu,cos_uv,f_inverse){
        var p=op_move,i,j;
        --p
        do{ // out[1]:cos, out[0]:sin
            i=uv_o_vu?Matrix.get_Index(3,op_static,p):Matrix.get_Index(3,p,op_static);
            j=p===cos_uv?0:1;
            out[j]=((~map_inverse.indexOf(i))&&(f_inverse))?-mat[i]:mat[i];
            p===0?p=2:--p;
        }while(p!==op_move);
    }

// end  * 部分映射函数和映射表 * end 

/** 欧拉角 */
class Euler_Angles extends CONFIG.VALUE_TYPE{

    /** 创建欧拉角
     * @param  {List_Value} data 欧拉角旋转数据 
     * @return {Euler_Angles}返回一个新的欧拉角
     */
    create(data){
        var rtn=new Euler_Angles(3);
        if(data){
            rtn[0]=data[0];
            rtn[1]=data[1];
            rtn[2]=data[2];
        }
        return rtn;
    }

    /**
     * @param {Matrix_3D} mat 4x4 旋转矩阵
     * @param  {int[]}      [_axis] 创建旋转矩阵时的乘法顺序 [z,x,y] 默认为 [0,1,2] (BPH)(zxy)
     * @param  {List_Value} [_out]  接收数据的对象
     * @return {Euler_Angles} 修改并返回 out, 或返回一个新的欧拉角
     */
    static create_EulerAngles__Matrix4x4(mat,_axis,_out){
        return Euler_Angles.create_EulerAngles__Matrix3x3([
            mat[0],mat[1],mat[2],
            mat[4],mat[5],mat[6],
            mat[8],mat[9],mat[10]
        ],_axis,_out);
    }

    /** 使用矩阵生成欧拉角
     * @param  {Matrix}      mat    仅做过旋转变换的3x3矩阵
     * @param  {int[]}      [_axis] 创建旋转矩阵时的乘法顺序 [z,x,y] 默认为 [0,1,2] (BPH)(zxy)
     * @param  {List_Value} [_out]  接收数据的对象
     * @return {Euler_Angles} 修改并返回 out, 或返回一个新的欧拉角
     */
    static create_EulerAngles__Matrix3x3(mat,_axis,_out){
        var axis=_axis||[0,1,2];
        var u,v,index,cos_uv,flag_inverse;
        var acs=axis[0]===axis[2]?acos:asin;
        var sin_axis1;
        var sin_cos_axis0 = new Vector(2),
            sin_cos_axis2 = new Vector(2);
        var rtn=_out||new Euler_Angles(3);
        var map__inverse=CONFIG.COORDINATE_SYSTEM?  _MAPPING__EulerAngles_INVERSE_INDEX_MATRIX__LEFT:_MAPPING__EulerAngles_INVERSE_INDEX_MATRIX__RIGHT;
        
        v=_MAPPING__EulerAngles_NULL_UV_MATRIX[axis[0]];
        u=_MAPPING__EulerAngles_NULL_UV_MATRIX[axis[2]];
        index=Matrix.get_Index(3,u,v);
        sin_axis1= ~map__inverse.indexOf(index)?-mat[index]:mat[index];

        if(approximately(abs(sin_axis1),1)){ // Euler Angles Lock
            v=_MAPPING__EulerAngles_NULL_UV_MATRIX[axis[0]];
            u=_MAPPING__EulerAngles_NULL_UV_MATRIX[axis[1]];
            load_MK__EulerAngles_setup_Matrix(sin_cos_axis0,u,v,mat,map__inverse,true,u,true);
            rtn[0]=atan2(sin_cos_axis0[1],sin_cos_axis0[0]);
            rtn[1]=axis[0]===axis[2]?DEG_180:DEG_90;
            rtn[2]=0;
        }else{ // default
            if(axis[0]===axis[2]){
                index=axis[0]*3+axis[1];
                cos_uv=_MAPPING__PROPER_EULER_ANGLE_COS[index];
                flag_inverse=_MAPPING__PROPER_EULER_ANGLE_INVERSE[index];
                load_MK__EulerAngles_setup_Matrix(sin_cos_axis0,u,v,mat,map__inverse,true ,cos_uv,!flag_inverse);
                load_MK__EulerAngles_setup_Matrix(sin_cos_axis2,v,u,mat,map__inverse,false,cos_uv,flag_inverse);
            }else{
                load_MK__EulerAngles_setup_Matrix(sin_cos_axis0,u,v,mat,map__inverse,true ,u,true);
                load_MK__EulerAngles_setup_Matrix(sin_cos_axis2,v,u,mat,map__inverse,false,v,true);
            }
            rtn[0]=atan2(sin_cos_axis0[1],sin_cos_axis0[0]);
            rtn[1]=acs(sin_axis1);
            rtn[2]=atan2(sin_cos_axis2[1],sin_cos_axis2[0]);
        }
        return rtn;
    }
    

    /** 使用四元数生成欧拉角
     * @param  {Quat}         quat      四元数
     * @param  {int[]}       [_axis]    欧拉角旋转顺序 [z,x,y] 默认为 [0,1,2] (BPH)(zxy)
     * @param  {List_Value}  [out]      接收数据的对象
     * @return {Euler_Angles} 修改并返回 out, 或返回一个新的欧拉角
     */
    static create_EulerAngles__QUAT(m){
        // todo
    }
}

export{
    Euler_Angles
}