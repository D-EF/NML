/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2023-01-19 23:53:49
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2023-01-20 21:44:35
 * @FilePath: \site\js\import\NML\NML\Primitives-2D\arc.js
 * @Description: 2D 圆形、椭圆、圆弧、扇形等
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

class Arc extends Primitive_Data_Base{
    /**
     * @param {Arc} data 
     */
    constructor(data){
        super(5);

        /** @type {Number} 圆心 x 坐标 */
        this[0]=data[0];
        /** @type {Number} 圆心 x 坐标 */
        this[1]=data[1];
        /** @type {Number} 圆半径 */
        this[2]=data[2];
        /** @type {Number} 弧线端点 a 弧度 渲染时作为绘制起点 */
        this[3]=data[3];
        /** @type {Number} 弧线端点 b 弧度 渲染时作为绘制终点 */
        this[4]=data[4];

        /** @type {Vector} 缓存的 相对于圆心的 AABB 包围盒 min 点 */
        this.__cache_AABB__relative_center=null;
        /** @type {Vector} 缓存的 相对于圆心的 弧形端点 a */
        this.__cache_a_point__relative_center=null;
        /** @type {Vector} 缓存的 相对于圆心的 弧形端点 b */
        this.__cache_b_point__relative_center=null;
        /** @type {Vector} 缓存的 AABB 包围盒 min 点 */
        this.__cache_AABB=null;
        /** @type {Vector} 缓存的 弧形端点 a */
        this.__cache_a_point=null;
        /** @type {Vector} 缓存的 弧形端点 b */
        this.__cache_b_point=null;
        /** @type {float} 端点夹角弧度 (应大于0) */
        this.__cache_angle=-1.0;
        /** @type {float} 弧长 */
        this.__cache_path_length=-1.0;
        
        this.refresh_Cache();
    }

    // open *访问器函数* open
        /** @type {float}                      cx                         圆心 x 坐标 */
            get cx(){   return this[0];}
            set cx(val){
                this[0]=val;
                this.refresh_Cache();
                return this[0];
            }

        /** @type {float}                      cy                         圆心 x 坐标 */
            get cy(){   return this[1];}
            set cy(val){
                this[1]=val;
                this.refresh_Cache();
                return this[1];
            }
            
        /** @type {float}                      r                          圆半径 */
            get r(){   return this[2];}
            set r(val){
                this[2]=val;
                this.refresh_Cache();
                return this[2];
            }

        /** @type {float}                      theta_a                    弧线端点 a 弧度 渲染时作为绘制起点 */
            get theta_a(){   return this[3];}
            set theta_a(val){
                this[3]=val;
                this.refresh_Cache();
                return this[3];
            }

        /** @type {float}                      theta_b                    弧线端点 b 弧度 渲染时作为绘制终点 */
            get theta_b(){   return this[4];}
            set theta_b(val){
                this[4]=val;
                this.refresh_Cache();
                return this[4];
            }
        /** @type {[min:Vector,max:Vector]}    aabb__relative_center      相对于圆心的 aabb 包围盒 */
            get aabb__relative_center(){
                if(!this.__cache_AABB__relative_center){
                    this.__cache_AABB__relative_center=Arc.calc_AABB__RelativeCenter(this);
                }
                return this.__cache_AABB__relative_center;
            }
        /** @type {[min:Vector,max:Vector]}    aabb                       aabb 包围盒 */
            get aabb(){
                if(!this.__cache_AABB){
                    var aabb=this.aabb__relative_center;
                    this.__cache_AABB=[
                        new Vector([aabb[0][0]+this[0],aabb[0][1]+this[1]]),
                        new Vector([aabb[1][0]+this[0],aabb[1][1]+this[1]])
                    ];
                }
                return this.__cache_AABB__relative_center
            }
        
        /** @type {Vector}                     point_a__relative_center   相对于圆心的弧形端点 a */
            get point_a__relative_center(){
                if(!this.__cache_a_point__relative_center){
                    this.__cache_a_point__relative_center=Arc.sample__InCircle(this[2],this[3]);
                }
                return __cache_a_point__relative_center;
            }

