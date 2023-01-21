/*
* @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2023-01-04 01:24:13
 * @FilePath: \site\js\import\NML\NML\Vector.js
 * @Description: 向量
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

/*h*/// open * 类型注释 * open
    /*h*//** @typedef {Float32Array} CONFIG.VALUE_TYPE 矩阵计算时缓存下标的类型; 决定了计算时矩阵的n的大小 可选值为 Uint_N_Array, Int_N_Array */
    /*h*//** @typedef {Number} int      整形数字 */
    /*h*//** @typedef {Number} double   双浮点数字 */
    /*h*//** @typedef {Number} float    单浮点数字 */
    /*h*//** @typedef {Number[]|Float32Array|Float64Array} List_Value 数据的各种存储形式 */
/*h*/// end  * 类型注释 * end

import {copy_Array,approximately,CONFIG, SAFE_MATH_TOOLS} from "./Config.js";
/*h*/const {sin,cos,asin,acos,abs,sqrt,tan}=SAFE_MATH_TOOLS;

/** 向量 */
class Vector extends CONFIG.VALUE_TYPE{
    // 继承使用 CONFIG.VALUE_TYPE 的构造函数

    /** 判断2d向量在哪个象限上, 规定 0 视作正
     * @param  {List_Value} vec 向量
     * @returns {int} 返回在哪个象限
     */
    static v2__get_Quadrant(vec){
        var f1=vec[0]>=0,f2=vec[1]>=0;
        if(f1){
            if(f2)  return 1;
            else    return 4;
        }else{
            if(f2)  return 2; 
            else    return 3; 
        }
    }
    
    /** 求模长
     * @param  {List_Value} vec 向量
     * @returns {Number} 返回模长
     */
    static mag(vec) {
        var Squares=0;
        for(var i =vec.length-1;i>=0;--i){
            Squares+=vec[i]*vec[i];
        }
        return sqrt(Squares);
    }

    /** 判断某个向量是否为单位向量
     * @param {List_Value} vec 向量
     * @param {float}      _tolerance 容差 默认为CONFIG.APPROXIMATELY_TOLERANCE
     * @param {boolean} 返回是否为单位向量
     */
    static is_Unit(vec,_tolerance){
        return abs(1-Vector.dot(vec,vec))<(_tolerance||CONFIG.APPROXIMATELY_TOLERANCE);
    }

    /** 创建标准化向量
     * @param  {List_Value} vec 向量
     * @returns {Vector} 返回新的向量
     */
    static create_Normalization(vec){
        return Vector.normalize(new Vector(vec));
    }

    /** 标准化向量
     * @param  {List_Value} vec 向量
     * @returns {List_Value} 修改并返回 vec
     */
    static normalize(vec) {
        if(!Vector.is_Zero__Strict(vec))throw new Error("This is a zero Vector.");
        var magSq = Vector.mag(vec),oneOverMag=0;
        if (magSq>0) {
            oneOverMag = 1.0/magSq;
            for(var i =vec.length-1;i>=0;--i){
                vec[i] *= oneOverMag;
            }
        }else{
            console.warn("This is a zero vector!");
            copy_Array(vec,new Vector(vec.length));
            vec[0]=1;
        }
        return vec;
    }

    /** 判断向量是不是零向量 (严格的,不考虑浮点数误差)
     * @param  {List_Value} vec 向量
     * @returns {Number} 返回0或非0
     */
    static is_Zero__Strict(vec){
        var i=vec.length;
        do{
            --i;
        }while((!vec[i])&&i>0)
        return vec[i];
    }
    
    /** 取反
     * @param  {List_Value} vec 向量
     * @param  {List_Value} [_out] 输出目标
     * @returns {List_Value|Vector} 返回 _out 或 新的向量
     */
    static instead(vec,_out){
        var out=_out||new Vector(vec.length);
        for(var i=out.length-1;i>=0;--i){
            out[i]=-vec[i];
        }
        return out;
    }
    
    /** 求向量和
     * @param  {List_Value} vec_left 向量1
     * @param  {List_Value} vec_right 向量2
     * @returns {Vector} 返回新的向量
     */
    static sum(vec_left,vec_right){
        return Vector.translate(new Vector(vec_left),vec_right);
    }
    
    /** 平移
     * @param {List_Value} vec_left  原向量
     * @param {List_Value} vec_right  偏移量向量
     * @returns {List_Value} 修改并返回 vec_left
     */
    static translate(vec_left,vec_right){
        if(vec_left.length!==vec_right.length) throw new Error("They vectors have different length!")
        for(var i=vec_left.length-1;i>=0;--i){
            vec_left[i]+=vec_right[i];
        }
        return vec_left;
    }
    
    /** 求向量差 1-2
     * @param {List_Value} vec_left 向量1
     * @param {List_Value} vec_right 向量2
     * @returns {Vector} 返回一个新向量
     */
    static dif(vec_left,vec_right){
        return Vector.translate(Vector.instead(vec_right),vec_left);
    }
    
    /** 数字乘向量 
     * @param {List_Value} vec    向量
     * @param {Number} k 标量
     * @returns {Vector} 返回新的向量
     */
    static np(vec,k){
        return Vector.np_b(new Vector(vec),k);
    }

    /** 数字乘向量 
     * @param {List_Value} vec    向量
     * @param {Number} k 标量
     * @returns {Vector}  修改并返回 v
     */
    static np_b(vec,k){
        for(var i=vec.length-1;i>=0;--i){
            vec[i]*=k;
        }
        return vec;
    }

    /** 向量内积
     * @param {List_Value} vec_left 向量1
     * @param {List_Value} vec_right 向量2
     * @returns {Number} 返回 vec_left * vec_right
     */
    static dot(vec_left,vec_right){
        if(vec_left.length!==vec_right.length) throw new Error("They vectors have different length!")
        var rtn=0;
        for(var i=vec_left.length-1;i>=0;--i){
            rtn+=vec_left[i]*vec_right[i];
        }
        return rtn;
    }

    /** 向量外积 仅支持 3D 和 2D 向量
     * @param {List_Value} vec_left 向量1
     * @param {List_Value} vec_right 向量2
     * @returns {Number|List_Value} 返回 vec_left x vec_right
     */
    static cross(vec_left,vec_right){
        if(vec_left.length===2&&vec_right.length===2)return vec_left[0]*vec_right[1]-vec_left[1]*vec_right[0];
        else if(vec_left.length===3&&vec_right.length===3) return  new Vector([
            vec_left[1]*vec_right[2]-vec_left[2]*vec_right[1],    // x : y1z2-z1y2
            vec_left[2]*vec_right[0]-vec_left[0]*vec_right[2],    // y : z1x2-x1z2
            vec_left[0]*vec_right[1]-vec_left[1]*vec_right[0]     // z : x1y2-y1x2
        ]);
        else throw new Error("This function only run in 2D or 3D Vector! ");
    }

    /** 计算向量夹角 ∠AOB 的 cos
     * @param {List_Value} vec_left 表示角的一边的射线上 的 向量A
     * @param {List_Value} vec_right 表示角的一边的射线上 的 向量B
     * @returns {Number} 返回夹角的cos值
     */
    static cos_2Vec(vec_left,vec_right){
        return Vector.dot(vec_left,vec_right)/(Vector.mag(vec_left)*Vector.mag(vec_right));
    }
}

export{
    Vector
}