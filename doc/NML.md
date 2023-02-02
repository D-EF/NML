/*   
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com   
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com   
 * @LastEditTime: 2022-10-24 00:07:09   
 * @FilePath: \site\js\import\NML\NML.js   
 * @Description: Nittle Math Library   
 *    
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved.    
 */   
   
# 配置/基础   
/** @typedef {Float32Array} globalThis.NML_VALUE_TYPE */   
globalThis.NML_VALUE_TYPE=globalThis.NML_VALUE_TYPE||Float32Array;   
## const CONFIG  @type {Object} 配置    
```javascript   
const CONFIG={   
    /** 向量使用的数据类型; 可选值为 Float32Array, Float64Array */   
    VALUE_TYPE:globalThis.NML_VALUE_TYPE,   
    /** @type {float} 计算容差 */   
    APPROXIMATELY_TOLERANCE:1e-6   
};   
```    ```   
const {sin,cos,asin,acos,abs,sqrt,tan}=Math,   
    DEG     = globalThis.DEG    = Math.DEG = Math.PI/180,   
    DEG_90  = 90*DEG,   
    DEG_180 = 180*DEG,   
    CYCLES  = globalThis.CYCLES = Math.PI*2;   
```   
   
## function approximately(num1,num2,tolerance)  近似相等, 用于浮点误差计算后判断结果是否相近;    
 * @param {Number} num1 数字   
 * @param {Number} num2 数字   
 * @param {Number} tolerance 容差， 默认为 1e-12   
   
## function copy_Array(rtn,org,_l)  向数组写入数据   
 * @param {List_Value} rtn 输出对象   
 * @param {List_Value} org 数据来源   
 * @param {int} [_l]   写入长度   
 * @return {List_Value} 修改并返回 out   
   
# 类型注释   
/** @typedef {Float32Array} CONFIG.VALUE_TYPE 矩阵计算时缓存下标的类型; 决定了计算时矩阵的n的大小 可选值为 Uint_N_Array, Int_N_Array */   
/** @typedef {Number} int      整形数字 */   
/** @typedef {Number} double   双浮点数字 */   
/** @typedef {Number} float    单浮点数字 */   
/** @typedef {Number[]|Float32Array|Float64Array} List_Value 数据的各种存储形式 */   
   
# 数与代数    
   
## 帕斯卡三角   
### var G_PASCALS_TRIANGLE  @type {Number[][]} 缓存的帕斯卡三角数据    
```javascript   
var G_PASCALS_TRIANGLE=[[1]];   
```   

### function calc_PascalsTriangle(n)  演算帕斯卡三角   
 * @param {Number} n 到多少阶停止   
 * @return 演算并返回缓存的帕斯卡三角数据 不规则二维数组, **别修改内容返回值的内容**!   
   
### function get_PascalsTriangle(n)  获取帕斯卡三角的某一层   
 * @param {Number} n 第n层 从 0 开始数数   
   
## function derivative(coefficients)  多次函数的导数 d(f);   
 ```   
 *         coefficients.length   
 *  F(t) = ∑ t^i*c[i]   
 *         i=0   
 ```   
 * @param {Number[]} coefficients 各次幂的系数 [1, t^1, t^2, t^3, ...]   
 * @return {Number[]}  导数的各次幂的系数 [1, t^1, t^2, t^3, ...] 长度会比形参少 1   
   
## 解方程   
### function solve_BinaryLinearEquation(z1,o1,z2,o2,z3,o3,z4,o4)  解二元一次方程   
 * z1 + o1 \* x = z2 + o2 \* y;   
 * z3 + o3 \* x = z4 + o4 \* y;   
 * @return {{x:Number,y:Number}}    
   
### function calc_rootsOfCubic(coefficient)  解一元三次方程, ax^3+bx^2+cx+d=0   
 * @param {Number[]} coefficient 系数集合 从低次幂到高次幂 [ x^0, x^1, x^2, x^3 ]   
 * @return {Number[]} 返回根的集合   
   
calc_rootsOfCubic.cuberoot=function(v)   
   
# 线性代数   
   
