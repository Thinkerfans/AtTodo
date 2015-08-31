#!/usr/bin/env python
#-*- coding: utf-8 -*-
import hashlib

import time
import tornado.options
import tornado.web
import re
from baseHandler import BaseHandler


class HomeHandler(BaseHandler):
    def get(self):
        self.write("ok")


class LoginHandler(BaseHandler):
    """
    登陆
    """

    @staticmethod
    def check_email(email):
        """
        检查Email格式
        """
        re_pattern = re.compile(r'^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$')
        check_result = re_pattern.search(email)
        if check_result:
            if len(email) >= 60:
                return False
        else:
            return False
        return True

    @staticmethod
    def md5(string):
        """
        MD5一个字符串
        """
        h = hashlib.md5()
        h.update(string)
        return h.hexdigest()

    def get(self):
        self.write("欢迎来到登陆！")

    def post(self):
        """
        登陆或者注册
        """
        email = self.get_argument('email', None)
        if self.check_email(email):
            self.error("格式错误!")
            return
        psw = self.get_argument('psw', None)
        user_name = self.get_argument('username', None)

        user = self.db().get("SELECT * FROM `user` WHERE `email` = %s AND `psw` = %s LIMIT 1", email, self.md5(psw))
        if user:
            self.success(user)
        else:
        # 如果不能正常登陆
            user = self.db().get("SELECT * FROM `user` WHERE `email` = %s LIMIT 1", email)
            if user:
                self.error("密码错误!")
                return
                # 通过邮箱无法查找用户说明尚未注册
            if not user_name:
                self.error("您还没有注册！")
                return
                # 处理无昵称的时候
            if not user_name:
                email_name = email.split("@")
                user_name = email_name[0]
            ssid = self.md5(psw + str(time.time()))
            r = self.db().execute("INSERT INTO `user` (`email`,`psw`,`username`,`ssid`) VALUES (%s,%s,%s,%s)",
                                  email, self.md5(psw), user_name[0:10], ssid)
            if r:
                self.success({"id": r, "username": user_name, "ssid": ssid, "email": email})
            else:
                self.error("注册失败！")


class LogoutHandler(BaseHandler):
    """
    退出
    """

    def get(self):
        self.success("已经退出！")


class RePswHandler(BaseHandler):
    """
    修改密码
    """

    def post(self):
        pass


class LoadHandler(BaseHandler):
    """
    初始化数据
    """

    @tornado.web.authenticated
    def post(self):
        tasks = {"project_list": []}
        projects = self.db().query("SELECT * FROM `project_user` WHERE user_id = %s ",
                                   self.user.id)

        for i in projects:
            i = dict(self.db().get("SELECT * FROM `project` WHERE `id` = %s ORDER BY `sort`", i['project_id']), **i)
            i['tasks'] = self.db().query(
                "SELECT * FROM `task` WHERE `project_id` = %s AND `remove_date` = 0 ORDER BY `sort` DESC,`sort_s` DESC",
                i['project_id'])
            tasks["project_list"].append(i)
        self.success(tasks)


class AddHandler(BaseHandler):
    """
    添加todo
    """

    @tornado.web.authenticated
    def post(self):
        content = self.get_argument('content', None)
        project_id = self.get_argument('project_id', 0)
        #        处理内容
        if content:
            content = content.strip()
            #        暂时不处理提醒时间
        r = self.db().execute("INSERT INTO task (user_id,content,project_id,create_date,sort,sort_s) VALUES "
                              "(%s,%s,%s,%s,%s,%s)",
                              self.user.id, content, project_id, int(time.time()), int(time.time()), int(time.time()))
        if not r:
            self.error("添加数据失败！")
            return
            #        成功就返回id信息
        self.success(r)


class ModifyHandler(BaseHandler):
    """
    修改todo内容
    """

    @tornado.web.authenticated
    def post(self):
        content = self.get_argument('content', None)
        task_id = self.get_argument('task_id', None)

        info = self.get_task_info(task_id)
        if not info:
            self.error("已经没有了！")
            return
        if len(content) > 100:
            pass

        r = self.db().execute("UPDATE `task` SET `content`=%s WHERE id=%s",
                              content, task_id)
        if r is False:
            self.error("编辑失败！")
            return
        self.success("编辑成功！")


