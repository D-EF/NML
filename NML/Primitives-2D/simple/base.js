/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2023-01-20 20:57:05
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2023-01-23 00:53:29
 * @FilePath: \site\js\import\NML\NML\Primitives-2D\simple\base.js
 * @Description: 图元数据基类
 * 
 * Copyright (c) 2023 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */
import { CONFIG } from "../Config";
import { Polygon } from "../Polygon";
import { Vector } from "../Vector";

/** 图元数据基类 (抽象类)
 * @abstract
 */
class Primitive_Data_Base extends CONFIG.VALUE_TYPE{
    constructor(data){
        super(data);
        if(this.length!==this.constructor.DATA_LENGTH){
            throw new Error("Error for data length! It must be "+this.constructor.DATA_LENGTH);
        }
        this.refresh_Cache();
        return;

        // 在refresh_Cache 中继续初始化

        /** @type {Vector} 缓存的 AABB 包围盒 */
        this.__cache_aabb=null;
        /** @type {float} 缓存的路径长度 */
        this.__cache_path_length=-1.0;
    }

    // open * 抽象接口 * open
        /** 刷新缓存数据
         * @abstract
         */
        refresh_Cache(){
            this.__cache_aabb=null;
            this.__cache_path_length=-1.0;
        }
        /** 数据长度
         * @type {int} 图元的数据长度 必须在派生类中重新定义
         * @abstract
         */
        static DATA_LENGTH=-1;
        /** 计算路径长度
         * @return {float}  路径长度
         * @abstract
         */
        static calc_PathLength(data){
            throw new Error('must be implemented by subclass!');
        }
        /** 计算 aabb 包围盒
         * @return  {[min:Vector,max:Vector]} 返回 aabb 包围盒
         * @abstract
         */
        static calc_AABB(){
            throw new Error('must be implemented by subclass!');
        }
        /** 采样点
         * @param {Primitive_Data_Base} data
         * @param {number} t 时间参数 t (0~1)
         * @param {Vector} [_out] 输出对象 
         * @return {Vector}
         * @abstract
         */
        static sample(data,t,_out){
            throw new Error('must be implemented by subclass!');
        }
        /** 创建 2d 多边形对象
         * @return {Polygon} 返回一个多边形
         * @abstract
         */
        static create_Polygon(data){
            throw new Error('must be implemented by subclass!');
        }
    // end  * 抽象接口 * end 

    /** 获取 2d 图形路径长度
     * @return {number} 返回 2d 图形路径长度
     */
    get_PathLength(){
        if(!~this.__cache_path_length){
            this.__cache_path_length=this.constructor.calc_PathLength(this);
        }
        return this.__cache_path_length;
    }
    
    /** 获取 aabb 包围盒
     * @return {[min:Vector,max:Vector]} 返回 aabb 包围盒
     */
    get_AABB(){
        if(!~this.__cache_aabb){
            this.__cache_aabb=this.constructor.calc_AABB(this);
        }
        return this.__cache_path_length;
    }

    /** 采样点
     * @param {number} t 时间参数 t (0~1)
     * @param {Vector} [_out] 输出对象
     * @return {Vector} 返回 2D 向量
     */
    sample(t,_out){
        return this.constructor.sample(this,t,_out);
    }

}

export {
    Primitive_Data_Base
}