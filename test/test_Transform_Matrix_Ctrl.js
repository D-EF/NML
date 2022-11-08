/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-11-01 00:48:35
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-11-04 22:47:21
 * @FilePath: \site\js\import\NML\test\test_Transform_Matrix_Ctrl.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */
import {NML} from "../index.js";

const {Vector,Matrix,Matrix_2,Matrix_3,Transform_Matrix_Ctrl}=NML;

function test(){
    var vec_3d=new Vector([1,2,3]);
    var vec_2d=new Vector([1,2]);
    var vec_3d__unit=Vector.create_Normalization(vec_2d);
    var vec_2d__unit=Vector.create_Normalization(vec_3d);

    var list_test_vec=[vec_3d,vec_2d,vec_3d__unit,vec_2d__unit];

    Vector.v2__get_Quadrant(vec_2d);
    Vector.v2__get_Quadrant(vec_2d__unit);
    var i=list_test_vec.length;


    do{
        --i;

        // todo Transform_Matrix_Ctrl

    }while(i);
}

console.log('test in  2022/11/04. down');

export{
    test
}