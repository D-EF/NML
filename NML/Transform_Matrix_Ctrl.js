/*
* @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-12-18 23:39:30
 * @FilePath: \site\js\import\NML\NML\Transform_Matrix_Ctrl.js
 * @Description: 变换控制器
 * todo
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

/*h*/// open * 类型注释 * open
    /*h*//** @typedef {Float32Array} CONFIG.VALUE_TYPE 矩阵计算时缓存下标的类型; 决定了计算时矩阵的n的大小 可选值为 Uint_N_Array, Int_N_Array */
    /*h*//** @typedef {number} int      整形数字 */
    /*h*//** @typedef {number} double   双浮点数字 */
    /*h*//** @typedef {number} float    单浮点数字 */
    /*h*//** @typedef {number[]|Float32Array|Float64Array} List_Value 数据的各种存储形式 */
/*h*/// end  * 类型注释 * end

import {CONFIG, SAFE_MATH_TOOLS} from "../Config__NML.js";
import { Matrix } from "./Matrix.js";

/*h*/const {sin,cos,asin,acos,abs,sqrt,tan}=SAFE_MATH_TOOLS;
// todo
/** 矩阵变换控制器 */
class Transform_Matrix_Ctrl{
    /** 
     * @param {Hand__Transform_Matrix_Ctrl[]} process 
     */
    constructor(process){
        /** @type {Hand__Transform_Matrix_Ctrl[]} 变换过程 */
        this.process=Object.assign({},process);
        /** @type {Matrix} 4x4 / 3x3 矩阵,  缓存的变换矩阵 */
        this._mat;
    }

    /** 获取变换矩阵
     * @return {Matrix} 返回一个新的矩阵
     */
    create_Matrix(){
        return new Matrix(this._mat);
    }
    
    /** 获取当前控制器的 变换矩阵的引用
     * @return {Matrix} 返回 this._mat
     */
    get_Matrix__Life(){
        return this._mat;
    }
}
/** 矩阵变换控制器的单个动作 */
class Hand__Transform_Matrix_Ctrl__Base{
    constructor(){
        /** @abstract @type {Matrix} 实际的变换矩阵 */
        this.mat;
        /** @abstract @type {*[]} 参数 */
        this.params;
    }
    /** 刷新变换矩阵 
     * @abstract
     */
    refresh_Mat(){}
}

/** 2D变换矩阵(3x3)转换为 canvas2D的api使用的数据
 * @param {Matrix_2} mat 
 * @return {float[]} 返回长度6的浮点数数组 为 CanvasRenderingContext2D.prototype.transform 的参数数组
 */
function conversion__Matrix2D_To_Canvas2D(mat){
    // todo
}

export{
    Transform_Matrix_Ctrl,
    Hand__Transform_Matrix_Ctrl__Base
}