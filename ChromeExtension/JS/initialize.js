/**
 * 处理初始化 呈现器
 * Created by 步青 on 13-12-29.
 */

// 解析模板
$.render = function (template, data) {
    return template.replace(/\{(\w+)\}/g, function (name, key) {
        return (data && data[key]) ? data[key] : '';
    });
};
/**
 * 初始化项目
 * @param data
 */
function initialize(data) {
    data = data['status'] ? data['data'] : data;
    var nav_item_tpl = $('[type="html/nav_item"]').html();
    var project_tpl = $('[type="html/project"]').html();
    var project_html;
    for (var i in data.project_list) {
        $("#nav").append($.render(nav_item_tpl, data.project_list[i]));
        data.project_list[i]['tasks'] = initialize_task(data.project_list[i]['tasks']);//
        project_html = $.render(project_tpl, data.project_list[i]);
        $("#main").append(project_html);
    }
    //注册监听器
    create_listener();
}
/**
 * 循环的模板化每条任务
 * @param tasks
 * @returns {string}
 */
function initialize_task(tasks) {
    var task_tpl = $('[type="html/task"]').html();
    var tasks_html = '';
    for (var i in tasks) {
        if (tasks[i]['finish_date']) {
            tasks[i]['class'] = 'finish';
        }
        tasks_html = tasks_html + $.render(task_tpl, tasks[i]);
    }
    return tasks_html;
}
