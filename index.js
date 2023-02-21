/*!
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-10-07 16:55:37
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2023-01-19 23:36:16
 * @FilePath: \site\js\import\NML\index.js
 * @Description: index
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

/** @typedef {number} int      整形数字 */
/** @typedef {number} double   双浮点数字 */
/** @typedef {number} float    单浮点数字 */
/** @typedef {number[]|Float32Array|Float64Array} List_Value 数据的各种存储形式 */
/** @typedef {List_Value} Vec  数据的各种存储形式 */
/** @typedef {List_Value} Matrix  数据的各种存储形式 */


import * as Algbra from "./NML/Algebra.js";
import {CONFIG} from "./Config__NML.js";
import {Vector} from "./NML/Vector.js";
import {Matrix} from "./NML/Matrix.js";
import {Matrix_2D} from "./NML/Matrix_2D.js";
import {Matrix_3D} from "./NML/Matrix_3D.js";
import {Euler_Angles} from "./NML/Euler_Angles.js";
import {Quaternion} from "./NML/Quaternion.js";
import {Transform_Matrix_Ctrl} from "./NML/Transform_Matrix_Ctrl.js";

const NML ={
    Algbra,
    CONFIG,
    Vector,
    Matrix,
    Matrix_2D,
    Matrix_3D,
    Euler_Angles,
    Quaternion,
    Transform_Matrix_Ctrl
}
export default NML;
export {
    Algbra,
    CONFIG as CONFIG__NML,
    Vector,
    Matrix,
    Matrix_2D,
    Matrix_3D,
    Euler_Angles,
    Quaternion,
    Transform_Matrix_Ctrl
}