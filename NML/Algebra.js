/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2023-01-20 19:13:27
 * @FilePath: \site\js\import\NML\NML\Algebra.js
 * @Description: 数字运算相关
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

/*h*/// open * 类型注释 * open
    /*h*//** @typedef {Float32Array} CONFIG.VALUE_TYPE 矩阵计算时缓存下标的类型; 决定了计算时矩阵的n的大小 可选值为 Uint_N_Array, Int_N_Array */
    /*h*//** @typedef {Number} int      整形数字 */
    /*h*//** @typedef {Number} double   双浮点数字 */
    /*h*//** @typedef {Number} float    单浮点数字 */
    /*h*//** @typedef {Number[]|Float32Array|Float64Array} List_Value 数据的各种存储形式 */
/*h*/// end  * 类型注释 * end

import {copy_Array,approximately,CONFIG} from "./Config.js";
/*h*/const {sin,cos,asin,acos,abs,sqrt,tan}=Math;

// open * 数与代数 * open 

    // open * 帕斯卡三角 * open
        /** @type {Number[][]} 缓存的帕斯卡三角数据 */
        var _G_PASCALS_TRIANGLE=[[1]];
        /*h*/calc_PascalsTriangle(3);
        /** 演算帕斯卡三角
         * @param {Number} n 到多少阶停止
         * @return 演算并返回缓存的帕斯卡三角数据 不规则二维数组, **别修改内容返回值的内容**!
         */
        function calc_PascalsTriangle(n){
            var i,j;
            var rtn=_G_PASCALS_TRIANGLE;
            for(i=rtn.length;i<=n;++i){
                rtn.push([]);
                for(j=0;j<i+1;++j){
                    rtn[i].push((rtn[i-1][j]||0)+(rtn[i-1][j-1]||0));
                }
            }
            return rtn;
        }
        /** 获取帕斯卡三角的某一层
         * @param {Number} n 第n层 从 0 开始数数
         */
        function get_PascalsTriangle(n){
            if(_G_PASCALS_TRIANGLE.length<=n)calc_PascalsTriangle(n);
            return _G_PASCALS_TRIANGLE[n];
        }
    // end  * 帕斯卡三角 * end 

    /** 多次函数的导数 d(f);
     * ```
     *         coefficients.length
     *  F(t) = ∑ t^i*c[i]
     *         i=0
     * ```
     * @param {Number[]} coefficients 各次幂的系数 [1, t^1, t^2, t^3, ...]
     * @return {Number[]}  导数的各次幂的系数 [1, t^1, t^2, t^3, ...] 长度会比形参少 1
     */
    function derivative(coefficients){
        var i=coefficients.length-1,
            rtn=new Array(i);
        for(;i>0;--i){
            rtn[i-1]=coefficients[i]*i;
        }
        return rtn;
    }

    // open * 解方程 * open
        /** 解二元一次方程
         * z1 + o1 \* x = z2 + o2 \* y;
         * z3 + o3 \* x = z4 + o4 \* y;
         * @return {{x:Number,y:Number}} 
         */
        function solve_BinaryLinearEquation(z1,o1,z2,o2,z3,o3,z4,o4){
            var x=(z2*o4+o2*z3-z4*o2-z1*o4)/(o1*o4-o2*o3),
                y=(z3+o3*x-z4)/o4;
            return {x:x,y:y};
        }

        /** 解一元三次方程, ax^3+bx^2+cx+d=0
         * @param {Number[]} coefficient 系数集合 从低次幂到高次幂 [ x^0, x^1, x^2, x^3 ]
         * @return {Number[]} 返回根的集合
         */
        function calc_rootsOfCubic(coefficient){
            var a=coefficient[2]||0,
                b=coefficient[1]||0,
                c=coefficient[0]||0,
                d=coefficient[3]||0;

            //一元一至三次函数求根公式编程表示 来自 https://pomax.github.io/bezierinfo/zh-CN/index.html#extremities
            
            // Quartic curves: Cardano's algorithm.

            // do a check to see whether we even need cubic solving:
            if (approximately(d, 0)) {
                // this is not a cubic curve.
                if (approximately(a, 0)) {
                    // in fact, this is not a quadratic curve either.
                    if (approximately(b, 0)) {
                        // in fact in fact, there are no solutions.
                        return [];
                    }
                    // linear solution
                    return [-c / b];
                }
                // quadratic solution
                var k=b * b - 4 * a * c;
                if(k<0)return [];
                var q = Math.sqrt(k), a2 = 2 * a;
                return [(q - b) / a2, (-b - q) / a2];
            }
            
            a /= d;
            b /= d;
            c /= d;

            var p = (3 * b - a * a) / 3,
                p3 = p / 3,
                q = (2 * a * a * a - 9 * a * b + 27 * c) / 27,
                q2 = q / 2,
                discriminant = q2 * q2 + p3 * p3 * p3;

            // and some variables we're going to use later on:
            var u1, v1, root1, root2, root3;

            // three possible real roots:
            if (discriminant < 0) {
                var mp3 = -p / 3,
                    mp33 = mp3 * mp3 * mp3,
                    r = Math.sqrt(mp33),
                    t = -q / (2 * r),
                    cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
                    phi = Math.acos(cosphi),
                    crtr = calc_rootsOfCubic._cuberoot(r),
                    t1 = 2 * crtr;
                root1 = t1 * Math.cos(phi / 3) - a / 3;
                root2 = t1 * Math.cos((phi + 2 * Math.PI) / 3) - a / 3;
                root3 = t1 * Math.cos((phi + 4 * Math.PI) / 3) - a / 3;
                return [root1, root2, root3];
            }

            // three real roots, but two of them are equal:
            if (discriminant === 0) {
                u1 = q2 < 0 ? calc_rootsOfCubic._cuberoot(-q2) : -calc_rootsOfCubic._cuberoot(q2);
                root1 = 2 * u1 - a / 3;
                root2 = -u1 - a / 3;
                return [root1, root2];
            }

            // one real root, two complex roots
            var sd = Math.sqrt(discriminant);
            u1 = calc_rootsOfCubic._cuberoot(sd - q2);
            v1 = calc_rootsOfCubic._cuberoot(sd + q2);
            root1 = u1 - v1 - a / 3;
            return [root1];
        }
        /*h*/calc_rootsOfCubic._cuberoot=function(value){
        /*h*/    return value < 0?-Math.pow(-value, 1 / 3) : Math.pow(value, 1 / 3);
        /*h*/}
    // end  * 解方程 * end 