class FinishHandler(BaseHandler):
    """
    完成
    """

    @tornado.web.authenticated
    def post(self):
        task_id = self.get_argument('task_id', None)
        info = self.get_task_info(task_id)
        if not info:
            self.error("已经没有了！")
            return

        if info.finish_date:
            self.success("已经完成")
            return
        r = self.db().execute("UPDATE `task` SET finish_date=%s WHERE id=%s",
                              int(time.time()), task_id)
        if r is False:
            self.error("操作失败！")
        else:
            self.success("操作完成！")


class UnFinishHandler(BaseHandler):
    """
    解除完成状态
    """

    @tornado.web.authenticated
    def post(self):
        task_id = self.get_argument('task_id', None)
        info = self.get_task_info(task_id)
        if not info:
            self.error("已经没有了！")
            return

        if not info.finish_date:
            self.success("已经完成")
            return
        r = self.db().execute("UPDATE `task` SET finish_date=%s WHERE id=%s", 0, task_id)
        if r is False:
            self.error("操作失败！")
        else:
            self.success("操作完成！")


class RemoveHandler(BaseHandler):
    """
    移除
    """

    @tornado.web.authenticated
    def post(self):
        task_id = self.get_argument('task_id', None)
        info = self.get_task_info(task_id)
        if not info:
            self.error("已经没有了！")
            return
        if info.remove_date:
            self.success("已经移除了！")
            return
            #        处理finish动作失败时的remove动作
        if info.finish_date:
            r = self.db().execute("UPDATE `task` SET remove_date=%s WHERE id=%s",
                                  int(time.time()), task_id)
        else:
            r = self.db().execute("UPDATE `task` SET remove_date=%s finish_date = %s WHERE id=%s",
                                  int(time.time()), int(time.time()), task_id)
        if r is False:
            self.error("移除失败！")
        else:
            self.success("已移除！")


class TenMHandler(BaseHandler):
    """
    每10分钟检测下数据和提醒
    """

    @tornado.web.authenticated
    def post(self):
        timeS = int(time.time())
        count = self.db().get("SELECT COUNT(id) AS count FROM todo WHERE user_id "
                              "= %s AND finish < 1 AND remove < 1", self.user.id)
        list = self.db().query("SELECT * FROM todo WHERE user_id = %s AND "
                               "remind>%s AND remind<%s AND remove < 1",
                               self.user.id, timeS, (timeS + 600))

        self.success({"count": count.count, "remind": list})


class CountHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        count = self.db().get("SELECT COUNT(id) AS count FROM todo WHERE user_id "
                              "= %s AND finish < 1 AND remove < 1", self.user.id)
        self.success({"count": count.count})


class SortHandler(BaseHandler):
    """
    排序
    """

    @tornado.web.authenticated
    def post(self):
        task_id = self.get_argument("task_id", 0)
        drop_sort = self.get_argument("drop_sort", 0)
        drop_sort_s = self.get_argument("drop_sort_s", False)
        # todo user没有自动添加上去
        info = self.get_task_info(task_id)
        if not info:
            self.error(u"已经没有了！")
            return

        if drop_sort_s is False or drop_sort_s == "false":
            sql = "UPDATE task SET sort=%s WHERE id=%s"
            r = self.db().execute(sql, drop_sort, task_id)
        else:
            sql = "UPDATE task SET sort=%s ,sort_s=%s WHERE id=%s"
            r = self.db().execute(sql, drop_sort, drop_sort_s, task_id)

        if r is False:
            self.error(u"排序失败！")
        else:
            self.success(u"成功！")


class MsgHandler(BaseHandler):
    """
    服务器给客户端发送消息
    """

    def post(self):
        user = self.get_current_user()
        if user:
            self.success(user.username + u"欢迎回来！")
        else:
            self.success(u"为毛不登陆？")