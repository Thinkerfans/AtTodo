/**
 * 因为是异步处理，所以监听器要在后期加载
 */
function create_listener() {
    //监听事件
    $("body").on('keyup', '.new_task', new_task);
    //项目切换事件
    $("body").on('click', '#nav .nav_item:gt(0)', nav_switch);
    $("body").on('click', '#main .project:gt(0)', nav_switch);
    //双击进入编辑
    $("body").on('dblclick', 'ul li:not(.finish)', task_modify);
    $("body").on('dblclick', 'ul li.finish', unFinish);
    $("body").on('contextmenu', 'ul li.finish', remove);
    $("body").on('contextmenu', 'ul li:not(.edit)', finish);
    $("body").on('keydown', 'ul li.edit', task_modify);
    //排序
    $(".tasks_list").sortable({axis: "y", cancel: "li.edit", update: todoSort});
}

$(document).ready(function () {
    //先初始化项目
    $.post(LoadURL, getParameter(), initialize, 'json');
    //initialize(storage().get('app'));
});