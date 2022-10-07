<!--
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-09-10 21:02:08
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-09-13 23:20:55
 * @FilePath: \PrimitivesTGT-2D_Editor\js\import\PrimitivesTGT\NML.js.md
 * @Description: 
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
-->

# 一点点数学 Nittle Math Library

*本文档最后更新于 2022-09-10 , 可能会与代码有偏差，请以代码及其注释为准*

# 配置 CONGFIG
在 NML.js 文件中有一段配置 使用的代码，如果需要修改请直接修改 NML.js 文件中的对应代码
``` javascript
/** 配置  */
const CONGFIG={
    /** 向量使用的数据类型; 可选值为 Float32Array, Float64Array */
    VALUE_TYPE:Float32Array,
    /** @type {float} 计算容差 */
    APPROXIMATELY_TOLERANCE:1e-6
};
```

# 文件中定义的类型注释
```javascript
// 类型注释 open
    /** @typedef {Float32Array} CONGFIG.VALUE_TYPE 矩阵计算时缓存下标的类型; 决定了计算时矩阵的n的大小 可选值为 Uint_N_Array, Int_N_Array */
    /** @typedef {Number} int      整形数字 */
    /** @typedef {Number} double   双浮点数字 */
    /** @typedef {Number} float    单浮点数字 */
    /** @typedef {Number[]|Float32Array|Float64Array|Vector} Vec 2D向量的各种存储形式 */
    /** @typedef {Number[]|Float32Array|Float64Array|Matrix} Mat 矩阵的各种存储形式 */
// 类型注释 end
```

