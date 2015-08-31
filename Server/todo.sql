/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50528
Source Host           : localhost:3306
Source Database       : todo

Target Server Type    : MYSQL
Target Server Version : 50528
File Encoding         : 65001

Date: 2014-01-31 00:37:51
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(10) NOT NULL COMMENT '项目名字',
  `user_id` int(11) NOT NULL COMMENT '项目创建者ID',
  `date` int(11) NOT NULL COMMENT '创建时间',
  `sort` int(255) NOT NULL DEFAULT '0' COMMENT '排序一句',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of project
-- ----------------------------
INSERT INTO `project` VALUES ('1', '工作', '1', '123456789', '0');
INSERT INTO `project` VALUES ('2', '生活', '1', '123456789', '0');
INSERT INTO `project` VALUES ('3', '软背包', '1', '123456789', '0');
INSERT INTO `project` VALUES ('4', '@Todo', '1', '123456789', '0');
INSERT INTO `project` VALUES ('5', 'Smile', '1', '123456789', '0');

-- ----------------------------
-- Table structure for project_user
-- ----------------------------
DROP TABLE IF EXISTS `project_user`;
CREATE TABLE `project_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL COMMENT '项目ID',
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `date` int(11) NOT NULL DEFAULT '0' COMMENT '加入项目的时间',
  `nickname` char(255) DEFAULT NULL COMMENT '在项目中的昵称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of project_user
-- ----------------------------
INSERT INTO `project_user` VALUES ('1', '1', '1', '123456789', '小马');
INSERT INTO `project_user` VALUES ('2', '2', '1', '123456789', '黑猫');
INSERT INTO `project_user` VALUES ('3', '3', '1', '123456789', '小马');
INSERT INTO `project_user` VALUES ('4', '4', '1', '123456789', '小马');
INSERT INTO `project_user` VALUES ('5', '5', '1', '123456789', '小马');

-- ----------------------------
-- Table structure for task
-- ----------------------------
DROP TABLE IF EXISTS `task`;
CREATE TABLE `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` char(100) NOT NULL COMMENT '任务内容',
  `create_date` int(11) NOT NULL DEFAULT '0' COMMENT '添加时间',
  `start_date` int(11) NOT NULL DEFAULT '0' COMMENT '开始时间',
  `finish_date` int(11) NOT NULL DEFAULT '0' COMMENT '完成时间',
  `remove_date` int(11) NOT NULL DEFAULT '0' COMMENT '移除时间',
  `remind_date` int(11) NOT NULL DEFAULT '0' COMMENT '设定的提醒时间',
  `user_id` int(11) NOT NULL COMMENT '创建者ID',
  `at_user_id` int(11) NOT NULL DEFAULT '0' COMMENT '指派的用户ID',
  `project_id` int(11) NOT NULL COMMENT '归属项目ID',
  `sort` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `sort_s` int(11) NOT NULL DEFAULT '0' COMMENT '辅助排序',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of task
-- ----------------------------
INSERT INTO `task` VALUES ('1', '任务1', '123456789', '0', '0', '0', '0', '1', '0', '1', '123456', '123456');
INSERT INTO `task` VALUES ('2', '任务2', '123456789', '0', '1391097100', '1391097100', '0', '1', '0', '1', '123456', '123455');
INSERT INTO `task` VALUES ('3', '任务3', '123456789', '0', '0', '0', '0', '1', '0', '1', '123456', '123456');
INSERT INTO `task` VALUES ('4', '任务4', '123456789', '0', '0', '0', '0', '1', '0', '1', '123456', '123456');
INSERT INTO `task` VALUES ('5', '任务5', '123456789', '0', '0', '0', '0', '1', '0', '2', '123456', '123456');
INSERT INTO `task` VALUES ('6', '任务6', '1391082540', '0', '1391097122', '1391097141', '0', '1', '0', '1', '123456', '123456');
INSERT INTO `task` VALUES ('7', '任务7', '1391096990', '0', '0', '0', '0', '1', '0', '1', '1391096990', '1391096990');
INSERT INTO `task` VALUES ('8', '任务8', '1391097021', '0', '0', '0', '0', '1', '0', '3', '1391097021', '1391097021');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `email` char(32) NOT NULL COMMENT '邮箱',
  `password` char(32) NOT NULL COMMENT '密码',
  `date` int(11) NOT NULL COMMENT '注册时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', '123@123.com', '123', '123456123');
