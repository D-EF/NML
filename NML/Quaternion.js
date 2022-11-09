/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-11-10 02:56:44
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-11-10 03:06:16
 * @FilePath: \site\js\import\NML\NML\Quaternion.js
 * @Description: 四元数
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

/*h*/const {sin,cos,asin,acos,abs,sqrt,tan}=Math;

/** 四元数 */
class Quaternion extends CONFIG.VALUE_TYPE{
    
    /** 使用矩阵计算出欧拉角
     * @param {Matrix_3} mat 仅做过旋转变换的矩阵
     * @return {EulerAngles}
     */
    static setup_Matrix(mat){
        // todo
    }

    /** 使用四元数
     * @param {Quaternion} mat 仅做过旋转变换的矩阵
     * @return {EulerAngles}
     */
    static setup_EulerAngles(mat){
        // todo
    }
}

export{
    Quaternion
}