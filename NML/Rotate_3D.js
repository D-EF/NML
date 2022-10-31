/*
* @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-11-01 01:36:50
 * @FilePath: \site\js\import\NML\NML\Rotate_3D.js
 * @Description: 3D旋转 
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

import {copy_Array,approximately,CONFIG, DEG_90, DEG_180} from "./Config.js";
import { Matrix_3 } from "./Graphics_Transform_Matrix.js";
import { Matrix, Vector } from "./Vector_Matrix.js";
/*h*/const {sin,cos,asin,acos,atan,atan2,abs,sqrt,tan}=Math;

/*h*//** @type {int[]} 对应轴向[z,x,y] (BPH)的旋转矩阵的空行/列的uv*/
/*h*/const _EulerAngles__MAPPING__NULL_UV_MATRIX=new Int8Array([2,0,1]);
/*h*//** @type {int[]} 左手坐标系的 对应轴向[z,x,y] (BPH)的旋转矩阵的-sin的下标*/
/*h*/const _EulerAngles__MAPPING__I_INDEX_MATRIX__LEFT=new Int8Array([1,5,6]);
/*h*//** @type {int[]} 右手坐标系的 对应轴向[z,x,y] (BPH)的旋转矩阵的-sin的下标*/
/*h*/const _EulerAngles__MAPPING__I_INDEX_MATRIX__RIGHT=new Int8Array([3,7,2]);
/*h*/function load_MK__EulerAngles_setup_Matrix(out,op,om){
    var m,i;
    do{ // m0
        m===0?m=2:--m;
        i=Matrix.get_Index(3,op,m);
        m===op?out[0]=m[i]:out[1]=m[i];
    }while(m!==om);
} 

/** 3d旋转控制 */
class Rotate_3D{
    /**
     * @param {List_Value} data 参数数据 根据长度判断使用什么构造过程
     * @param {Boolean} [_calc_flag] 是否在构造时计算(默认否) (9)矩阵/(3)欧拉角/(4)四元数
     * @param {int[]} [_euler_angles_axis] 欧拉角的顺序 (默认[0,1,2] (BPH)(zxy))
     */
    constructor(data,_calc_flag,_euler_angles_axis){
        this.
        /** @type {EulerAngles} 欧拉角数据 */
        this._euler_angles=new EulerAngles(3);
        /** @type {Int8Array[]} 欧拉角的顺序 (默认[0,1,2] (BPH)(zxy)) */
        this._euler_angles_axis=new Int8Array([0,1,2]);
        if(_euler_angles_axis)copy_Array(this._euler_angles_axis,_euler_angles_axis,3);
        /** @type {Quat} 四元数数据 */
        this._quat=new Quat(4);
        /** @type {Matrix_3} 矩阵数据 */
        this._matrix=new Matrix.create_Identity(3,3);
        switch(data.length){
            case 3:
                copy_Array(this._euler_angles,data,3);
                if(_calc_flag)this.reset__EulerAngles();
            break;
                
            case 4:
                copy_Array(this._quat,data,4);
                if(_calc_flag)this.reset__QUAT();
            break;
                    
            case 9:
                copy_Array(this._matrix,data,9);
                if(_calc_flag)this.reset__Matrix();
            break;

            default:
                console.warn("Have not data, please set it");
        }
    }

    /** 拷贝
     * @param {Rotate_3D} tgt Rotate_3D实例对象
     * @returns {Rotate_3D}
     */
    static copy(tgt){
        var rtn=new Rotate_3D();
        rtn.set__EulerAngles(tgt._euler_angles);
        rtn.set__Quat(tgt._quat);
        rtn.set__Matrix(tgt._matrix);
        return rtn;
    }

    /** 拷贝
     * @param {Rotate_3D} tgt Rotate_3D实例对象
     * @returns {Rotate_3D}
     */
    copy(){
        return Rotate_3D.copy(this);
    }

    /** 写入 欧拉角 数据
     * @param {EulerAngles} data 欧拉角数据
     * @param {int[]} [_euler_angles_axis] 欧拉角的顺序 (默认[0,1,2] (BPH)(zxy))
     * @return {Rotate_3D} 返回this
     */
    set__EulerAngles(data,_euler_angles_axis){
        copy_Array(this._euler_angles,data,3);
        if(_euler_angles_axis)copy_Array(this._euler_angles_axis,_euler_angles_axis,3);
    }

    /** 写入 四元数 数据
     * @param {Quat} data 四元数数据
     * @return {Rotate_3D} 返回this
     */
    set__Quat(data){
        copy_Array(this._quat,data,4);
    }

    /** 写入 矩阵   数据
     * @param {Matrix_3} data 矩阵数据
     * @return {Rotate_3D} 返回this
     */
    set__Matrix(data){
        copy_Array(this._matrix,data,9);
    }

