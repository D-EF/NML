/*
* @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-11-01 01:36:22
 * @FilePath: \site\js\import\NML\NML\Transform_Matrix_Ctrl.js
 * @Description: 变换控制器
 * todo
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

/*h*/// open * 类型注释 * open
/*h*//** @typedef {Float32Array} CONFIG.VALUE_TYPE 矩阵计算时缓存下标的类型; 决定了计算时矩阵的n的大小 可选值为 Uint_N_Array, Int_N_Array */
/*h*//** @typedef {Number} int      整形数字 */
/*h*//** @typedef {Number} double   双浮点数字 */
/*h*//** @typedef {Number} float    单浮点数字 */
/*h*//** @typedef {Number[]|Float32Array|Float64Array|Matrix} List_Value 数据的各种存储形式 */
/*h*/// end  * 类型注释 * end

import {copy_Array,approximately,CONFIG} from "./Config.js";
import { Matrix_2, Matrix_3 } from "./Graphics_Transform_Matrix.js";
import { EulerAngles, Quat, Rotate_3D } from "./Rotate_3D.js";
import { Matrix } from "./Vector_Matrix.js";

/*h*/const {sin,cos,asin,acos,abs,sqrt,tan}=Math;


// open * 变换矩阵控制器 * open
    // open * 3d 变换矩阵控制器 * open
        /** 3d 变换矩阵控制器 */
        class Transform_3D_Matrix_Ctrl{
            /** 
             * @param {Hand__Transform_3D_Matrix_Ctrl[]} process 
             */
            constructor(process){
                /** @type {Hand__Transform_3D_Matrix_Ctrl[]} 变换过程 */
                this.process=Object.assign({},process);
                /** @type {Matrix} 4x4 矩阵,缓存的变换矩阵 */
                this._mat=new Matrix(16);
            }

            /** 获取变换矩阵
             * @return {Matrix} 返回一个新的矩阵
             */
            get_Matrix(){
                return new Matrix(this._mat);
            }
            
            /** 获取当前控制器的 变换矩阵的引用
             * @return {Matrix} 返回 this._mat
             */
            get_Matrix__Life(){
                return this._mat;
            }
        }
        
        /** 3d 变换矩阵控制器 单个变换操作 */
        class Hand__Transform_3D_Matrix_Ctrl{
            /** 
             * @param {Number|String} type 
             * @param {*} params 
             */
            constructor(type,params){
                /** @type {Number} */
                this._type=type;
                if(type.constructor!==Number){
                    this._type=Hand__Transform_3D_Matrix_Ctrl.MAPPING__HAND_NO_TO_TYPE_NAME.indexOf(type);
                }
                this.params=params;
            }

            /**
             * @param {Hand__Transform_3D_Matrix_Ctrl} tgt 拷贝对象
             * @return {Hand__Transform_3D_Matrix_Ctrl}
             */
            copy(tgt){
                // todo
            }

            /** @type {String[]} 操作类型映射表 */
            static MAPPING__HAND_NO_TO_TYPE_NAME=[
                // todo
                "translate",
                "size",
                "rotate",
                "pojection",
                "shear",
                "horizontal"
            ]
        }
    // end  * 3d 变换矩阵控制器 * end 
// end  * 变换矩阵控制器 * end 

export{
    Transform_3D_Matrix_Ctrl,
    Hand__Transform_3D_Matrix_Ctrl
}