        /** @type {Vector}                     point_b__relative_center   相对于圆心的弧形端点 b */
            get point_b__relative_center(){
                if(!this.__cache_b_point__relative_center){
                    this.__cache_b_point__relative_center=Arc.sample__InCircle(this[2],this[4]);
                }
                return __cache_b_point__relative_center;
            }

        /** @type {Vector}                     point_a                    弧形端点 a */
            get point_a(){
                if(!this.__cache_a_point){
                    var point_a=this.point_a__relative_center;
                    this.__cache_a_point=new Vector([point_a[0]+this[0],point_a[1]+this[1]])
                }
                return this.__cache_a_point;
            }

        /** @type {Vector}                     point_b                    弧形端点 b */
            get point_b(){
                if(!this.__cache_b_point){
                    var point_b=this.point_b__relative_center;
                    this.__cache_b_point=new Vector([point_b[0]+this[0],point_b[1]+this[1]])
                }
                return this.__cache_b_point;
            }
        /** @type {float}                      angle                      端点夹角弧度 */
            get angle(){
                if(!~this.__cache_angle){
                    this.__cache_angleArc.calc_Angle(this);
                }
                return this.__cache_angle;
            }
        /** @type {float}                      path_length                弧长 */
            get path_length(){
                if(!~this.__cache_path_length){
                    this.__cache_path_length=Arc.calc_ArcLength(this);
                }
                return this.__cache_path_length;
            }
    // end  *访问器函数* end 

    /** 刷新缓存数据 */
    refresh_Cache(){
        /*
            var aabb=Arc.calc_AABB__RelativeCenter(this);
            var point_a=Arc.sample__InCircle(this[2],this[3]),
                point_b=Arc.sample__InCircle(this[2],this[4]);
            var aabb__world__max=[new Vector([aabb[0][0]+this[0],aabb[0][1]+this[1]]),new Vector([aabb[1][0]+this[0],aabb[1][1]+this[1]])],
                point_a__world=new Vector([point_a[0]+this[0],point_a[1]+this[1]]),
                point_b__world=new Vector([point_b[0]+this[0],point_b[1]+this[1]]);
        */
        this.__cache_AABB__relative_center=null;
        this.__cache_a_point__relative_center=null;
        this.__cache_b_point__relative_center=null;
        this.__cache_AABB=null;
        this.__cache_a_point=null;
        this.__cache_b_point=null;
        this.__cache_angle=Arc.calc_Angle(this);
    }


    /** 取圆上点 
     * @param {float} r     半径
     * @param {float} theta 弧度
     * @param {Vector} [_out] 输出对象
     * @returns {Vector} 返回一个 2D 向量
     */
    static sample__InCircle(r,theta,_out){
        var out=_out||new Vector(2);
        out[0]=Math.cos(theta)*r;
        out[1]=Math.sin(theta)*r;
        return out;
    }

    /** 采样 
     * @param {Arc}     arc   弧形数据
     * @param {float}   t     时间参数 t (0~1)
     * @param {Vector} [_out] 输出对象
     * @returns {Vector} 返回一个 2D 向量
     */
    static sample(arc,t,_out){
        var theta=arc[4]-arc[3]*t;
        var out=_out||new Vector(2);
        out[0]=cos(theta)*r+arc[0];
        out[1]=sin(theta)*r+arc[1];
        return out;
    }

    /** 弧形两端点夹角弧度 
     * @param {Arc} arc 弧形数据
     * @returns {float} 返回弧形端点夹角弧度
     */
    static calc_Angle(arc){
        return abs(arc[4]-arc[3]);
    }

