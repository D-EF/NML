/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-10-07 16:55:37
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-11-10 03:03:15
 * @FilePath: \site\js\import\NML\index.js
 * @Description: index
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */
import * as m1 from "./NML/Algebra.js";
import * as m2 from "./NML/Config.js";
import * as m3 from "./NML/Vector_Matrix.js";
import * as m4 from "./NML/Matrix_3D.js";
import * as m5 from "./NML/Euler_Angles";
import * as m6 from "./NML/Vector_Matrix.js";
import * as m7 from "./NML/Transform_Matrix_Ctrl.js";

const NML ={
    ...m1,
    ...m2,
    ...m3,
    ...m4,
    ...m5,
    ...m6,
    ...m7,
}
export default NML;
export {
    NML
}