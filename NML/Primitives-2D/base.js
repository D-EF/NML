/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2023-01-20 20:57:05
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2023-01-20 21:36:39
 * @FilePath: \site\js\import\NML\NML\Primitives-2D\base.js
 * @Description: 图元数据基类
 * 
 * Copyright (c) 2023 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */
import { CONFIG } from "../Config";
import { Vector } from "../Vector";


/** 图元数据基类 (抽象类)
 * @abstract
 */
class Primitive_Data_Base extends CONFIG.VALUE_TYPE{

    /** 刷新缓存数据
     * @abstract
     */
    refresh_Cache(){}

    /**
     * @type {[min:Vector,max:Vector]} 图形路径长度
     * @abstract
     * @override
     */
    get path_length(){
        throw new Error('must be implemented by subclass!');
    }
    
    /** 获取 2d 图形路径长度
     * @return {number} 返回 2d 图形路径长度
     */
    get_PathLength(){
        return this.path_length;
    }
    
    /**
     * @type {[min:Vector,max:Vector]} aabb 包围盒
     * @abstract
     */
    get aabb(){
        throw new Error('must be implemented by subclass!');
    }

    /** 获取 aabb 包围盒
     * @return {[min:Vector,max:Vector]} 返回 aabb 包围盒
     */
    get_AABB(){
        return this.aabb;
    }

    /** 采样点
     * @param {number} t 时间参数 t (0~1)
     * @param {Vector} [_out] 输出对象
     * @returns {Vector} 返回 2D 向量
     */
    sample(t,_out){
        return this.constructor.sample(this,t,_out);
    }

    /** 采样点
     * @abstract
     * @param {Primitive_Data_Base} data
     * @param {number} t 时间参数 t (0~1)
     * @param {Vector} [_out] 输出对象 
     * @returns {Vector}
     */
    static sample(data,t,_out){
        throw new Error('must be implemented by subclass!');
    }
}

export {
    Primitive_Data_Base
}