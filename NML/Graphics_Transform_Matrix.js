/*
* @Author: Darth_Eternalfaith darth_ef@hotmail.com
* @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
* @LastEditTime: 2022-10-24 00:07:09
* @FilePath: \site\js\import\NML\NML.js
* @Description: Nittle Math Library
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

import {copy_Array,approximately,CONFIG} from "./Config.js";
import { Matrix } from "./Vector_Matrix.js";
/*h*/const {sin,cos,asin,acos,abs,sqrt,tan}=Math;


// open * 2d 变换矩阵 * open

    /** 用于创建2d变换矩阵的静态类 */
    class Matrix_2 extends Matrix{
        /** 创建旋转矩阵
         * @param {Number} theta 顺时针 旋转角弧度
         * @return {Matrix} 返回一个2x2矩阵
         */
        static create_Rotate(theta){
            var s=Math.sin(theta),
                c=Math.cos(theta);
            CONFIG.AXIS?0:s*=-1;
            return new Matrix([c,s,-s,c]);
        }

        /** 创建旋转矩阵 使用向量
         * @param {Vector} _v 2d向量
         * @return {Matrix} 返回一个2x2矩阵
         */
        static create_Rotate__v(_v){
            var v=Vector.is_Unit(_v)?_v:Vector.create_Normalization(_v),
                s=v[1];
            return new Matrix([v[0],s,-s,v[0]]);
        }

        /** 创建缩放矩阵
         * @param {Number} x x 轴方向上的缩放系数
         * @param {Number} y y 轴方向上的缩放系数
         * @return {Matrix} 返回一个2x2矩阵
         */
        static create_Scale(x,y){
            return new Matrix([x,0,0,y]);
        }

        /** 创建镜像矩阵(对称)
         * @param {Number} x 对称轴的法向 x 坐标
         * @param {Number} y 对称轴的法向 y 坐标
         * @return {Matrix} 返回一个2x2矩阵
         */
        static create_Horizontal (x,y){
            var i2xy=-2*x*y;
            return new Matrix(
                1-2*x*x ,   i2xy,
                i2xy    ,   1-2*y*y
            )
        }

        /** 创建切变矩阵
         * @param {Number} kx x方向的切变系数
         * @param {Number} ky y方向的切变系数
         * @return {Matrix} 返回一个2x2矩阵
         */
        static create_Shear(kx,ky){
            return new Matrix([1,ky,kx,1]);
        }

        /** 创建单位矩阵
         * @return {Matrix} 返回一个2x2矩阵
         */
        static create_Identity(){
            return new Matrix([1,0,0,1]);
        }

        /** 创建等比缩放&旋转矩阵 根据向量生成矩阵
         * @param {List_Value} v2 2d向量
         * @return {Matrix}  返回一个2x2矩阵
         */
        static create_ByVector(v2){
            var s=v2[1];
            CONFIG.AXIS?0:s*=-1;
            return new Matrix([v2[0],-s,s,v2[0]]);
        }
    }

    Matrix_2.ROTATE_90=new Matrix([0,1,-1,0]);
    Matrix_2.ROTATE_90_I=new Matrix([0,-1,1,0]);
    Matrix_2.FLIP_HORIZONTAL=new Matrix([-1,0,0,1]);
    
// end  * 2d 变换矩阵 * end 