## class Vector extends CONFIG.VALUE_TYPE  向量    
   
// 继承使用 CONFIG.VALUE_TYPE 的构造函数   
   
### static v2__get_Quadrant(v)  判断2d向量在哪个象限上, 规定 0 视作正   
 * @param  {List_Value} v 向量   
 * @return {int} 返回在哪个象限   
   
### static mag(v)   求模长   
 * @param  {List_Value} v 向量   
 * @return {Number} 返回模长   
   
### static is_Unit(v)  判断某个向量是否为单位向量   
 * @param {List_Value} v 向量   
 * @param {boolean} 返回是否为单位向量   
   
### static create_Normalization(v)  创建标准化向量   
 * @param  {List_Value} v 向量   
 * @return {Vector} 返回新的向量   
   
### static normalize(v)   标准化向量   
 * @param  {List_Value} v 向量   
 * @return {List_Value} 修改并返回 v   
   
### static is_Zero(v)  判断向量是不是零向量   
 * @param  {List_Value} v 向量   
 * @return {Number} 返回0或非0   
   
### static is_Equal(v1,v2)  判断向量是否相等   
 * @param  {List_Value} v1 向量1   
 * @param  {List_Value} v2 向量2   
 * @return {Boolean}   
   
### static instead(v)  取反   
 * @param  {List_Value} v 向量   
 * @return {Vector} 返回新的向量   
   
### static instead_b(v)  取反   
 * @param  {List_Value} v 向量   
 * @return {List_Value} 修改并返回v   
   
### static sum(v1,v2)  求向量和   
 * @param  {List_Value} v1 向量1   
 * @param  {List_Value} v2 向量2   
 * @return {Vector} 返回新的向量   
   
### static translate(v1,v2)  再平移   
 * @param {List_Value} v1  原向量   
 * @param {List_Value} v2  偏移量向量   
 * @return {List_Value} 修改并返回 v1   
   
### static dif(v1,v2)  求向量差 1-2   
 * @param {List_Value} v1 向量1   
 * @param {List_Value} v2 向量2   
 * @return {Vector} 返回一个新向量   
   
### static np(v,n)  数字乘向量    
 * @param {List_Value} v    向量   
 * @param {Number} n 标量   
 * @return {Vector} 返回新的向量   
   
### static np_b(v,n)  数字乘向量    
 * @param {List_Value} v    向量   
 * @param {Number} n 标量   
 * @return {Vector} 修改并返回 v   
   
### static dot(v1,v2)  向量内积   
 * @param {List_Value} v1 向量1   
 * @param {List_Value} v2 向量2   
 * @return {Number} 返回 v1 * v2   
   
### static cross(v1,v2)  向量外积 仅支持 3D 和 2D 向量   
 * @param {List_Value} v1 向量1   
 * @param {List_Value} v2 向量2   
 * @return {Number|List_Value} 返回 v1 x v2   
   
### static cos_VV(v1,v2)  计算向量夹角 ∠AOB 的 cos   
 * @param {List_Value} v1 表示角的一边的射线上 的 向量A   
 * @param {List_Value} v2 表示角的一边的射线上 的 向量B   
 * @return {Number} 返回夹角的cos值   
   
## class Matrix extends CONFIG.VALUE_TYPE  矩阵   
 * 矩阵的数据类型为1维线性表:   
 ```   
 * [1, 2, 3]   
 * [4, 5, 6]  >>  [1,2,3,4,5,6,7,8,9]   
 * [7, 8, 9]   
 ```   
   
// 继承使用 CONFIG.VALUE_TYPE 的构造函数   
   
### static create_Print(m,w)  创建打印用的二维数组   
 * @param {List_Value} m 矩阵   
 * @param {int} w 矩阵有多少列(宽度)   
 * @return {Number[][]}    
   
### static check_Square(m,_n)  校验矩阵是否为方阵   
 * @param {List_Value} m    矩阵   
 * @param {int} [_n]    n阶矩阵   
 * @return {int} 返回 n   
 * @throws {Error} 当 n 和 m 的长度 无法形成方阵时 将会抛出异常   
   