# 类
NML.js 中使用的数据结构大部分为线性结构, 并使用静态函数进行操作。
* [向量 Vector](#vector)
* [矩阵 Matrix](#matrix)
* [2d矩阵 Matrix_2](#matrix_2)
* [3d矩阵 Matrix_3](#matrix_3)

---
## Vector
向量使用(继承)了配置中的数据类型
```javascript
 class Vector extends CONGFIG.VALUE_TYPE 
``` 

### static v2__get_Quadrant()   判断2d向量在哪个象限上, 规定 0 视作正
* @param  {Vec} v 向量
* @return {int} 返回在哪个象限
---

### static mag(v)    求模长
* @param  {Vec} v 向量
* @return {Number} 返回模长
---

### static create_Normalization(v)   创建标准化向量
* @param  {Vec} v 向量
* @return {Vector} 返回新的向量
---

### static normalize(v)    标准化向量
* @param  {Vec} v 向量
* @return {Vec} 修改并返回 v
---

### static is_Zero(v)   判断向量是不是零向量
* @param  {Vec} v 向量
* @return {Number} 返回0或非0
---

### static is_Equal(v1,v2)   判断向量是否相等
* @param  {Vec} v1 向量1
* @param  {Vec} v2 向量2
* @return {Boolean}
---

### static instead(v)   取反
* @param  {Vec} v 向量
* @return {Vector} 返回新的向量
---

### static instead_b(v)   取反
* @param  {Vec} v 向量
* @return {Vec} 修改并返回v
---

### static sum(v1,v2)   求向量和
* @param  {Vec} v1 向量1
* @param  {Vec} v2 向量2
* @return {Vector} 返回新的向量
---

### static translate(v1,v2)   再平移
* @param {Vec} v1  原向量
* @param {Vec} v2  偏移量向量
* @return {Vec} 修改并返回 v1
---

### static dif(v1,v2)   求向量差 1-2
* @param {Vec} v1 向量1
* @param {Vec} v2 向量2
* @return {Vector} 返回一个新向量
---

### static np(v,n)   数字乘向量 
* @param {Vec} v    向量
* @param {Number} n 标量
* @return {Vector} 返回新的向量
---

### static np_b(v,n)   数字乘向量 
* @param {Vec} v    向量
* @param {Number} n 标量
* @return {Vector} 修改并返回 v
---

### static dot(v1,v2)   向量内积
* @param {Vec} v1 向量1
* @param {Vec} v2 向量2
* @return {Number} 返回 v1 * v2
---

### static cross(v1,v2)   向量外积 仅支持 3D 和 2D 向量
* @param {Vec} v1 向量1
* @param {Vec} v2 向量2
* @return {Number|Vec} 返回 v1 x v2
---

### static cos_VV(v1,v2)   计算向量夹角 ∠AOB 的 cos
* @param {Vec} v1 表示角的一边的射线上 的 向量A
* @param {Vec} v2 表示角的一边的射线上 的 向量B
* @return {Number} 返回夹角的cos值
---

<!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Matrix 矩阵 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  -->

---
## Matrix
```javascript
/**
 * 矩阵的数据类型为1维线性表:
 * [1, 2, 3]
 * [4, 5, 6]  >>  [1,2,3,4,5,6,7,8,9]
 * [7, 8, 9]
 */
 class Matrix extends CONGFIG.VALUE_TYPE 
```

### static create_Print(m,w)   创建打印用的二维数组
* @param {Mat} m 矩阵
* @param {int} w 矩阵有多少列(宽度)
* @return {Number[][]} 
---

### static check_Square(m,_n)   校验矩阵是否为方阵
* @param {Mat} m    矩阵
* @param {int} [_n]    n阶矩阵
* @return {int} 返回n
* @throws {Error} 当 _n 和 m的长度 无法形成方阵时 将会报错
---

### static create_NewSize(m,low_w,new_w,_low_h,_new_h)   矩阵升级
* @param {Matrix} m    原矩阵
* @param {int} low_w           原矩阵宽度
* @param {int} new_w           新矩阵宽度
* @param {int} [_low_h]        原矩阵高度 无输入时将使用 low_w
* @param {int} [_new_h]        新矩阵高度 无输入时将使用 new_w
* @return {Matrix} 返回一个新矩阵
---

### static get_Index(n,u,v)   使用 uv 获取 index 
* @param {int} n 矩阵宽度 (列数)
* @param {int} u 元素的 u 坐标 (第u列)
* @param {int} v 元素的 v 坐标 (第v行)
---

### static create_Identity(n)   创建单位矩阵
* @param {int}  n   n阶矩阵
* @return {Matrix} 
---

### static transform_Exchange(m,n,v1,v2)   初等变换 换行操作
* @param {Mat|Mat[]} m 一个或多个矩阵
* @param {int} n       n阶矩阵 用来表示一行的长度
* @param {int} v1      矩阵v坐标1 (要对调的行下标1)
* @param {int} v2      矩阵v坐标2 (要对调的行下标2)
* @return {m} 修改并返回m
---

### static transform_multiplication(m,n,v,value)   初等变换 某行乘标量
* @param {Mat|Mat[]} m     矩阵
* @param {int} n           n阶矩阵
* @param {int} v           矩阵的v坐标(行下标)
* @param {Number} value    乘法中的标量部分
---

### static exchange_zero(m,index,v,spl,_index_m)   将矩阵某个为0的项 通过初等变换的换行操作, 变成非0
* @param {Mat|Mat[]} m     一个或多个矩阵
* @param {int} index       当前下标
* @param {int} v           当前v坐标(行下标)
* @param {int} spl         寻址步长,应为 ±n
* @param {int} [_index_m]   传入多个矩阵时使用哪个矩阵的值 默认0
* @return {m} 
---

### static multiplication(m1,m2,_h1,_w1h2,_w2)   矩阵乘法    如果不传入矩阵宽高信息将视为方阵
* @param {Mat} m1 矩阵1
* @param {Mat} m2 矩阵2
* @param {int} [_h1]   左矩阵的行数(高度)
* @param {int} [_w1h2] 左矩阵的列数(宽度) 与 右矩阵的行数(高度)
* @param {int} [_w2]   右矩阵的列数(宽度)
* @return {Matrix} 返回一个新的矩阵
---

### static transpose(m,_w,_h)   矩阵转置
* @param {Mat} m 矩阵
* @param {int} [_w] 矩阵宽度(列数)
* @param {int} [_h] 矩阵高度(行数)
* @return {m} 修改m并返回
---

### static create_Transposed(m,_n)   创建矩阵的转置
* @param {Mat} m 矩阵
* @param {int} [_n] 矩阵为n阶矩阵
* @return {m} 返回一个新的矩阵
---

### static calc_Det(m,_n)   计算矩阵行列式
* @param {Mat} temp_m 矩阵
* @param {int} [_n] 矩阵为n阶矩阵
* @return {Number} 返回矩阵的行列式
---

### static calc_Det__Transform(m,_n)   计算矩阵行列式 --使用初等变换
* @param {Mat} temp_m 矩阵
* @param {int} [_n] 矩阵为n阶矩阵
* @return {Number} 返回矩阵的行列式
---

### static inverse(m,_n)   变换得到矩阵逆
* @param {Mat} m       矩阵
* @param {int} [_n]    矩阵为n阶矩阵
* @return {Matrix}     修改 m 并返回
---

### static create_Inverse(m,_n)   求矩阵的逆 (创建逆矩阵)
* @param {Mat} m       矩阵
* @param {int} [_n]    矩阵为n阶矩阵
* @return {Matrix}     返回一个新的矩阵
---

<!--  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 分割线 Matrix_2 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  -->

---
## Matrix_2
创建变换用的2d矩阵的静态类 继承于 Matrix


### static create_Rotate(theta)   创建旋转矩阵
* @param {Number} theta 顺时针 旋转角弧度
* @return {Matrix_2}
---

### static create_Rotate__v(_v)   创建旋转矩阵 使用向量
* @param {Vector} _v 2d向量
* @return {Matrix_2}
---

### static create_Scale(x,y)   创建缩放矩阵
* @param {Number} x x 轴方向上的缩放系数
* @param {Number} y y 轴方向上的缩放系数
* @return {Matrix_2}
---

### static create_Horizontal (x,y)   创建镜像矩阵(对称)
* @param {Number} x 对称轴的法向 x 坐标
* @param {Number} y 对称轴的法向 y 坐标
* @return {Matrix_2}
---

### static create_Shear(axis,k)   创建切变矩阵
* @param {Number} axis 方向轴 0:x 非零:y
* @param {Number} k 切变系数
* @return {Matrix_2}
---

### static create_Identity()   创建单位矩阵
* @return {Matrix_2}
---

### static create_ByVector(v2)   创建等比缩放&旋转矩阵 根据向量生成矩阵
* @param {Vec} v2 2d向量
* @return {Matrix_2} 返回一个矩阵
---

<!--  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 分割线 Matrix_3 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  -->

---
## Matrix_3
创建变换用的3d矩阵的静态类 继承于 Matrix
如无另外说明，本库中所有涉及3d的均为左手坐标系
``` javascript
/** 
 *            ^  +y
 *            |     7 +z
 *            |  /  
 * -----------+-----------> +x
 *         /  |   
 *      /     |   
 *            |   
 */
```

### static create_Scale(x,y,z)   创建缩放矩阵
* @param {flot} x x坐标中的缩放系数
* @param {flot} y y坐标中的缩放系数
* @param {flot} z z坐标中的缩放系数
* @returns {Matrix_3} 返回一个矩阵
---

### static create_Rotate(axis,theta)   创建旋转矩阵
* @param {int} axis 旋转中心轴  \[z,y,x\] 默认为 0(z)
* @param {Number} theta 旋转弧度
* @return {Matrix_3} 返回一个矩阵
---

### static create_Rotate__v(_v)   创建旋转矩阵, 使用旋转向量
* @param {Vec} _v  3d向量
* @return {Matrix_3} 返回一个矩阵
---