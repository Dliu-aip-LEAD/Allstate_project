# 数据库集成说明

## 概述

本项目已经集成了Firebase Firestore数据库，用于管理用户的侦探学院进度、任务完成情况、等级系统等数据。

## 数据库结构

### 1. 用户集合 (users)

每个用户文档包含以下主要字段：

```javascript
{
  // 基本信息
  email: string,
  name: string,
  onboardingAnswers: object,
  
  // 侦探学院数据
  detectiveAcademy: {
    level: number,                    // 当前等级 (1-5)
    levelName: string,               // 等级名称
    experience: number,              // 总经验值
    experienceToNextLevel: number,   // 升级所需经验
    totalScore: number,              // 总得分
    currentScore: number,            // 当前等级得分
    missionsCompleted: number,       // 已完成任务数
    totalMissions: number,           // 总任务数
    successRate: number,             // 成功率百分比
    currentMissionId: string,        // 正在进行的任务ID
    currentMissionProgress: number,  // 当前任务进度
    departmentProgress: object       // 各部门进度
  },
  
  // 任务历史
  missionHistory: array,
  
  // 成就系统
  achievements: array
}
```

### 2. 任务集合 (missions)

存储所有可用的任务信息：

```javascript
{
  id: string,
  title: string,
  description: string,
  department: string,
  difficulty: string,
  requiredLevel: number,
  content: object,
  scoring: object,
  unlockRequirements: object
}
```

### 3. 部门集合 (departments)

管理不同的训练部门：

```javascript
{
  id: string,
  name: string,
  description: string,
  icon: string,
  unlockRequirements: object,
  missions: array,
  rewards: object
}
```

## 主要功能

### 1. 用户进度管理

- **等级系统**: 5个等级，从Junior Detective到Expert Detective
- **经验系统**: 完成任务获得经验值，达到阈值自动升级
- **分数系统**: 基于任务表现计算总分
- **部门进度**: 跟踪每个部门的完成情况

### 2. 任务系统

- **任务解锁**: 基于等级和前置任务完成情况
- **进度跟踪**: 实时记录任务完成状态
- **评分系统**: 基于线索发现、测验正确率等计算分数

### 3. 数据同步

- **实时更新**: 使用Firestore实时监听器
- **离线支持**: 本地缓存用户进度
- **数据一致性**: 批量更新确保数据完整性

## 使用方法

### 1. 初始化用户数据

```javascript
import { getUserProgress, initializeUserProgress } from '../utils/userProgress';

// 获取用户进度（如果不存在会自动初始化）
const progress = await getUserProgress(userId);

// 手动初始化用户数据
await initializeUserProgress(userId, userData);
```

### 2. 更新用户进度

```javascript
import { updateUserProgress, addExperience } from '../utils/userProgress';

// 更新特定字段
await updateUserProgress(userId, {
  field: 'currentMissionId',
  value: 'mission-123'
});

// 添加经验值
await addExperience(userId, 50);
```

### 3. 任务完成处理

```javascript
import { updateMissionStats, addMissionToHistory } from '../utils/userProgress';

// 更新任务统计
await updateMissionStats(userId, {
  score: 85,
  accuracy: 90,
  department: 'email-crimes'
});

// 添加到任务历史
await addMissionToHistory(userId, missionData);
```

### 4. 数据迁移

```javascript
import { migrateExistingUsers, fixAllUserData } from '../utils/dataMigration';

// 为现有用户迁移数据
await migrateExistingUsers();

// 修复所有用户数据
await fixAllUserData();
```

## 等级系统

| 等级 | 名称 | 所需经验 | 描述 |
|------|------|----------|------|
| 1 | Junior Detective | 0 | 新手侦探 |
| 2 | Apprentice Detective | 100 | 学徒侦探 |
| 3 | Detective | 250 | 正式侦探 |
| 4 | Senior Detective | 500 | 高级侦探 |
| 5 | Expert Detective | 1000 | 专家侦探 |

## 部门系统

### 解锁条件

1. **Email Crimes Unit**: 默认解锁
2. **Social Media Division**: 需要等级2，完成3个任务
3. **Financial Crimes**: 需要等级3，完成6个任务
4. **Elder Fraud Task Force**: 需要等级4，完成9个任务

### 奖励系统

每个部门提供不同的奖励：
- 经验值倍数
- 特殊能力解锁
- 分数加成

## 数据安全

- 用户只能访问自己的数据
- 使用Firebase安全规则保护数据
- 敏感操作需要用户认证

## 性能优化

- 使用Firestore索引优化查询
- 实现数据分页加载
- 本地缓存减少网络请求

## 错误处理

- 网络错误自动重试
- 数据验证确保完整性
- 用户友好的错误提示

## 测试

运行以下命令测试数据库功能：

```bash
# 检查数据完整性
npm run test:database

# 运行数据迁移
npm run migrate:data
```

## 故障排除

### 常见问题

1. **数据不显示**: 检查用户认证状态和Firestore权限
2. **更新失败**: 验证数据格式和字段名称
3. **性能问题**: 检查查询索引和缓存策略

### 调试工具

- 使用Firebase Console查看数据
- 启用Firestore日志记录
- 使用浏览器开发者工具检查网络请求

## 更新日志

- **v1.0.0**: 初始数据库结构
- **v1.1.0**: 添加等级和经验系统
- **v1.2.0**: 集成任务和部门系统
- **v1.3.0**: 优化性能和错误处理

## 贡献指南

1. 遵循现有的代码结构
2. 添加适当的错误处理
3. 更新相关文档
4. 测试所有新功能

## 联系方式

如有问题或建议，请联系开发团队或提交Issue。 