### static create_NewSize(m,low_w,new_w,_low_h,_new_h,_shift_left,_shift_top)  根据原矩阵创建新的矩阵, 可以改变矩阵的宽高, 在空的地方会写入单位矩阵的数据    
 ```   
 * create_NewSize([1,2,3,4],2,3);    create_NewSize([1,2,3,4],2,3,2,3,2,1);   
 * // [1,2]    [1,2,0]               // [1,2]    [1,0,0]   
 * // [3,4] >> [3,4,0]               // [3,4] >> [0,1,0]    
 * //          [0,0,1]               //          [0,1,1]   
 ```   
 * @param {Matrix} m    原矩阵   
 * @param {int} low_w           原矩阵宽度   
 * @param {int} new_w           新矩阵宽度   
 * @param {int} [_low_h]        原矩阵高度 无输入时将使用 low_w   
 * @param {int} [_new_h]        新矩阵高度 无输入时将使用 new_w   
 * @param {int} [_shift_left]   旧矩阵拷贝到新矩阵时的左侧偏移 默认为 0   
 * @param {int} [_shift_top]    旧矩阵拷贝到新矩阵时的上方偏移 默认为 _shift_left   
 * @return {Matrix} 返回一个新矩阵   
   
### static setup(rtn,m,low_w,new_w,_low_h,_new_h,_shift_left,_shift_top)  矩阵数据转移   
 * @param {Matrix} rtn  要写入的矩阵   
 * @param {Matrix} m    数据来源矩阵   
 * @param {int} low_w           原矩阵宽度   
 * @param {int} new_w           新矩阵宽度   
 * @param {int} [_low_h]        原矩阵高度 无输入时将使用 low_w   
 * @param {int} [_new_h]        新矩阵高度 无输入时将使用 new_w   
 * @param {int} [_shift_left]   旧矩阵拷贝到新矩阵时的左侧偏移 默认为 0   
 * @param {int} [_shift_top]    旧矩阵拷贝到新矩阵时的上方偏移 默认为 _shift_left   
 * @return {Matrix} 修改 rtn 并返回   
   
### static create_TensorProduct(m1,m2,_w1,_h1,_w2,_h2)  计算张量积   
 * @param {List_Value} m1 矩阵1   
 * @param {List_Value} m2 矩阵2   
 * @param {int} [_w1] 矩阵1的宽度 默认认为 m1 是列向量(w1=1)   
 * @param {int} [_h1] 矩阵1的高度 默认认为 m1 是列向量(h1=m1.length)   
 * @param {int} [_w2] 矩阵2的宽度 默认认为 m2 是行向量(w2=m2.length)   
 * @param {int} [_h2] 矩阵2的高度 默认认为 m2 是行向量(h2=1)   
 * @return {Matrix} 返回一个新的矩阵   
   
### static concat(m_list,w_l,w_m,_h_l,_h_m)  合并矩阵   
 * @param  {List_Value[]} m_list 传入多个矩阵,矩阵应该拥有相同大小   
 * @param  {int} w_l      m_list中一行放几个矩阵   
 * @param  {int} w_m      m_list[i]的宽度   
 * @param  {int} [_h_l]   m_list中一列放几个矩阵   
 * @param  {int} [_h_m]   m_list[i]的高度   
 * @return {Matrix} 返回一个新的矩阵   
 ```javascript   
 *    Matrix.create_Concat([[1,2,3,4], [5,6,7,8]], 2, 2);   
 *    // [1,2]   [5,6] >> [1,2,5,6] >> [1,2,5,6,3,4,7,8]   
 *    // [3,4] , [7,8]    [3,4,7,8]   
 ```   
   
### static np(m,k)  矩阵乘标量   
 * @param {List_Value}     m   矩阵   
 * @param {Number}  k   标量   
 * @return {Matrix} 返回一个新的矩阵   
   
### static np_b(m,k)  矩阵乘标量   
 * @param {List_Value}     m   矩阵   
 * @param {Number}  k   标量   
 * @return {List_Value} 修改m并返回   
   