    /** 计算 相对于圆心的 弧形的 AABB 包围盒 
     * @param {Arc} arc 弧形数据
     * @returns {[min:Vector,max:Vector]} 返回相对于圆心的 aabb 包围盒的 min 和 max 
     */
    static calc_AABB__RelativeCenter(arc){
        var angle=Arc.calc_angle(arc);

        if(angle>=2*Math.PI){
            return {
                min:new Vector([arc[0]-arc[2],arc[1]-arc[2]]),
                max:new Vector([arc[0]+arc[2],arc[1]+arc[2]])
            };
        }
        var r= arc[2];
        var f=angle>Math.PI,
            f1=a[0]>=0,
            f2=a[1]>=0,
            f3=b[0]>=0,
            f4=b[1]>=0,
            f5=f1===f3,
            f6=f2===f4;

        var a=Arc.get_PointA(arc),
            b=Arc.get_PointB(arc),
            min=new Vector(2),
            max=new Vector(2);

        if(f5&&f6){// 在同一象限
            if(f){// 大于半圆
                min[0]=-r;
                min[1]=-r;
                max[0]=r;
                max[1]=r;
            }else{
                min[0]=(a[0]>b[0])?(b[0]):(a[0]);
                min[1]=(a[1]>b[1])?(b[1]):(a[1]);
                max[0]=(a[0]<b[0])?(b[0]):(a[0]);
                max[1]=(a[1]<b[1])?(b[1]):(a[1]);
            }
        }else if(f2){// a1 || a2
            if(f1){
                if((!f3)&&(f4)){// a1 b2
                    min[0]=b[0];
                    min[1]=(a[1]>b[1])?(b[1]):(a[1]);
                    max[0]=a[0];
                    max[1]=r;
                }else if((!f3)&&(!f4)){// a1 b3
                    min[0]=-r;
                    min[1]=b[1];
                    max[0]=a[0];
                    max[1]=r;
                }else if((f3)&&(!f4)){// a1 b4
                    min[0]=-r;
                    min[1]=-r;
                    max[0]=(a[0]<b[0])?(b[0]):(a[0]);
                    max[1]=r;
                }
            }else{//a2
                if(f3&&f4){// a2 b1
                    min[0]=-r;
                    min[1]=-r;
                    max[0]=r;
                    max[1]=(a[1]<b[1])?(b[1]):(a[1]);
                }else if((!f3)&&(!f4)){// a2 b3
                    min[0]=-r;
                    min[1]=b[1];
                    max[0]=(a[0]<b[0])?(b[0]):(a[0]);
                    max[1]=a[1];
                }else if((f3)&&(!f4)){// a2 b4
                    min[0]=-r;
                    min[1]=-r;
                    max[0]=b[0];
                    max[1]=a[1];
                }
            }
        }else{  // a3 || a4
            if(!f1){
                if(f3&&f4){// a3 b1
                    min[0]=-r;
                    min[1]=-r;
                    max[0]=b[0];
                    max[1]=a[1];
                }if((!f3)&&(f4)){// a3 b2
                    min[0]=(a[0]>b[0])?(b[0]):(a[0]);
                    min[1]=-r;
                    max[0]=r;
                    max[1]=r;
                }else if((f3)&&(!f4)){// a3 b4
                    min[0]=a[0];
                    min[1]=-r;
                    max[0]=b[0];
                    max[1]=(a[1]<b[1])?(b[1]):(a[1]);
                }
            }else{//a4
                if(f3&&f4){// a4 b1
                    min[0]=(a[0]>b[0])?(b[0]):(a[0]);
                    min[1]=a[1];
                    max[0]=r;
                    max[1]=b[1];
                }if((!f3)&&(f4)){// a4 b2
                    min[0]=b[0];
                    min[1]=-r;
                    max[0]=r;
                    max[1]=r;
                }else if((!f3)&&(!f4)){// a4 b3
                    min[0]=-r;
                    min[1]=a[1];
                    max[0]=r;
                    max[1]=r;
                }
            }
        } 
        

        // min[1]*=-1;
        // max[1]*=-1;

        // min[0]+=arc[0];
        // max[0]+=arc[0];
        // min[1]+=arc[1];
        // max[1]+=arc[1];

        return [
            min,
            max
        ];
    }

    /** 计算弧长 
     * @param {Arc} arc 弧形数据
     * @returns {float} 返回弧形的弧长
     */
    static calc_ArcLength(arc){
        return abs(arc[4]-arc[3])*arc[2]*2;
    }
}


export {
    Arc
}