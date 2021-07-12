import { Point } from "./App";

// 随机数函数
export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

// 给出三角形各点坐标求边长并判断是否能组成三角形
export const isTriangle = (p: Point[]) => {
  const pow1 = Math.pow(p[0].x - p[1].x, 2) + Math.pow(p[0].y - p[1].y, 2);
  const pow2 = Math.pow(p[1].x - p[2].x, 2) + Math.pow(p[1].y - p[2].y, 2);
  const pow3 = Math.pow(p[2].x - p[0].x, 2) + Math.pow(p[2].y - p[0].y, 2);
  const a = Math.sqrt(pow1);
  const b = Math.sqrt(pow2);
  const c = Math.sqrt(pow3);
  return a + b > c && a + c > b && b + c > a;
};

// 给出两三角形各点坐标判断两三角形相对位置
export const judgeTriPos = (ps: Point[]) => {
  const tri1 = ps.slice(0, 3);
  const tri2 = ps.slice(3, 6);

  if (!(isTriangle(tri1) && isTriangle(tri2))) return "数据异常";

  // 三角形A在三角形B内
  const AinB =
    pInTri(tri1[0], tri2) && pInTri(tri1[1], tri2) && pInTri(tri1[2], tri2);

  // 三角形B在三角形A内
  const BinA =
    pInTri(tri2[0], tri1) && pInTri(tri2[1], tri1) && pInTri(tri2[2], tri1);

  if (AinB || BinA) return "包含";

  // 是否有相交直线
  let isX = false;

  // 九次循环依次列举两两线段是否相交
  for (let tag1 of [0, 1, 2]) {
    for (let tag2 of [0, 1, 2]) {
      const _tri1 = tri1.filter((_, i) => i !== tag1);
      const _tri2 = tri2.filter((_, i) => i !== tag2);
      isX = isX || lineIntersect(_tri1[0], _tri1[1], _tri2[0], _tri2[1]);
    }
  }

  if (isX) return "相交";

  return "相离";
};

// 判断线段是否相交
const lineIntersect = (A: Point, B: Point, C: Point, D: Point) => {
  // 判断A, B在CD两侧
  const ab = pointsOnDiffSides(A, B, [C, D]);
  // 判断C, D在AB两侧
  const cd = pointsOnDiffSides(C, D, [A, B]);
  return ab && cd;
};

// 判断两点是否在所给线段两侧
const pointsOnDiffSides = (A: Point, B: Point, ps: Point[]) => {
  // 判断C, D在AB两侧 ABxAC · ABxAD < 0
  // AB (B.x - A.x, B.y - A.y)
  // AC (C.x - A.x, C.y - A.y)
  // AD (D.x - A.x, D.y - A.y)
  // v1(x1, y1) x v2(x2, y2) = x1y2 – y1x2
  const tag1 = (B.x - A.x) * (ps[0].y - A.y) - (B.y - A.y) * (ps[0].x - A.x);
  const tag2 = (B.x - A.x) * (ps[1].y - A.y) - (B.y - A.y) * (ps[1].x - A.x);
  return tag1 * tag2 < 0;
};

// 给出三角形各点坐标判断点是否在三角形内
export const pInTri = (p: Point, ps: Point[]) => {
  /**
   * 可以通过 Barycentric coordinate system （重心坐标）来处理。
   * 设要测试的点为 (x0, y0)，三角形三点分别为 (x1, y1)，(x2, y2)，(x3, y3)
   * 根据重心坐标的定义：
   *
   * x0 = a * x1 + b * x2  + c * x3
   * y0 = a * y1 + b * y2 + c * y3
   * a + b + c = 1
   *
   * 其中 a b c 分别为三个系数。当且仅当 a b c 均大于等于 0 且小于等于 1 时
   * 点 (x0, y0) 在由点 (x1, y1)、点 (x2, y2) 和点 (x3, y3) 构成的三角形内。
   *
   * 由上面的定义可得出 a b c 的解：
   * a = ((y2 - y3)*(x0 - x3) + (x3 - x2)*(y0 - y3)) / ((y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3))
   * b = ((y3 - y1)*(x0 - x3) + (x1 - x3)*(y0 - y3)) / ((y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3))
   * c = 1 - a - b
   */

  const divisor =
    (ps[1].y - ps[2].y) * (ps[0].x - ps[2].x) +
    (ps[2].x - ps[1].x) * (ps[0].y - ps[2].y);
  const a =
    ((ps[1].y - ps[2].y) * (p.x - ps[2].x) +
      (ps[2].x - ps[1].x) * (p.y - ps[2].y)) /
    divisor;
  const b =
    ((ps[2].y - ps[0].y) * (p.x - ps[2].x) +
      (ps[0].x - ps[2].x) * (p.y - ps[2].y)) /
    divisor;
  const c = 1 - a - b;

  // 加上等于号 代表点或边在边上也算包含
  return a >= 0 && a <= 1 && b >= 0 && b <= 1 && c >= 0 && c <= 1;
};