### static get_Index(n,u,v)  使用 uv 获取 index    
 * @param {int} n 矩阵宽度 (列数)   
 * @param {int} u 元素的 u 坐标 (第u列)   
 * @param {int} v 元素的 v 坐标 (第v行)   
   
### static create_Identity(w,_h)  创建单位矩阵   
 * @param {int}  w   矩阵宽度   
 * @param {int} [h]  矩阵高度 默认和 w 相等   
 * @return {Matrix}    
   
### static transform_Exchange(m,n,v1,v2)  初等变换 换行操作   
 * @param {List_Value|List_Value[]} m 一个或多个矩阵   
 * @param {int} n       n阶矩阵 用来表示一行的长度   
 * @param {int} v1      矩阵v坐标1 (要对调的行下标1)   
 * @param {int} v2      矩阵v坐标2 (要对调的行下标2)   
 * @return {m} 修改并返回m   
   
### static transform_multiplication(m,n,v,value)  初等变换 某行乘标量   
 * @param {List_Value|List_Value[]} m     矩阵   
 * @param {int} n           n阶矩阵   
 * @param {int} v           矩阵的v坐标(行下标)   
 * @param {Number} value    乘法中的标量部分   
   
### static exchange_zero(m,index,v,spl,_index_m)  将矩阵某个为0的项 通过初等变换的换行操作, 变成非0   
 * @param {List_Value|List_Value[]} m     一个或多个矩阵   
 * @param {int} index       当前下标   
 * @param {int} v           当前v坐标(行下标)   
 * @param {int} spl         寻址步长,应为 ±n   
 * @param {int} [_index_m]   传入多个矩阵时使用哪个矩阵的值 默认0   
 * @return {m}    
   
### static multiplication(m1,m2,_h1,_w1h2,_w2)  矩阵乘法    如果不传入矩阵宽高信息将视为方阵   
 * @param {List_Value} m1 矩阵1   
 * @param {List_Value} m2 矩阵2   
 * @param {int} [_h1]   左矩阵的行数(高度)   
 * @param {int} [_w1h2] 左矩阵的列数(宽度) 与 右矩阵的行数(高度)   
 * @param {int} [_w2]   右矩阵的列数(宽度)   
 * @return {Matrix} 返回一个新的矩阵   
   
### static transpose(m,_w,_h)  矩阵转置   
 * @param {List_Value} m 矩阵   
 * @param {int} [_w] 矩阵宽度(列数)   
 * @param {int} [_h] 矩阵高度(行数)   
 * @return {m} 修改m并返回   
   
### static create_Transposed(m,_n)  创建矩阵的转置   
 * @param {List_Value} m 矩阵   
 * @param {int} [_n] 矩阵为n阶矩阵   
 * @return {m} 返回一个新的矩阵   
   
### static calc_Det(m,_n)  计算矩阵行列式   
 * @param {List_Value} m 矩阵   
 * @param {int} [_n] 矩阵为n阶矩阵   
 * @return {Number} 返回矩阵的行列式   
   
### static calc_Det__Transform(m,_n)  计算矩阵行列式 --使用初等变换   
 * @param {List_Value} m 矩阵   
 * @param {int} [_n] 矩阵为n阶矩阵   
 * @return {Number} 返回矩阵的行列式   
   
### static inverse__Transform(m,_n)  变换得到矩阵逆   
 * @param {List_Value} m 传入矩阵, 计算完后将会变成单位矩阵   
 * @param {int} [_n]     矩阵为n阶矩阵   
 * @return {Matrix}      返回一个新的矩阵   
   
### static create_Inverse(m,_n)  求矩阵的逆 (创建逆矩阵)   
 * @param {List_Value} m       矩阵   
 * @param {int} [_n]    矩阵为n阶矩阵   
 * @return {Matrix|null}     返回一个新的矩阵   
   
# 基础图形学   
   
## 2d 变换矩阵   
   
### class Matrix_2 extends Matrix  用于创建2d变换矩阵的静态类    
   
#### static create_Rotate(theta)  创建旋转矩阵   
 * @param {Number} theta 顺时针 旋转角弧度   
 * @return {Matrix_2}   
   
