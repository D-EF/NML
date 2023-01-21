/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2023-01-19 23:53:42
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2023-01-21 03:49:27
 * @FilePath: \site\js\import\NML\NML\Primitives-2D\rect.js
 * @Description: 2D 矩形
 * 
 * Copyright (c) 2023 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */



/*h*/// open * 类型注释 * open
    /*h*//** @typedef {Float32Array} CONFIG.VALUE_TYPE 矩阵计算时缓存下标的类型; 决定了计算时矩阵的n的大小 可选值为 Uint_N_Array, Int_N_Array */
    /*h*//** @typedef {Number} int      整形数字 */
    /*h*//** @typedef {Number} double   双浮点数字 */
    /*h*//** @typedef {Number} float    单浮点数字 */
    /*h*//** @typedef {Number[]|Float32Array|Float64Array} List_Value 数据的各种存储形式 */
/*h*/// end  * 类型注释 * end

import { CONFIG, copy_Array, SAFE_MATH_TOOLS } from "../Config.js";
import { Vector } from "../Vector.js";
import { Primitive_Data_Base } from "./base.js";

const {abs,cos,sin,tan,asin,acos,atan,atan2} = SAFE_MATH_TOOLS;

/** 矩形 */
class Rect extends Primitive_Data_Base{

    /** 
     * @param {Rect} data 矩形数据
     */
    constructor(data){
        super(4);

        /** @type {float} x 绘制坐标 x*/
        this[0]=data.this[0];
        /** @type {float} y 绘制坐标 y */
        this[1]=data.this[1];
        /** @type {float} w 绘制宽度 */
        this[2]=data.this[2];
        /** @type {float} h 绘制高度 */
        this[3]=data.this[3];

        this.__cache_path_length=-1;
    }
    /** @type {[min:Vector,max:Vector]} 矩形周长 */
    get path_length(){
        if(!~this.__cache_path_length){
            var w=abs(this[2]),
                h=abs(this[3]);
            this.__cache_path_length=w+w+h+h;
        }
    }
    
    /** 采样 (矩形路径绘制顺序 [xw,yh,-xw,-yh])
     * @param {Rect}    rect  矩形数据
     * @param {float}   t     时间参数 t (0~1)
     * @param {Vector} [_out] 输出对象
     * @returns {Vector} 返回一个 2D 向量
     */
    static sample(rect,t,_out){
        var out=_out||new Vector(2);
        if(t===0){
            out[0]=rect[0];
            out[1]=rect[1];
        }
        else if(t===0.5){
            out[0]=rect[0]+rect[2];
            out[1]=rect[1]+rect[3];
        }
        else{
            var w=abs(this[2]),
                h=abs(this[3]),
                path_length=w+h,
                weight_w=w/path_length,
                weight_h=h/path_length,
                time,time_w,time_h;
            
            time=t+t-1;
            if(time>weight_w){
                time_w=1;
                time_h=(time-weight_w)/weight_h;
            }else{
                time_w=time/weight_w;
                time_h=0;
            }
            if(t>0.5){
                time_w=1-time_w;
                time_y=1-time_y;
            }
            out[0]=rect[0]+rect[2]*time_w;
            out[1]=rect[1]+rect[3]*time_h;
        }
        return out;
    }
}

export{
    Rect
}