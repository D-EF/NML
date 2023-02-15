/*!
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2023-01-19 23:53:42
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2023-01-23 00:52:24
 * @FilePath: \site\js\import\NML\NML\Primitives-2D\simple\Rect.js
 * @Description: 2D 矩形
 * 
 * Copyright (c) 2023 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */



/*h*/// open * 类型注释 * open
    /*h*//** @typedef {Float32Array} CONFIG.VALUE_TYPE 矩阵计算时缓存下标的类型; 决定了计算时矩阵的n的大小 可选值为 Uint_N_Array, Int_N_Array */
    /*h*//** @typedef {number} int      整形数字 */
    /*h*//** @typedef {number} double   双浮点数字 */
    /*h*//** @typedef {number} float    单浮点数字 */
    /*h*//** @typedef {number[]|Float32Array|Float64Array} List_Value 数据的各种存储形式 */
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
        super(data);
        return;

        /** @type {float} x 绘制坐标 x*/
        this[0]=data.this[0];
        /** @type {float} y 绘制坐标 y */
        this[1]=data.this[1];
        /** @type {float} w 绘制宽度 */
        this[2]=data.this[2];
        /** @type {float} h 绘制高度 */
        this[3]=data.this[3];
    }

    // open * 访问器函数 * open

        /** @type {float} 定位点 x 坐标 */
            get x(){return this[0];}
            set x(val){
                this[0]=val;
                this.__cache_aabb=null;
                return this[0];
            }
        
        /** @type {float} 定位点 y 坐标 */
            get y(){return this[1];}
            set y(val){
                this[1]=val;
                this.__cache_aabb=null;
                return this[1];
            }

        /** @type {float} 绘制宽度 */
            get w(){return this[2];}
            set w(val){
                this[2]=val;
                this.refresh_Cache();
                return this[2];
            }

        /** @type {float} 绘制高度 */
            get h(){return this[3];}
            set h(val){
                this[3]=val;
                this.refresh_Cache();
                return this[3];
            }
        
    // end  * 访问器函数 * end 

    
    /** 刷新缓存数据 */
    refresh_Cache(){
        super.refresh_Cache();
    }

    static calc_AABB(rect){
        var min=new Vector(2),
            max=new Vector(2);

        if(rect[2]<0){
            min[0]=rect[0]+rect[2];
            max[0]=rect[0];
        }else{
            min[0]=rect[0];
            max[0]=rect[0]+rect[2];
        }
        if(rect[3]<0){
            min[1]=rect[1]+rect[3];
            max[1]=rect[1];
        }else{
            min[1]=rect[1];
            max[1]=rect[1]+rect[3];
        }

        return [min,max];
    }

    /** 计算矩形周长
     * @param {Rect}  rect 矩形数据
     * @return {float} 返回矩形周长
     */
    static calc_PathLength(rect){
        var w=abs(rect[2]),
            h=abs(rect[3]);
        return w+w+h+h;
    }
    
    /** 采样 (矩形路径绘制顺序 [xw,yh,-xw,-yh])
     * @param {Rect}    rect  矩形数据
     * @param {float}   t     时间参数 t (0~1)
     * @param {Vector} [_out] 输出对象
     * @return {Vector} 返回一个 2D 向量
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