#### static create_Rotate__v(_v)  创建旋转矩阵 使用向量   
 * @param {Vector} _v 2d向量   
 * @return {Matrix_2}   
   
#### static create_Scale(x,y)  创建缩放矩阵   
 * @param {Number} x x 轴方向上的缩放系数   
 * @param {Number} y y 轴方向上的缩放系数   
 * @return {Matrix_2}   
   
#### static create_Horizontal (x,y)  创建镜像矩阵(对称)   
 * @param {Number} x 对称轴的法向 x 坐标   
 * @param {Number} y 对称轴的法向 y 坐标   
 * @return {Matrix_2}   
   
#### static create_Shear(kx,ky)  创建切变矩阵   
 * @param {Number} kx x方向的切变系数   
 * @param {Number} ky y方向的切变系数   
 * @return {Matrix_2}   
   
#### static create_Identity()  创建单位矩阵   
 * @return {Matrix_2}   
   
#### static create_ByVector(v2)  创建等比缩放&旋转矩阵 根据向量生成矩阵   
 * @param {List_Value} v2 2d向量   
 * @return {Matrix_2} 返回一个矩阵   
   
Matrix_2.ROTATE_90=new Matrix_2([0,1,-1,0]);   
Matrix_2.ROTATE_90_I=new Matrix_2([0,-1,1,0]);   
Matrix_2.FLIP_HORIZONTAL=new Matrix_2([-1,0,0,1]);   
   
## 3d 变换矩阵   
### class Matrix_3 extends Matrix  用于创建3D变换矩阵的静态类   
 *  规定统一使用左手坐标系   
 ```   
 *           ^  +y   
 *           |     7 +z   
 *           |  /     
 *  ---------+---------> +x   
 *        /  |      
 *     /     |      
 *           |      
 ```   
   
#### static create_Scale(x,y,z)  创建缩放矩阵   
 * @param {flot} x x坐标中的缩放系数   
 * @param {flot} y y坐标中的缩放系数   
 * @param {flot} z z坐标中的缩放系数   
 * @return {Matrix_3} 返回一个矩阵   
#### static create_Rotate(theta,axis)  创建旋转矩阵   
 * @param {Number} theta 旋转弧度   
 * @param {int} axis 旋转中心轴  [z,x,y] 默认为 0 (z)   
 * @return {Matrix_3} 返回一个矩阵   
   
#### static create_Rotate__Axis(theta,axis)  创建旋转矩阵 使用任意旋转轴   
 * @param {Float} theta 旋转弧度   
 * @param {List_Value} axis 一个3D向量表示的旋转轴   
 * @return {Matrix_3} 返回一个矩阵   
   
#### static create_Rotate__EulerAngles(euler_angles,_axis)  创建旋转矩阵, 使用欧拉角   
 * @param {List_Value} euler_angles 欧拉角参数 各旋转角角的弧度   
 * @param {List_Value} _axis 欧拉角的旋转轴顺序 [z,x,y] 默认为 [0,1,2](BPH)(zxy)   
 * @return {Matrix_3} 返回一个矩阵   
   
#### static create_Rotate__QUAT(quat)  创建旋转矩阵, 使用四元数   
 * @param {List_Value} quat 欧拉角参数 各旋转角角的弧度   
 * @return {Matrix_3} 返回一个矩阵   
   
#### static create_Projection__Orthographic(normal)  创建正交投影(平行投影)矩阵   
 * @param {List_Value} normal 使用3d向量表示 投影面的法向   
 * @return {Matrix_3} 返回一个矩阵   
   
#### static create_Shear(k,axis)  创建切变矩阵   
 * @param {Number[]} k  切变系数, 使用二维向量表示   
 * @param {Number} axis 在哪个面上进行切变 [xy,xz,yz]   
 * @return {Matrix_3}   
   
#### static create_Horizontal(n)  创建镜像矩阵   
 * @param {List_Value} n 镜面的法向 3D向量   
 * @return {Matrix_3}   
   
