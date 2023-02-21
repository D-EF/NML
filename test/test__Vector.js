/*!
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-11-01 00:48:35
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2023-02-21 02:22:10
 * @FilePath: \site\js\import\NML\test\test__Vector.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */
import NML from "../index.js";
import { approximately, approximately__Array, CONFIG } from "../Config__NML.js";
import { callback_CalcErr__ErrLog } from "./base__test.js";

var throw__F=callback_CalcErr__ErrLog;

const {Vector}=NML;

var test_vec_1=new Vector([123.0, 456.0, 789.0]);
var test_vec_2=new Vector([3.0, 2.0, 1.0]);


var test_unit_vec_1=Vector.create_Normalization(test_vec_1);    // [0.13375998748853218, 0.49589068532333885,  0.8580213831581455]  
var test_unit_vec_2=Vector.create_Normalization(test_vec_2);    // [0.8017837257372732,  0.5345224838248488,   0.2672612419124244]  

const test_unit_vec_1__input=[0.13375998748853218, 0.49589068532333885,  0.8580213831581455];
const test_unit_vec_2__input=[0.8017837257372732,  0.5345224838248488,   0.2672612419124244];


function test(){
    var temp;

    console.log("\nVector.mag\n");
        console.log(`Vector.mag(${test_vec_1});\n(919.5575022803088)\n`,    temp=Vector.mag(test_vec_1),        `\n`, throw__F(approximately(temp, 919.5575022803088)));
        console.log(`Vector.mag(${test_vec_2});\n(3.7416573867739413)\n`,   temp=Vector.mag(test_vec_2),        `\n`, throw__F(approximately(temp, 3.7416573867739413)));
        console.log(`Vector.mag(${test_unit_vec_1});\n(1)\n`,               temp=Vector.mag(test_unit_vec_1),   `\n`, throw__F(approximately(temp, 1.0)));
        console.log(`Vector.mag(${test_unit_vec_2});\n(1)\n`,               temp=Vector.mag(test_unit_vec_2),   `\n`, throw__F(approximately(temp, 1.0)));
    
    console.log("\nVector.is_Unit\n");
        console.log(`Vector.is_Unit(${test_vec_1});\n(false)\n`,            temp=Vector.is_Unit(test_vec_1),          '\n', throw__F(temp===false));
        console.log(`Vector.is_Unit(${test_vec_2});\n(false)\n`,            temp=Vector.is_Unit(test_vec_2),          '\n', throw__F(temp===false));
        console.log(`Vector.is_Unit(${test_unit_vec_1});\n(true)\n`,        temp=Vector.is_Unit(test_unit_vec_1),     '\n', throw__F(temp===true));
        console.log(`Vector.is_Unit(${test_unit_vec_2});\n(true)\n`,        temp=Vector.is_Unit(test_unit_vec_2),     '\n', throw__F(temp===true));

    console.log("\nVector.create_Normalization\n");
        console.log(`Vector.create_Normalization(${test_vec_1})\n${test_unit_vec_1}\n`,   temp=Vector.create_Normalization(test_vec_1),        `\n`,  throw__F(approximately__Array(temp, test_unit_vec_1__input)));
        console.log(`Vector.create_Normalization(${test_vec_2})\n${test_unit_vec_2}\n`,   temp=Vector.create_Normalization(test_vec_2),        `\n`,  throw__F(approximately__Array(temp, test_unit_vec_2__input)));
        console.log(`Vector.create_Normalization(${test_unit_vec_1})`,                    temp=Vector.create_Normalization(test_unit_vec_1),   `\n`,  throw__F(approximately__Array(temp, test_unit_vec_1__input)));
        console.log(`Vector.create_Normalization(${test_unit_vec_2})`,                    temp=Vector.create_Normalization(test_unit_vec_2),   `\n`,  throw__F(approximately__Array(temp, test_unit_vec_2__input)));

    console.log("\nVector.instead\n");
        console.log(`Vector.instead(${test_vec_1})\n([-123.0,-456.0,-789.0])\n`,                                                          temp=Vector.instead(test_vec_1), `\n`,  throw__F(approximately__Array(temp,[-123.0,-456.0,-789.0])));
        console.log(`Vector.instead(${test_vec_2})\n([-3.0,-2.0,-1.0])\n`,                                                                temp=Vector.instead(test_vec_2), `\n`,  throw__F(approximately__Array(temp,[-3.0,-2.0,-1.0])));
        console.log(`Vector.instead(${test_unit_vec_1})\n([-0.13375998748853218, -0.49589068532333885,  -0.8580213831581455])\n`,         temp=Vector.instead(test_unit_vec_1), `\n`,  throw__F(approximately__Array(temp,[-0.13375998748853218, -0.49589068532333885,  -0.8580213831581455])));
        console.log(`Vector.instead(${test_unit_vec_2})\n([-0.8017837257372732,  -0.5345224838248488,   -0.2672612419124244])\n`,         temp=Vector.instead(test_unit_vec_2), `\n`,  throw__F(approximately__Array(temp,[-0.8017837257372732,  -0.5345224838248488,   -0.2672612419124244])));

    console.log("\nVector.sum\n");
        console.log(`Vector.sum(${test_vec_1}\t+\t${test_vec_1})\n([246.0, 912, 1578])\n`,                                                          temp=Vector.sum(test_vec_1, test_vec_1),        `\n`,   throw__F(approximately__Array(temp,[246.0, 912, 1578])));
        console.log(`Vector.sum(${test_vec_1}\t+\t${test_vec_2})\n([126.0, 458.0, 790.0])\n`,                                                       temp=Vector.sum(test_vec_1, test_vec_2),        `\n`,   throw__F(approximately__Array(temp,[126.0, 458.0, 790.0])));
        console.log(`Vector.sum(${test_vec_1}\t+\t${test_unit_vec_1})\n([123.13375998748853218, 456.49589068532333885, 789.8580213831581455])\n`,   temp=Vector.sum(test_vec_1, test_unit_vec_1),   `\n`,   throw__F(approximately__Array(temp,[123.13375998748853218, 456.49589068532333885, 789.8580213831581455])));
        console.log(`Vector.sum(${test_vec_1}\t+\t${test_unit_vec_2})\n([123.8017837257372732, 456.5345224838248488, 789.2672612419124244])\n`,     temp=Vector.sum(test_vec_1, test_unit_vec_2),   `\n`,   throw__F(approximately__Array(temp,[123.8017837257372732, 456.5345224838248488, 789.2672612419124244])));
        console.log(`Vector.sum(${test_vec_2}\t+\t${test_vec_1})\n([126.0, 458.0, 790.0])\n`,                                                       temp=Vector.sum(test_vec_2, test_vec_1),        `\n`,   throw__F(approximately__Array(temp,[126.0, 458.0, 790.0])));
        console.log(`Vector.sum(${test_vec_2}\t+\t${test_vec_2})\n([6.0, 4.0, 2.0])\n`,                                                             temp=Vector.sum(test_vec_2, test_vec_2),        `\n`,   throw__F(approximately__Array(temp,[6.0, 4.0, 2.0])));
        console.log(`Vector.sum(${test_vec_2}\t+\t${test_unit_vec_1})\n([3.13375998748853218, 2.49589068532333885, 1.8580213831581455])\n`,         temp=Vector.sum(test_vec_2, test_unit_vec_1),   `\n`,   throw__F(approximately__Array(temp,[3.13375998748853218, 2.49589068532333885, 1.8580213831581455])));
        console.log(`Vector.sum(${test_vec_2}\t+\t${test_unit_vec_2})\n([3.8017837257372732, 2.5345224838248488, 1.2672612419124244])\n`,           temp=Vector.sum(test_vec_2, test_unit_vec_2),   `\n`,   throw__F(approximately__Array(temp,[3.8017837257372732, 2.5345224838248488, 1.2672612419124244])));

    console.log("\nVector.dif\n");
        console.log(`Vector.dif(${test_vec_1}\t-\t${test_vec_1})\n([0.0, 0.0, 0.0])\n`,                                                       temp=Vector.dif(test_vec_1, test_vec_1),        `\n`,   throw__F(approximately__Array(temp,[0.0, 0.0, 0.0])));
        console.log(`Vector.dif(${test_vec_1}\t-\t${test_vec_2})\n([120.0, 454.0, 788.0])\n`,                                                 temp=Vector.dif(test_vec_1, test_vec_2),        `\n`,   throw__F(approximately__Array(temp,[120.0, 454.0, 788.0])));
        console.log(`Vector.dif(${test_vec_1}\t-\t${test_unit_vec_1})\n([122.86624001251147,  455.50410931467667,  788.1419786168418])\n`,    temp=Vector.dif(test_vec_1, test_unit_vec_1),   `\n`,   throw__F(approximately__Array(temp,[122.86624001251147,  455.50410931467667,  788.1419786168418])));
        console.log(`Vector.dif(${test_vec_1}\t-\t${test_unit_vec_2})\n([122.19821627426273,  455.46547751617516,  788.7327387580875])\n`,    temp=Vector.dif(test_vec_1, test_unit_vec_2),   `\n`,   throw__F(approximately__Array(temp,[122.19821627426273,  455.46547751617516,  788.7327387580875])));
        console.log(`Vector.dif(${test_vec_2}\t-\t${test_vec_1})\n([-120.0,-454.0,-788.0])\n`,                                                temp=Vector.dif(test_vec_2, test_vec_1),        `\n`,   throw__F(approximately__Array(temp,[-120.0,-454.0,-788.0])));
        console.log(`Vector.dif(${test_vec_2}\t-\t${test_vec_2})\n([0.0, 0.0, 0.0])\n`,                                                       temp=Vector.dif(test_vec_2, test_vec_2),        `\n`,   throw__F(approximately__Array(temp,[0.0, 0.0, 0.0])));
        console.log(`Vector.dif(${test_vec_2}\t-\t${test_unit_vec_1})\n([2.8662400125114678,  1.504109314676661,  0.14197861684185453])\n`,   temp=Vector.dif(test_vec_2, test_unit_vec_1),   `\n`,   throw__F(approximately__Array(temp,[2.8662400125114678,  1.504109314676661,  0.14197861684185453])));
        console.log(`Vector.dif(${test_vec_2}\t-\t${test_unit_vec_2})\n([2.1982162742627267,  1.4654775161751512,  0.7327387580875756])\n`,   temp=Vector.dif(test_vec_2, test_unit_vec_2),   `\n`,   throw__F(approximately__Array(temp,[2.1982162742627267,  1.4654775161751512,  0.7327387580875756])));

    console.log("\nVector.dot\n");
        console.log(`Vector.dot(${test_vec_1}\t*\t${test_vec_2})\n(2070.0)\n`,                        temp=Vector.dot(test_vec_1, test_vec_2),             throw__F(approximately(temp,2070.0)));
        console.log(`Vector.dot(${test_vec_1}\t*\t${test_unit_vec_1})\n(919.5575022803088)\n`,        temp=Vector.dot(test_vec_1, test_unit_vec_1),        throw__F(approximately(temp,919.5575022803088)));
        console.log(`Vector.dot(${test_vec_2}\t*\t${test_unit_vec_2})\n(3.7416573867739413)\n`,       temp=Vector.dot(test_vec_2, test_unit_vec_2),        throw__F(approximately(temp,3.7416573867739413)));
        console.log(`Vector.dot(${test_unit_vec_1}\t*\t${test_unit_vec_2})\n(0.601627162398026)\n`,   temp=Vector.dot(test_unit_vec_1, test_unit_vec_2),   throw__F(approximately(temp,0.601627162398026)));

        
    console.log("\nVector.cross\n");
        console.log(`Vector.cross([1,3,4],[2,-5,8])\n[44,0,-11]`,                            temp=Vector.cross([1,3,4],[2,-5,8]),  '\n',        throw__F(approximately__Array([44,0,-11],temp)));
        console.log(`Vector.cross(${test_vec_1}\tx\t${test_vec_2})\n[-1122, 2244, -1122]`,   temp=Vector.cross(test_vec_1,test_vec_2),  '\n',   throw__F(approximately__Array([-1122, 2244, -1122],temp)));

    console.log("\nVector.np\n");
        console.log(`Vector.np(${test_unit_vec_1}\t*919.5575022803088\t)\n[123.0, 456.0, 789.0]\n`,   temp=Vector.np(test_unit_vec_1,919.5575022803088),  throw__F(approximately__Array(temp,[123.0, 456.0, 789.0])));
        console.log(`Vector.np(${test_unit_vec_2}\t*3.7416573867739413\t)\n[3.0, 2.0, 1.0]\n`,        temp=Vector.np(test_unit_vec_2,3.7416573867739413), throw__F(approximately__Array(temp,[3.0, 2.0, 1.0])));

    console.log("\nVector.cos_2Vec\n");
        console.log(`Vector.cos_2Vec(${test_vec_1}\t,\t${test_vec_2})\n0.6016271623980259`,  temp=Vector.cos_2Vec(test_vec_1,test_vec_2),   throw__F(approximately(temp,0.6016271623980259)) );

    window.Vector=Vector;
    // debugger
}

console.log(`test in  2022/11/04. down`);

export{
    test
}