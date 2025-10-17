console.log('1. 开始加载...');

console.log('2. 加载 firebase-functions...');
const functions = require('firebase-functions');
console.log('✅ firebase-functions 加载成功');

console.log('3. 测试内置 fetch...');
// Node.js 18+ 内置 fetch
if (typeof fetch === 'undefined') {
  console.log('❌ 内置 fetch 不可用');
} else {
  console.log('✅ 内置 fetch 可用');
}

console.log('4. 创建简单函数...');
exports.test = functions.https.onCall(async (data, context) => {
  return { message: 'hello' };
});
console.log('✅ 函数定义成功');

console.log('5. 全部完成！');