Matrix_3.ROTATE_X_CCW_90DEG = new Matrix_3([1, 0, 0, 0, 0, 1, 0, -1, 0 ]);   
Matrix_3.ROTATE_X_CW_90DEG  = new Matrix_3([1, 0, 0, 0, 0, 1, 0, -1, 0 ]);   
Matrix_3.ROTATE_X_180DEG    = new Matrix_3([1, 0, 0, 0, -1, 0, 0, -0, -1 ]);   
Matrix_3.ROTATE_Y_CCW_90DEG = new Matrix_3([0, 0, -1, 0, 1, 0, 1, 0, 0 ]);   
Matrix_3.ROTATE_Y_CW_90DEG  = new Matrix_3([0, 0, -1, 0, 1, 0, 1, 0, 0 ]);   
Matrix_3.ROTATE_Y_180DEG    = new Matrix_3([-1, 0, -0, 0, 1, 0, 0, 0, -1 ]);   
Matrix_3.ROTATE_Z_CCW_90DEG = new Matrix_3([0, 1, 0, -1, 0, 0, 0, 0, 1 ]);   
Matrix_3.ROTATE_Z_CW_90DEG  = new Matrix_3([0, 1, 0, -1, 0, 0, 0, 0, 1 ]);   
Matrix_3.ROTATE_Z_180DEG    = new Matrix_3([-1, 0, 0, -0, -1, 0, 0, 0, 1 ]);   
   
## 旋转   
### class Euler_Angles extends CONFIG.VALUE_TYPE  欧拉角    
   
#### 构造函数 new Euler_Angles(data)    
 * @param {List_Value} data 欧拉角旋转数据    
   
##### 属性(成员变量)   
   
#### static create_FromMatrix(m)  使用矩阵计算出欧拉角   
 * @param {Matrix_3} m 仅做过旋转变换的矩阵   
 * @param {int}  [_axis]    旋转轴顺序 [z,x,y] 默认为 [0,1,2](BPH)(zxy)   
 * @return {Euler_Angles}   
   
#### static create_FromQUAT(m)  使用四元数   
 * @param {QUAT} quat       四元数   
 * @param {int}  [_axis]    旋转轴顺序 [z,x,y] 默认为 [0,1,2](BPH)(zxy)   
 * @return {Euler_Angles}   
   
### class QUAT extends CONFIG.VALUE_TYPE  四元数    
   
#### static create_FromMatrix(m)  使用矩阵计算出欧拉角   
 * @param {Matrix_3} m 仅做过旋转变换的矩阵   
 * @return {Euler_Angles}   
   
#### static create_FromEulerAngles(m)  使用四元数   
 * @param {QUAT} m 仅做过旋转变换的矩阵   
 * @return {Euler_Angles}   
   
## 变换矩阵控制器   
### 3d 变换矩阵控制器   
   
#### class Transform_3D_Matrix_Ctrl  3d 变换矩阵控制器    
   
##### 构造函数 new Transform_3D_Matrix_Ctrl(process)     
 * @param {Hand__Transform_3D_Matrix_Ctrl[]} process    
   
###### 属性(成员变量)   
* Transform_3D_Matrix_Ctrl.prototype.process   
    {Hand__Transform_3D_Matrix_Ctrl[]} 变换过程    
* Transform_3D_Matrix_Ctrl.prototype._mat   
    {Matrix} 4x4 矩阵,缓存的变换矩阵    
   
##### get_Matrix()  获取变换矩阵   
 * @return {Matrix} 返回一个新的矩阵   
   
##### get_Matrix__Life()  获取当前控制器的 变换矩阵的引用   
 * @return {Matrix} 返回 this._mat   
   
#### class Hand__Transform_3D_Matrix_Ctrl  3d 变换矩阵控制器 单个变换操作    
   
##### 构造函数 new Hand__Transform_3D_Matrix_Ctrl(type,params)     
 * @param {Number|String} type    
 * @param {*} params    
   
###### 属性(成员变量)   
* Hand__Transform_3D_Matrix_Ctrl.prototype._type   
    {Number}    
   
##### copy(tgt)    
 * @param {Hand__Transform_3D_Matrix_Ctrl} tgt 拷贝对象   
 * @return {Hand__Transform_3D_Matrix_Ctrl}   
   