    /** 使用 欧拉角 刷新数据 */
    reload__EulerAngles(){
        // todo
    }

    /** 使用 四元数 刷新数据 */
    reload__QUAT(){
        // todo 
    }

    /** 使用 矩阵   刷新数据 */
    reload__Matrix(){
        // todo
    }

    /** 创建逆旋转 矩阵
     * @return {Matrix_3} 返回旋转矩阵的逆矩阵(转置)
     */
    create_Inverse__Matrix(){
        return Matrix.create_Transposed(this._matrix);
    }

    /** 创建逆旋转 欧拉角
     * @return {[EulerAngles,Int8Array]} 返回逆旋转的欧拉角
     */
    create_Inverse__EulerAngles(){
        var v=this._euler_angles,
            a=this._euler_angles_axis;
        return [
            new EulerAngles([-v[2],-v[1],-v[0]]),
            new Int8Array([a[2],a[1],a[0]])
        ];
    }
    
    /** 创建逆旋转 四元数
     * @return {Quat} 返回逆旋转的四元数
     */
    create_Inverse__EulerAngles(){
        // todo
    }
}
/** 欧拉角 */
class EulerAngles extends CONFIG.VALUE_TYPE{

    /** 创建欧拉角
     * @param  {List_Value} data 欧拉角旋转数据 
     * @return {EulerAngles}返回一个新的欧拉角
     */
    create(data){
        var rtn=new EulerAngles(3);
        if(data){
            rtn[0]=data[0];
            rtn[1]=data[1];
            rtn[2]=data[2];
        }
        return rtn;
    }

    /** 使用矩阵生成欧拉角
     * @param  {Matrix_3}     m         仅做过旋转变换的矩阵
     * @param  {int[]}       [_axis]    创建旋转矩阵时的乘法顺序 [z,x,y] 默认为 [0,1,2] (BPH)(zxy)
     * @param  {List_Value}  [_out]      接收数据的对象
     * @return {EulerAngles} 修改并返回 out, 或返回一个新的欧拉角
     */
    static create_EulerAngles__Matrix(m,_axis,_out){
        var axis=_axis||[0,1,2];
        var u,v,i;
        var acs=axis[0]===axis[2]?acos:asin;
        var mk1;
        var mk0 = new Vector(2),
            mk2 = new Vector(2);
        var rtn=_out||new EulerAngles(3);
        var map_i=CONFIG.AXIS?  _EulerAngles__MAPPING__I_INDEX_MATRIX__LEFT:
                                _EulerAngles__MAPPING__I_INDEX_MATRIX__RIGHT;
        
        v=_EulerAngles__MAPPING__NULL_UV_MATRIX[axis[0]];
        u=_EulerAngles__MAPPING__NULL_UV_MATRIX[axis[2]];
        i=Matrix.get_Index(3,u,v);
        mk1= map_i.indexOf(i)?-m[i]:[i];

        if(approximately(abs(mk1),1)){ // Euler Angles Lock
            v=_EulerAngles__MAPPING__NULL_UV_MATRIX[axis[0]];
            u=_EulerAngles__MAPPING__NULL_UV_MATRIX[axis[1]];
            load_MK__EulerAngles_setup_Matrix(mk0,u,v);
            rtn[0]==atan2(mk0[1],mk0[0]);
            rtn[1]=axis[0]===axis[2]?DEG_180:DEG_90;
            rtn[2]=0;
        }else{ // default
            load_MK__EulerAngles_setup_Matrix(mk0,u,v)
            load_MK__EulerAngles_setup_Matrix(mk2,v,u)
            rtn[0]=atan2(mk0[1],mk0[0]);
            rtn[1]=acs(mk1);
            rtn[2]=atan2(mk2[0],mk2[1]);
        }
        return rtn;
    }
    

    /** 使用四元数生成欧拉角
     * @param  {Quat}         quat      四元数
     * @param  {int[]}       [_axis]    欧拉角旋转顺序 [z,x,y] 默认为 [0,1,2] (BPH)(zxy)
     * @param  {List_Value}  [out]      接收数据的对象
     * @return {EulerAngles} 修改并返回 out, 或返回一个新的欧拉角
     */
    static setup_QUAT(m){
        // todo
    }
}

/** 四元数 */
class Quat extends CONFIG.VALUE_TYPE{
    
    /** 使用矩阵计算出欧拉角
     * @param {Matrix_3} m 仅做过旋转变换的矩阵
     * @return {EulerAngles}
     */
    static setup_Matrix(m){
        // todo
    }

    /** 使用四元数
     * @param {Quat} m 仅做过旋转变换的矩阵
     * @return {EulerAngles}
     */
    static setup_EulerAngles(m){
        // todo
    }

}

export{
    Rotate_3D,
    EulerAngles,
    Quat,
}