// end  * 数与代数 * end 


// open * 贝塞尔曲线 * open

    /** 求贝塞尔曲线 pt 点 (DeCasteljau算法)  
     * 算法代码来自 https://pomax.github.io/bezierinfo/zh-CN/index.html
     * @param {{x:Number,y:Number}[]} points 控制点集合
     * @param {Number} t t参数
     * @return {{x:Number,y:Number}} 返回对应点
     */
     function get_BezierCurvePoint__DeCasteljau(points,t){
        if(points.length>1){
            var newPoints=new Array(points.length-1);
            var x,y;
            var td=1-t;
            for(var i=newPoints.length-1;i>=0;--i){
                x=td*points[i].x+t*points[i+1].x;
                y=td*points[i].y+t*points[i+1].y;
                newPoints[i]={x:x,y:y};
            }
            return get_BezierCurvePoint__DeCasteljau(newPoints,t);
        }else{
            return points[0];
        }
    }
    /*h*/ /** @type {Number[][]} 缓存的贝塞尔曲线计算矩阵 */
    /*h*/ const _BEZIER_MATRIXS=[[1]];
    /** 获取贝塞尔曲线的计算矩阵 
     * @param {Number} n n阶贝塞尔曲线
     * @return {Number[][]} 贝塞尔曲线的计算矩阵
     */
    function get_BezierMatrix(n){
        if(_BEZIER_MATRIXS[n])return _BEZIER_MATRIXS[n];

        if(_G_PASCALS_TRIANGLE.length<=n)calc_PascalsTriangle(n);
        var i,j,f;
        var m=new Array(n+1);
        for(i=n;i>=0;--i){
            m[i]=new Array(i+1);
            for(j=i,f=1;j>=0;--j){
                m[i][j]=_G_PASCALS_TRIANGLE[i][j]*_G_PASCALS_TRIANGLE[n][i]*f;
                f*=-1;
            }
        }
        _BEZIER_MATRIXS.length=n+1;
        _BEZIER_MATRIXS[n]=m;
        return m;
    }

    /** 贝塞尔曲线控制点求各次幂的系数
     * @param {Number[]} points 控制点集合
     * @return {Number[]} 贝塞尔曲线采样计算系数
     */
    function get_BezierCoefficient(points){
        var n=points.length-1;
        var m=get_BezierMatrix(n);
        var rtn=new Array(points.length);
        var i,j,temp;
        for(i=n;i>=0;--i){
            temp=0;
            for(j=i;j>=0;--j){
                temp+=m[i][j]*points[j];
            }
            rtn[i]=temp;
        }
        return rtn;
    }

    /** 求贝塞尔曲线的导函数的控制点 (一维)
     * @param {Number[]} points 原曲线的控制点集合 
     * @return {Number[]} 导函数的控制点
     */
    function get_BezierDerivativesPoints(points){
        var n=points.length-2;
        var rtn=new Array(n+1);
        if(n<0)return {x:0,y:0}
        for(var i=n;i>=0;--i){
            rtn[i]=n*(points[i+1]-points[i])
        }
        return rtn;
    }

    /** 计算贝塞尔曲线分割时使用的 Q 矩阵 (不补零)
     * @param {Number} n  n阶贝塞尔曲线
     * @param {Number} t  t参数 0~1
     * @return {Number[][]} 贝塞尔曲线的计算分割时使用的矩阵
     */
    function create_CutBezierMatrixQ(n,t){
        if(_G_PASCALS_TRIANGLE.length<=n){
            calc_PascalsTriangle(n);
        }
        var i,j,k;
        var rtn=new Array(n+1);
        for(i=n;i>=0;--i){
            rtn[i]=_G_PASCALS_TRIANGLE[i].concat();
        }
        var temp=t,
            td=t-1;
        // i 是行下标, j 是列下标
        for(i=1;i<=n;++i,temp*=t){
            for(j=i;j<=n;++j){
                rtn[j][i]*=temp;
            }
        }
        temp=-td;
        for(i=n-1;i>=0;--i,temp*=-td){
            for(j=i,k=n;j>=0;--j,--k){
                rtn[k][j]*=temp;
            }
        }
        return rtn;
    }

    /** 用矩阵分割贝塞尔曲线
     * @param {Number[]} points        控制点集合
     * @param {Number[][]} matrix 分割时使用的矩阵, 用 create_CutBezierMatrixQ 函数生成
     * @param {Boolean} flag 前后两边 false(0)为p1起点, true(!0)为p4终点
     * @return {Number[]} 返回两组控制点
     */
    function cut_Bezier__ByMatrix(points,matrix,flag){
        var n=points.length-1,
            i,j,
            rtn=new Array(points.length),
            temp;

        //j是行下标 i是列下标
        if(flag){
            // pt起点, p4终点
            for(i=n;i>=0;--i){
                temp=0;
                for(j=i;j>=0;--j){
                    temp+=points[n-j]*matrix[i][i-j];
                }
                rtn[n-i]=temp;
            }
        }else{
            // p1起点, pt终点
            for(i=n;i>=0;--i){
                temp=0;
                for(j=i;j>=0;--j){
                    temp+=points[j]*matrix[i][j];
                }
                rtn[i]=temp;
            }
        }
        return rtn;
    }

    /** 通过系数创建贝塞尔曲线控制点
     * @param {Number[]}    coefficient 采样点计算系数
     * @return {Number[]}  返回控制点
     */
    function calc_BezierCtrlPoints__ByCoefficientTo(coefficient){
        var n=coefficient.length,
            rtn=new Array(n),
            m=get_BezierMatrix(--n),
            temp;
        
        for(var i=0;i<=n;++i){
            temp=coefficient[i];
            for(var j=0;j<i;++j){
                temp-=rtn[j]*m[i][j]
            }
            rtn[i]=temp/m[i][j];
        }
        return rtn;
    }
    //```javascript
    // 二维平面贝塞尔曲线拟合圆弧公式
    // 单位圆且起点角度为0   示例
    // p1=(1,0)
    // p2=(1,k)     //p1 + (k*导向量)
    // p3=p4 + (-k*导向量)
    // p4=采样点
    //```

    /*h*/const _DIVISION_4_3=4/3;
    /** 计算 贝塞尔曲线拟合圆弧 的 k 值
     * @param   {Number} angle 夹角
     * @return {Number} 返回 k 值
     */
    function calc_k__BezierToCyles(angle){
        return _DIVISION_4_3*tan(angle*0.25);
    }

    /**@type {Number} 贝塞尔曲线拟合四分之一圆 的 k 值 */
    const BEZIER_TO_CYCLES_K__1D4=0.551784777779014;

// end  * 贝塞尔曲线 * end 


//# 导出
export{
    calc_PascalsTriangle,
    get_PascalsTriangle,
    derivative,
    solve_BinaryLinearEquation,
    calc_rootsOfCubic,

    get_BezierMatrix,
    get_BezierCoefficient,
    get_BezierDerivativesPoints,
    create_CutBezierMatrixQ,
    cut_Bezier__ByMatrix,
    calc_BezierCtrlPoints__ByCoefficientTo,
    calc_k__BezierToCyles,
    BEZIER_TO_CYCLES_K__1D4
}