##### static MAPPING__HAND_NO_TO_TYPE_NAME  @type {String[]} 操作类型映射表    
```javascript   
static MAPPING__HAND_NO_TO_TYPE_NAME=[   
    // todo   
    "translate",   
    "size",   
    "rotate",   
    "pojection",   
    "shear",   
    "horizontal"   
]   
```               
   
# 贝塞尔曲线   
   
## function get_BezierCurvePoint__DeCasteljau(points,t)  求贝塞尔曲线 pt 点 (DeCasteljau算法)     
 * 算法代码来自 https://pomax.github.io/bezierinfo/zh-CN/index.html   
 * @param {{x:Number,y:Number}[]} points 控制点集合   
 * @param {Number} t t参数   
 * @return {{x:Number,y:Number}} 返回对应点   
   
## function get_BezierMatrix(n)  获取贝塞尔曲线的计算矩阵    
 * @param {Number} n n阶贝塞尔曲线   
 * @return {Number[][]} 贝塞尔曲线的计算矩阵   
   
## function get_BezierCoefficient(points)  贝塞尔曲线控制点求各次幂的系数   
 * @param {Number[]} points 控制点集合   
 * @return {Number[]} 贝塞尔曲线采样计算系数   
   
## function get_BezierDerivativesPoints(points)  求贝塞尔曲线的导函数的控制点 (一维)   
 * @param {Number[]} points 原曲线的控制点集合    
 * @return {Number[]} 导函数的控制点   
   
## function create_CutBezierMatrixQ(n,t)  计算贝塞尔曲线分割时使用的 Q 矩阵 (不补零)   
 * @param {Number} n  n阶贝塞尔曲线   
 * @param {Number} t  t参数 0~1   
 * @return {Number[][]} 贝塞尔曲线的计算分割时使用的矩阵   
   
## function cut_Bezier__ByMatrix(points,matrix,flag)  用矩阵分割贝塞尔曲线   
 * @param {Number[]} points        控制点集合   
 * @param {Number[][]} matrix 分割时使用的矩阵, 用 create_CutBezierMatrixQ 函数生成   
 * @param {Boolean} flag 前后两边 false(0)为p1起点, true(!0)为p4终点   
 * @return {Number[]} 返回两组控制点   
   
## function calc_BezierCtrlPoints__ByCoefficientTo(coefficient)  通过系数创建贝塞尔曲线控制点   
 * @param {Number[]}    coefficient 采样点计算系数   
 * @return {Number[]}  返回控制点   
   
```javascript   
// 二维平面贝塞尔曲线拟合圆弧公式   
// 单位圆且起点角度为0   示例   
// p1=(1,0)   
// p2=(1,k)     //p1 + (k*导向量)   
// p3=p4 + (-k*导向量)   
// p4=采样点   
```   
   
## function calc_k__BezierToCyles(angle)  计算 贝塞尔曲线拟合圆弧 的 k 值   
 * @param   {Number} angle 夹角   
 * @return {Number} 返回 k 值   
   
## const BEZIER_TO_CYCLES_K__1D4 @type {Number} 贝塞尔曲线拟合四分之一圆 的 k 值    
   
# 导出   
```javascript   
export{   
   CONFIG as NML_CONFIG,   
   DEG,   
   DEG_90,   
   DEG_180,   
   CYCLES,   
   
   calc_PascalsTriangle,   
   get_PascalsTriangle,   
   derivative,   
   solve_BinaryLinearEquation,   
   calc_rootsOfCubic,   
   
   get_BezierCurvePoint__DeCasteljau,   
   get_BezierMatrix,   
   get_BezierCoefficient,   
   get_BezierDerivativesPoints,   
   create_CutBezierMatrixQ,   
   cut_Bezier__ByMatrix,   
   calc_BezierCtrlPoints__ByCoefficientTo,   
   calc_k__BezierToCyles,   
   BEZIER_TO_CYCLES_K__1D4,   
   
   Vector,   
   Matrix,   
   Matrix_2,   
   Matrix_3,   
   copy_Array   
}   
