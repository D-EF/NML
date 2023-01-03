/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-11-01 00:48:35
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-12-18 23:54:44
 * @FilePath: \site\js\import\NML\test\test__Vector.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */
import NML from "../index.js";

const {Vector}=NML;

function test(){
    var vec_3d=new Vector([1,2,3]);
    var vec_2d=new Vector([1,2]);
    var vec_3d__unit=Vector.create_Normalization(vec_2d);
    var vec_2d__unit=Vector.create_Normalization(vec_3d);

    var list_test_vec=[vec_3d,vec_2d,vec_3d__unit,vec_2d__unit];

    console.log("v2__get_Quadrant"+vec_2d,Vector.v2__get_Quadrant(vec_2d));
    console.log("v2__get_Quadrant"+vec_2d__unit,Vector.v2__get_Quadrant(vec_2d__unit));
    var i=list_test_vec.length;
    do{
        --i;
        // var i=0;
        // (Vector\.\w*)\((.*)\)
        // console.log("$1("+$2+")",                                                    $1($2) )
        console.log('\n\n\n');
         console.log("Vector.mag("+list_test_vec[i]+")",                                        Vector.mag(list_test_vec[i]) );
         console.log("Vector.is_Unit("+list_test_vec[i]+")",                                    Vector.is_Unit(list_test_vec[i]) );
         console.log("Vector.create_Normalization("+list_test_vec[i]+")",                       Vector.create_Normalization(list_test_vec[i]) );
         console.log("Vector.is_Zero("+list_test_vec[i]+")",                                    Vector.is_Zero(list_test_vec[i]) );
         console.log("Vector.instead("+list_test_vec[i]+")",                                    Vector.instead(list_test_vec[i]) );
         console.log("Vector.is_Equal("+list_test_vec[i],list_test_vec[i]+")",                  Vector.is_Equal(list_test_vec[i],list_test_vec[i]) );
         console.log("Vector.sum("+list_test_vec[i],list_test_vec[i]+")",                       Vector.sum(list_test_vec[i],list_test_vec[i]) );
         console.log("Vector.translate("+list_test_vec[i],list_test_vec[i]+")",                 Vector.translate(list_test_vec[i],list_test_vec[i]) );
         console.log("Vector.dif("+list_test_vec[i],list_test_vec[i]+")",                       Vector.dif(list_test_vec[i],list_test_vec[i]) );
         console.log("Vector.np("+list_test_vec[i],list_test_vec[i][0]+")",                     Vector.np(list_test_vec[i],list_test_vec[i][0]) );
         console.log("Vector.np_b("+list_test_vec[i],list_test_vec[i][0]+")",                   Vector.np_b(list_test_vec[i],list_test_vec[i][0]) );
         console.log("Vector.dot("+list_test_vec[i],list_test_vec[i]+")",                       Vector.dot(list_test_vec[i],list_test_vec[i]) );
         console.log("Vector.cross("+list_test_vec[i],list_test_vec[i]+")",                     Vector.cross(list_test_vec[i],list_test_vec[i]) );
         console.log("Vector.get_Cos__Vec2("+list_test_vec[i],Vector.instead(list_test_vec[i])+")",  Vector.get_Cos__Vec2(list_test_vec[i],Vector.instead(list_test_vec[i])) );
         console.log('\n\n\n');
    }while(i);
}

console.log('test in  2022/11/04. down');

export{
    test
}