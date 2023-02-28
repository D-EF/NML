/*!
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2023-02-28 22:47:35
 * @FilePath: \site\js\import\NML\NML\Vector.js
 * @Description: 向量
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

/*h*/// open * 类型注释 * open
    /*h*//** @typedef {number} int      整形数字 */
    /*h*//** @typedef {number} double   双浮点数字 */
    /*h*//** @typedef {number} float    单浮点数字 */
    /*h*//** @typedef {import("../Config__NML.js").List_Value} List_Value 数据的各种存储形式 */
    /*h*//** @typedef {Vector|List_Value} Vec 视作向量的各种数据格式 */
/*h*/// end  * 类型注释 * end

import {copy_Array,approximately,CONFIG, SAFE_MATH_TOOLS, NML_VALUE_TYPE} from "../Config__NML.js";
/*h*/const {sin,cos,asin,acos,abs,sqrt,tan}=SAFE_MATH_TOOLS;

/** 向量 */
class Vector extends NML_VALUE_TYPE{
    // 继承使用 CONFIG.VALUE_TYPE 的构造函数

    /** 判断2d向量在哪个象限上, 规定 0 视作正
     * @param  {Vec} vec 向量
     * @return {int} 返回在哪个象限
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
     * @param  {Vec} vec 向量
     * @return {number} 返回模长
     */
    static mag(vec) {
        var Squares=0;
        for(var i =vec.length-1;i>=0;--i){
            Squares+=vec[i]*vec[i];
        }
        return sqrt(Squares);
    }

    /** 判断某个向量是否为单位向量
     * @param {Vec}        vec                  向量
     * @param {float}      [_tolerance]         容差 默认为CONFIG.APPROXIMATELY_TOLERANCE
     * @return {boolean}   返回是否为单位向量
     */
    static is_Unit(vec,_tolerance){
        return abs(1-Vector.dot(vec,vec))<(_tolerance||CONFIG.APPROXIMATELY_TOLERANCE);
    }

    /** 创建标准化向量
     * @param  {Vec} vec 原向量
     * @return {Vector} 返回新的向量
     */
    static create_Normalization(vec){
        return Vector.normalize(new Vector(vec));
    }

    /** 标准化向量 (如果传入零向量，将返回[1,0,0,...])
     * @template {Vec} T
     * @param  {T} vec 向量
     * @return {T} 修改并返回 vec
     */
    static normalize(vec) {
        if(!Vector.is_Zero__Strict(vec)){
            console.warn(`Function <Vector.normalize(vec)> has a zero vector param!`);
            vec[0]=1;
            for(var i=vec.length-1;i>0;--i){
                vec[i]=0;
            }
        }else{
            var magSq = Vector.mag(vec),
            oneOverMag=0;
            oneOverMag = 1.0/magSq;
            for(var i =vec.length-1;i>=0;--i){
                vec[i] *= oneOverMag;
            }
        }
        return vec;
    }

    /** 判断向量是不是零向量 (严格的,不考虑浮点数误差)
     * @param  {Vec} vec 向量
     * @return {number} 返回0或非0
     */
    static is_Zero__Strict(vec){
        var i=vec.length;
        do{
            --i;
        }while((!vec[i])&&i>0)
        return vec[i];
    }
    
    /** 取反
     * @param  {Vec} vec 向量
     * @param  {Vec} [_out] 输出目标
     * @return {Vec} 返回 修改后的 _out 或 新的向量
     */
    static instead(vec,_out){
        var out=_out||new Vector(vec.length);
        for(var i=out.length-1;i>=0;--i){
            out[i]=-vec[i];
        }
        return out;
    }
    
    /** 求向量和
     * @param  {Vec} vec_left 向量1
     * @param  {Vec} vec_right 向量2
     * @return {Vector} 返回新的向量
     */
    static sum(vec_left,vec_right){
        return Vector.translate(new Vector(vec_left),vec_right);
    }
    
    /** 平移
     * @template {Vec} _Out_Vec
     * @param {_Out_Vec} vec_left  原向量
     * @param {Vec} vec_right  偏移量向量
     * @return {_Out_Vec} 修改并返回 vec_left
     */
    static translate(vec_left,vec_right){
        if(vec_left.length!==vec_right.length) throw new Error("They vectors have different length!")
        for(var i=vec_left.length-1;i>=0;--i){
            vec_left[i]+=vec_right[i];
        }
        return vec_left;
    }
    
    /** 求向量差 1-2
     * @param {Vec} vec_left 向量1
     * @param {Vec} vec_right 向量2
     * @return {Vector} 返回一个新向量
     */
    static dif(vec_left,vec_right){
        //@ts-ignore
        return Vector.translate(Vector.instead(vec_right),vec_left);
    }
    
    /** 数字乘向量 
     * @param {Vec} vec    向量
     * @param {number} k 标量
     * @return {Vec} 返回新的向量
     */
    static np(vec,k){
        return Vector.np_b(new Vector(vec),k);
    }

    /** 数字乘向量 
     * @param {Vec} vec    向量
     * @param {number} k 标量
     * @return {Vec}  修改并返回 vec
     */
    static np_b(vec,k){
        for(var i=vec.length-1;i>=0;--i){
            vec[i]*=k;
        }
        return vec;
    }

    /** 向量内积
     * @param {Vec} vec_left 向量1
     * @param {Vec} vec_right 向量2
     * @return {number} 返回 vec_left * vec_right
     */
    static dot(vec_left,vec_right){
        if(vec_left.length!==vec_right.length) throw new Error("They vectors have different length!")
        var rtn=0;
        for(var i=vec_left.length-1;i>=0;--i){
            rtn+=vec_left[i]*vec_right[i];
        }
        return rtn;
    }

    /** 向量外积(叉乘) 此处仅可用长度为3的数组或类数组 vec.length === 3
     * @param {Vec} vec_left    向量1 length=3
     * @param {Vec} vec_right   向量2 length=3
     * @param {Vec} [_out]      输出对象
     * @throws {TypeError} 参数 vec_left 或 vec_right 长度不等于3时, 将会报错
     * @return {Vec} 返回 vec_left x vec_right
     */
    static cross(vec_left,vec_right,_out){
        var l=vec_left,r=vec_right;
        var out=_out;
        if(l.length===3&&r.length===3){
            var x= l[1]*r[2] - l[2]*r[1],    // x : y1z2-z1y2
                y= l[2]*r[0] - l[0]*r[2],    // y : z1x2-x1z2
                z= l[0]*r[1] - l[1]*r[0];    // z : x1y2-y1x2
            if(!out) out=new Vector(3);
            out[0]=x;   out[1]=y;   out[2]=z;
        }
        else throw new TypeError("This function's arguments must use Vec, and length=3! ");
        return out;
    }

    /** 计算向量夹角 ∠AOB 的 cos
     * @param {Vec} vec_left 表示角的一边的射线上 的 向量A
     * @param {Vec} vec_right 表示角的一边的射线上 的 向量B
     * @return {number} 返回夹角的cos值
     */
    static cos_2Vec(vec_left,vec_right){
        return Vector.dot(vec_left,vec_right)/(Vector.mag(vec_left)*Vector.mag(vec_right));
    }
}

export{
    Vector
}