// open * 3d 变换矩阵 * open
    /** 用于创建3D变换矩阵的静态类 */
    class Matrix_3 extends Matrix{
        /** 创建缩放矩阵
         * @param {flot} x x坐标中的缩放系数
         * @param {flot} y y坐标中的缩放系数
         * @param {flot} z z坐标中的缩放系数
         * @returns {Matrix} 返回一个3x3矩阵
         */
        static create_Scale(x,y,z){
            return new Matrix([
                x,0,0,
                0,y,0,
                0,0,z
            ]);
        }
        /** 创建旋转矩阵
         * @param {float} theta 旋转弧度
         * @param {int} axis 旋转中心轴  [z,x,y] 默认为 0 (z)
         * @return {Matrix} 返回一个3x3矩阵
         */
        static create_Rotate(theta,axis){
            return Matrix.create_NewSize(Matrix_2.create_Rotate(theta),2,3,2,3,axis,axis);
        }

        /** 创建旋转矩阵 使用任意旋转轴
         * @param {float} theta 旋转弧度
         * @param {List_Value} axis 一个3D向量表示的旋转轴
         * @return {Matrix} 返回一个3x3矩阵
         */
        static create_Rotate__Axis(theta,axis){
            var k     = Vector.is_Unit(axis)?axis:Vector.create_Normalization(axis),
                sin_t = sin(theta),
                cos_t = cos(theta),
                rtn   = Matrix.create_TensorProduct(axis,axis,1,3,3,1),
                skx   = sin_t*k[0],
                sky   = sin_t*k[1],
                skz   = sin_t*k[2];

            Matrix.np_b(rtn,1-cos_t);

            rtn[0] += cos_t;      rtn[1] -= skz;        rtn[2] += sky;
            rtn[3] += skz;        rtn[4] += cos_t;      rtn[5] -= skx;
            rtn[6] -= sky;        rtn[7] += skx;        rtn[8] += cos_t;

            return CONFIG.AXIS?rtn:Matrix.transpose(rtn,3,3);
        }

        /** 创建旋转矩阵, 使用欧拉角
         * @param {List_Value} euler_angles 欧拉角参数 各旋转角角的弧度
         * @param {List_Value} _axis 矩阵乘法的旋转轴顺序 [z,x,y] 默认为 [0,1,2] (BPH)(zxy)
         * @return {Matrix} 返回一个3x3矩阵
         */
        static create_Rotate__EulerAngles(euler_angles,_axis){
            var axis=_axis||[0,1,2]
            var rtn = Matrix_3.create_Rotate(euler_angles[0],axis[0]);
            for(var i=1;i<3;++i){
                rtn=Matrix.multiplication(rtn,Matrix_3.create_Rotate(euler_angles[i],axis[i]),3,3);
            }
            return rtn;
        }

        /** 创建旋转矩阵, 使用四元数
         * @param {List_Value} quat 欧拉角参数 各旋转角角的弧度
         * @return {Matrix} 返回一个3x3矩阵
         */
        static create_Rotate__QUAT(quat){
            // todo
        }

        /** 创建正交投影(平行投影)矩阵
         * @param {List_Value} normal 使用3d向量表示 投影面的法向
         * @return {Matrix} 返回一个3x3矩阵
         */
        static create_Projection__Orthographic(normal){
            var n= Vector.is_Unit(normal)?normal:Vector.create_Normalization(normal);
            var xx=n[0]*n[0],
                xy=n[0]*n[1],
                xz=n[0]*n[2],
                yy=n[1]*n[1],
                yz=n[1]*n[2],
                zz=n[2]*n[2];
            return new Matrix([
                1-xx,   -xy,    -xz,
                -xy,    1-yy,   -yz,
                -xz,    -yz,    1-zz
            ])
        }
        
        /** 创建切变矩阵
         * @param {List_Value[]} k  切变系数, 使用二维向量表示
         * @param {Number} axis 在哪个面上进行切变 [xy,xz,yz]
         * @return {Matrix} 返回一个3x3矩阵
         */
        static create_Shear(k,axis){
            var rtn=new Matrix([1,0,0,0,1,0,0,0,1]);
            var i=Matrix_3._MAPPING_SHEAR_AXIS_TO_INDEX[axis]
            rtn[i]=k[0];
            ++i;
            rtn[i]?++i:0;
            rtn[i]=k[1];
            return rtn;
        }
        /*h*/static _MAPPING_SHEAR_AXIS_TO_INDEX=[6,3,1];
        
        /** 创建镜像矩阵
         * @param {List_Value} n 镜面的法向 3D向量
         * @return {Matrix} 返回一个3x3矩阵
         */
        static create_Horizontal(n){
            var i2xy=-2*n[0]*n[1],
                i2xz=-2*n[0]*n[2],
                i2yz=-2*n[1]*n[2];
            return new Matrix([
                1-2*n[0]*n[0],  i2xy,           i2xz,
                i2xy,           1-2*n[1]*n[1],  i2yz,
                i2xz,           i2yz,           1-2*n[2]*n[2]
            ]);
        }
    }

    Matrix_3.ROTATE_X_CCW_90DEG = new Matrix([1, 0, 0, 0, 0, 1, 0, -1, 0 ]);
    Matrix_3.ROTATE_X_CW_90DEG  = new Matrix([1, 0, 0, 0, 0, 1, 0, -1, 0 ]);
    Matrix_3.ROTATE_X_180DEG    = new Matrix([1, 0, 0, 0, -1, 0, 0, -0, -1 ]);
    Matrix_3.ROTATE_Y_CCW_90DEG = new Matrix([0, 0, -1, 0, 1, 0, 1, 0, 0 ]);
    Matrix_3.ROTATE_Y_CW_90DEG  = new Matrix([0, 0, -1, 0, 1, 0, 1, 0, 0 ]);
    Matrix_3.ROTATE_Y_180DEG    = new Matrix([-1, 0, -0, 0, 1, 0, 0, 0, -1 ]);
    Matrix_3.ROTATE_Z_CCW_90DEG = new Matrix([0, 1, 0, -1, 0, 0, 0, 0, 1 ]);
    Matrix_3.ROTATE_Z_CW_90DEG  = new Matrix([0, 1, 0, -1, 0, 0, 0, 0, 1 ]);
    Matrix_3.ROTATE_Z_180DEG    = new Matrix([-1, 0, 0, -0, -1, 0, 0, 0, 1 ]);
    Matrix_3.TRANSPOSE_MAPPING  = new Int8Array([0,3,6,1,4,7,2,5,8]);
// end  * 3d 变换矩阵 * end 

export{
    Matrix_2,
    Matrix_3,
}