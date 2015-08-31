#!/usr/bin/env python
#-*- coding: utf-8 -*-

import tornado.options
import tornado.web


class BaseHandler(tornado.web.RequestHandler):
    user = None

    def db(self):
        """
        获取数据库连接
        """
        return self.application.db

    def get_current_user(self):
        """
        检测是否登陆
        """
        user_id = self.get_argument("user_id")
        email = self.get_argument("email")
        password = self.get_argument("password")
        if not email or not password:
            return None
        self.user = self.db().get("SELECT * FROM `user` WHERE `id` = %s AND `email` = %s AND `password`=%s LIMIT 1",
                                  user_id, email, password)
        return self.user

    def success(self, message=u"Success!"):
        """
        成功操作提示
        """
        self.ajax_return(message, True)

    def error(self, message=u"Error"):
        """
        失败操作提示
        """
        self.ajax_return(message, False)

    def ajax_return(self, message=u"", status=True):
        """
        返回json数据
        """

        if isinstance(message, dict):
            self.write({'status': status, 'data': message})
        else:
            self.write({'status': status, 'data': message})

    def get_task_info(self, task_id, user_id=0):
        """
        获取一个任务的详情，并且检查是否有权限操作此任务
        """
        user_id = user_id or self.user.id
        info = self.db().get("SELECT * FROM `task` WHERE `id`=%s LIMIT 1", task_id)
        rely = self.db().get("SELECT * FROM `project_user` WHERE `user_id` = %s AND `project_id` =%s",
                             user_id, info.project_id)
        if rely:
            return info
        else:
            self.error("无权操作！")
            return None