/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-10-07 16:55:37
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-12-18 23:35:28
 * @FilePath: \site\js\import\NML\index.js
 * @Description: index
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */
import * as Algbra from "./NML/Algebra.js";
import {CONFIG} from "./NML/Config.js";
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
    CONFIG,
    Vector,
    Matrix,
    Matrix_2D,
    Matrix_3D,
    Euler_Angles,
    Quaternion,
    Transform_Matrix_Ctrl
}