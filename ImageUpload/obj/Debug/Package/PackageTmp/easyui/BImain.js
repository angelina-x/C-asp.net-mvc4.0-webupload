$(function () {
    //MediaInput
    InitGird();

    //MediaSummary
    InitSumCmbList();

    disableRefresh();
});

//init datagrid
function InitGird() {
    $('#tab_list').datagrid({
        title: 'Media Input', //title
        url: location.href,
        sortName: 'JSON_test_time',
        //idField: 'JSON_proj_code', //KEY
        iconCls: ' ',//标题左边的图标icon-reload
        //width: '100%',
        fit: true,
        //height: $(parent.document).find("#mainPanle").height() - 65 > 0 ? $(parent.document).find("#mainPanle").height() - 65 : 1000, // 'auto'高度$(parent.document).find("#mainPanle").height() - 50 > 0 ? $(parent.document).find("#mainPanle").height() - 50 : 500
        nowrap: false,//是否换行，True 就会把数据显示在一行里
        striped: true,//True 奇偶行使用不同背景色
        collapsible: true,//可折叠
        sortOrder: 'desc',
        remoteSort: true,//定义是否从服务器给数据排序
        singleSelect: true,
        toolbar: "#toolbar",
        queryParams: { "action": "query" },
        pagination: true,
        pageNumber: 1,
        pageSize: 20,
        rownumbers: true
    });
}

function InitSumCmbList() {
    if (location.href.indexOf("MediaSummary.aspx") < 0) {
        return;
    }

    var DpCell = $('#JSON_DpCell').combobox({
        valueField: 'JSON_dp_cell_id',
        textField: 'JSON_dp_cell_name',
        editable: true
    });
    $.ajax({
        type: 'Post',
        url: location.href + "?action=GetDpCell",
        data: null,
        dataType: 'json',
        success: function (respon) {
            DpCell.combobox("clear").combobox('loadData', respon);
        },
        error: function () {
            alert("Initialize dp cell error!");
        }
    });

    //Get tester list
    var Tester = $('#JSON_Tester').combobox({
        valueField: 'JSON_tester_id',
        textField: 'JSON_tester_name',
        editable: true
    });

    $('#JSON_DpCell').combobox({
        onChange: function (NewValue, OldValue) {
            $.ajax({
                type: 'Post',
                url: location.href + "?action=GetTester&param=" + NewValue,
                data: null,
                dataType: 'json',
                success: function (respon) {
                    Tester.combobox("clear").combobox('loadData', respon);
                },
                error: function () {
                    alert("Initialize tester error!");
                }
            });
        }
    });

    //Get project list
    var Project = $('#JSON_Project').combobox({
        valueField: 'JSON_project_id',
        textField: 'JSON_project_name',
        editable: true
    });
    $('#JSON_Tester').combobox({
        onChange: function (NewValue, OldValue) {
            $.ajax({
                type: 'Post',
                //url: "/Ajax/HandlerMediaSummary.ashx?action=GetProject",
                url: location.href + "?action=GetProject&param=" + NewValue,
                data: null,
                dataType: 'json',
                success: function (respon) {
                    Project.combobox("clear").combobox('loadData', respon);
                },
                error: function () {
                    alert("Initialize project error!");
                }
            });
        }
    });

    //Get marking list
    var Marking = $('#JSON_Marking').combobox({
        valueField: 'JSON_marking_id',
        textField: 'JSON_marking_name',
        editable: true
    });
    $.ajax({
        type: 'Post',
        url: location.href + "?action=GetMarking",
        data: null,
        dataType: 'json',
        success: function (respon) {
            Marking.combobox("clear").combobox('loadData', respon);
        },
        error: function () {
            alert("Initialize marking error!");
        }
    });

    var UpDn = $('#JSON_UpDn').combobox({
        valueField: 'JSON_up_dn_id',
        textField: 'JSON_up_dn_name',
        editable: true
    });
    $.ajax({
        type: 'Post',
        url: location.href + "?action=GetUpDn",
        data: null,
        dataType: 'json',
        success: function (respon) {
            UpDn.combobox("clear").combobox('loadData', respon);
        },
        error: function () {
            alert("Initialize Up Dn error!");
        }
    });
}

//Export Summary Report
function ExportSumReport(obj) {
    var btnId = '#' + $(obj).attr('id');
    $(btnId).css("color", "#CCC");
    $(btnId).linkbutton('disable');
    setTimeout('$("' + btnId + '").linkbutton("enable");$("' + btnId + '").css("color","black");', 5000);

    $.messager.show({
        title: 'My Title',
        msg: 'Please wait..... Message will  be closed (after 4 seconds)',
        timeout: 4000,
        showType: 'slide'
    });

    var DpCell = $('#JSON_DpCell').combobox('getText').split(',');
    var Project = $('#JSON_Project').combobox('getText').split(',');
    var Tester = $('#JSON_Tester').combobox('getText').split(',');
    var Marking = $('#JSON_Marking').combobox('getText').split(',');
    var UpDn = $('#JSON_UpDn').combobox('getText').split(',');
    var StartTime = $('#StartTime').datebox('getValue');
    var EndTime = $('#EndTime').datebox('getValue');

    var ExportType = "";
    if ($(obj).attr('id') != "btnExport") {
        ExportType = '2';
    }
    DownLoadFile({
        url: location.href + "?action=Click",
        data: { DpCell: DpCell, Project: Project, Tester: Tester, Marking: Marking, UpDn: UpDn, StartTime: StartTime, EndTime: EndTime, ExportType: ExportType }
    });
}

//Add
function newDiscs(URL) {
    $('#dlg').dialog('open').dialog('center').dialog('setTitle', 'Media Input');
    $('#fm').form('clear');
    $("#dlg-buttons a:first").attr("onclick", "Add(); return false;");

    //Get DP Cell
    $.ajax
        ({
            type: 'Post',
            url: URL + '?action=GetDpCell',
            data: null,
            dataType: 'text',
            success: function (data) {
                $("#JSON_dp_cell").textbox("setValue", data);
            },
            error: function () {
                alert("Get Dp Cell Error!");
            }
        });

    //Get Tester
    var Tester = $('#JSON_tester').combobox({
        valueField: 'JSON_tester_id',
        textField: 'JSON_tester_name',
        editable: false
    });

    $('#JSON_dp_cell').textbox({
        onChange: function (value) {
            //console.log('The value has been changed to ' + value);

            $.ajax
                ({
                    url: URL + '?action=GetTesterList&param=' + value,
                    type: 'Post',
                    data: null,
                    dataType: 'json',
                    success: function (data) {
                        Tester.combobox("clear").combobox('loadData', data);
                    },
                    error: function () {
                        alert("Get Tester Error!");
                    }
                });
        }
    });

    //Get Project List
    var NewTester = "";
    var NewProject = "";
    var Project = $('#JSON_proj_code').combobox({
        valueField: 'JSON_proj_code_id',
        textField: 'JSON_proj_code_name',
        editable: false
    });

    $('#JSON_tester').combobox({
        onChange: function (NewValue, OldValue) {
            NewTester = NewValue;
            $.ajax
                ({
                    type: 'Post',
                    url: URL + '?action=GetProject&param=' + NewValue,
                    data: null,
                    dataType: 'json',
                    success: function (data) {
                        Project.combobox("clear").combobox('loadData', data);
                    },
                    error: function () {
                        alert("Get Project Error!");
                    }
                });

            //Set Default Project
            $.ajax
                ({
                    type: 'Post',
                    url: URL + '?action=SetDefaultProject&param=' + NewTester,
                    data: null,
                    dataType: 'text',
                    success: function (data) {
                        Project.combobox('setValue', data);
                        NewProject = data;
                    },
                    error: function () {
                        alert("Set default project error!");
                    }
                });

            //Get last Operator ID
            $.ajax({
                url: URL + '?action=GetOperatorID&param=' + NewTester,
                type: 'Post',
                dataType: 'text',
                data: null,
                success: function (data) {
                    $('#JSON_operator').textbox("setValue", data);
                },
                error: function () {
                    alert("Get Operator Error!");
                }
            });

            //Show specific tester
            var queryParams = $('#tab_list').datagrid('options').queryParams;
            queryParams.Tester = NewTester;
            $('#tab_list').datagrid('options').queryParams = queryParams;
            $('#tab_list').datagrid('loadData', { total: 0, rows: [] });
            $('#tab_list').datagrid('reload');
        }
    });

    //Get Default UP/DN
    var UpDn = $('#JSON_up_dn').combobox({
        valueField: 'JSON_up_dn_id',
        textField: 'JSON_up_dn_name',
        editable: false
    });
    $('#JSON_proj_code').combobox({
        onChange: function (NewValue, OldValue) {
            $.ajax
                ({
                    type: 'Post',
                    url: URL + '?action=GetDefaultUpDn&param1=' + NewValue + '&param2=' + NewTester,
                    data: null,
                    dataType: 'text',
                    success: function (data) {
                        UpDn.combobox('setValue', data);
                    },
                    error: function () {
                        alert("Get default up_dn Error!");
                    }
                });
        }
    });

    //Set Dafault Value
    $('#JSON_marking').combobox('setValue', 'N');

    //Get DefectCode
    var DefectName = $('#JSON_defect_code').combobox({
        valueField: 'JSON_defect_code_id',
        textField: 'JSON_defect_code_name',
        editable: false
    });

    $.ajax({
        type: 'Post',
        url: URL + '?action=GetDefectCode',
        data: null,
        dataType: 'json',
        success: function (data) {
            DefectName.combobox('clear').combobox('loadData', data);
        },
        error: function () {
            alert('Get DefectCode Error!');
        }
    });

    $('#JSON_defect_code').combobox({
        onChange: function (value) {
            //$('#JSON_media_pcs').combobox({ disabled: false });
            $('#JSON_media_pcs').combobox('clear').combobox('setValue', '0.5');

            //Defect code="E",disabled=true
            if (value.substr(0, 1) === "E") {
                $('#JSON_id').combobox({ disabled: true });
                $('#JSON_md').combobox({ disabled: true });
                $('#JSON_od').combobox({ disabled: true });
            }
            else if (value.substr(0, 1) === "R" || value.substr(0, 1) === "S" || value.substr(0, 1) === "T") {
                $('#JSON_media_sdpt').textbox('setValue', '0');
                $('#JSON_id').combobox({ disabled: false });
                $('#JSON_md').combobox({ disabled: false });
                $('#JSON_od').combobox({ disabled: false });
            }
            else {
                $('#JSON_id').combobox({ disabled: false });
                $('#JSON_md').combobox({ disabled: false });
                $('#JSON_od').combobox({ disabled: false });
            };
        }
    });
}

function ExportCSVData() {
    var StartTime = $("#StartTime").datebox("getValue");
    var EndTime = $("#EndTime").datebox("getValue");
    var Project = $("#SearchProject").textbox("getValue");
    var Tester = $("#SearchTester").textbox("getValue");

    var URL = location.href.substr(location.href.length - 1, 1).indexOf('#') > -1 ? location.href.substr(0, location.href.length - 1) : location.href;
    DownLoadFile({
        url: URL, //请求的url
        data: {
            StartTime: StartTime, EndTime: EndTime, Project: Project, Tester: Tester, action: 'export'
        }//要发送的数据
    });
}

var DownLoadFile = function (options) {
    var config = $.extend(true, { method: 'post' }, options);
    //var $iframe = $('<iframe id="down-file-iframe" />');
    //target="down-file-iframe"
    var $form = $('<form method="' + config.method + '" />');
    $form.attr('action', config.url);
    for (var key in config.data) {
        $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
    }
    //$iframe.append($form);
    $(document.body).append($form);
    $form[0].submit();
    $form.remove();
};

function TrimStr(str) { return str.replace(/(^\s*)|(\s*$)/g, ""); }

function replaceAll(str, str1, str2) {
    return str.replace(new RegExp(str1, "gm"), str2);
}

function disableRefresh() {
    $(document).bind("keydown", function (e) {
        e = window.event || e;
        if (e.keyCode === 116) {
            e.keyCode = 0;
            return false;
        }
    });
}

function GetInputData(id, cmd) {
    var postdata = "{ \"action\":\"" + cmd + "\",";
    $("#" + id + " input[type!='checkbox']").each(function () {
        postdata += "\"" + $(this).attr("name") + "\":\"" + $(this).val() + "\",";
    });
    //$("#" + id + " input[type='checkbox']").each(function () {
    //    postdata += "\"" + $(this).attr("name") + "\":\"" + this.checked + "\",";
    //});
    postdata = postdata.substr(0, postdata.length - 1);
    postdata += "}";
    return eval("(" + postdata + ")");
}

//提交按钮事件
function Add() {
    var Dp_Cell = $('#JSON_dp_cell').textbox('getValue');
    if (Dp_Cell === null || Dp_Cell.val === "") {
        $.messager.alert('Reminder', 'Please input DP CELL', 'warning');
        return;
    }

    var Tester = $('#JSON_tester').combobox('getValue');
    if (Tester === null || Tester === "") {
        $.messager.alert('Reminder', 'Please select Tester', 'warning');
        return;
    }

    var Project = $('#JSON_proj_code').combobox('getValue');
    if (Project === null || Project === "") {
        $.messager.alert('Reminder', 'Please select Proj_code', 'warning');
        return;
    }

    var Operator = $('#JSON_operator').textbox('getValue');
    if (Operator === null || Operator === "") {
        $.messager.alert('Reminder', 'Please input Operator', 'warning');
        return;
    }

    var UP_DN = $('#JSON_up_dn').combobox('getValue');
    if (UP_DN === null || UP_DN === "") {
        $.messager.alert('Reminder', 'Please select UP/DN', 'warning');
        return;
    }

    var DefectCode = $('#JSON_defect_code').combobox('getValue');
    if (DefectCode === null || DefectCode === "") {
        $.messager.alert('Reminder', 'Please select DefectCode', 'warning');
        return;
    }

    var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/

    var Media_SDPT = $('#JSON_media_sdpt').textbox('getValue');
    if (Media_SDPT === null || Media_SDPT === "") {
        $.messager.alert('Reminder', 'Please input Media SDPT', 'warning');
        return;
    }

    if (Media_SDPT !== null && Media_SDPT !== "") {
        if (!re.test(Media_SDPT)) {
            alert("Media_SDPT 请输入数字!");
            $('#JSON_media_sdpt').textbox('clear');
            return;
        }
    }

    var Test_Time = $('#JSON_test_time').datebox('getValue');
    if (Test_Time === null || Test_Time === "") {
        $.messager.alert('Reminder', 'Please input Test_Time', 'warning');
        return;
    }

    if (!$("#fm").form("validate")) {
        return;
    }

    var json = GetInputData('dlg', 'submit');

    //json.id = uid;
    $.post(location.href, json, function (data) {
        if (data.indexOf("Success") > 0) {
            $.messager.alert('Reminder', 'Add Success!', 'info');
            //console.info(data);
            var queryParams = $('#tab_list').datagrid('options').queryParams;
            var Tester = data.split(',')
            queryParams.Tester = Tester[1];
            $('#tab_list').datagrid('options').queryParams = queryParams;
            $('#tab_list').datagrid('loadData', { total: 0, rows: [] });
            $('#tab_list').datagrid('reload');
            $("#JSON_sdpt").textbox('clear');
            $("#JSON_media_sdpt").textbox('clear');
            //$("#JSON_media_sn").textbox('clear');
            //$("#JSON_media_type").textbox('clear');
            //$("#dlg").dialog("close");
        }
        else {
            $.messager.alert('Reminder', data, 'info');
        }
    });
}

function checkRate(input, type) {
    var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/

    if (!re.test(input)) {
        alert(type + "请输入数字");
        $('#JSON_sdpt').textbox('clear');
        $("#JSON_media_sdpt").textbox('clear');
        return false;
    }
}

//打开添加窗口
function OpenWin() {
    $("#edit").dialog("open");
    $("#edit-buttons a:first").attr("onclick", "Add(0); return false;");
}

function DelData() {
    var row = $('#tab_list').datagrid('getSelected');
    if (row) {
        $.messager.confirm('Confirm', 'Are you sure to delete this record?', function (Confirm) {
            if (Confirm) {
                $.post(location.href, {
                    "action": "delete", "JSON_proj_code": row.JSON_proj_code, "JSON_tester": row.JSON_tester, "JSON_marking": row.JSON_marking, "JSON_up_dn": row.JSON_up_dn, "JSON_test_time": row.JSON_test_time
                }, function (result) {
                    $.messager.alert('Reminder', result, 'info', function () {
                        if (result.indexOf("Success") > 0) {
                            $('#tab_list').datagrid('reload');    // reload the user data
                        } else {
                            $.messager.alert('Reminder', result);
                        }
                    });
                });
            }
        });
    } else {
        $.messager.alert('Reminder', 'Please select a row !');
    }
}

//获取参数
function getQueryParams(queryParams) {
    var StartTime = $("#StartTime").datebox("getValue");
    var EndTime = $("#EndTime").datebox("getValue");
    var Project = $("#SearchProject").textbox("getValue");
    var DpCell = $("#SearchDpcell").textbox("getValue");
    var Tester = $("#SearchTester").textbox("getValue");
    queryParams.StartTime = StartTime;
    queryParams.EndTime = EndTime;
    queryParams.Project = Project;
    queryParams.DpCell = DpCell;
    queryParams.Tester = Tester;
    return queryParams;
}

//增加查询参数，重新加载表格
function reloadgrid(id) {
    //查询参数直接添加在queryParams中
    var queryParams = $('#' + id).datagrid('options').queryParams;
    getQueryParams(queryParams);
    $('#' + id).datagrid('options').queryParams = queryParams;
    $('#' + id).datagrid('loadData', { total: 0, rows: [] });
    $('#' + id).datagrid('reload');
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData)
        : JSONData;
    var index;
    var CSV = '';
    //Set Report title in first row or line

    //CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (index in arrData[0]) {
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV === "") {
        alert("Invalid data");
        return;
    }

    //var exportContent = "\uFEFF";
    //var blob = new Blob([exportContent + CSV], { type: "text/plain;charset=utf-8" });
    var fileName = ReportTitle + "_Export.csv";
    //saveAs(blob, fileName);
    //TableExportToCSV(CSV, fileName)
    $('<a></a>')
        .attr('id', 'downloadFile')
        .attr('href', 'data:text/csv;charset=utf8,' + encodeURIComponent(CSV))
        .attr('download', 'filename.csv')
        .appendTo('body');

    $('#downloadFile').ready(function () {
        $('#downloadFile').get(0).click();
    });
}

function TableExportToCSV(CSVData, CSVFileName) {
    HtmlTableText = CSVData;
    try {
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var file = fso.CreateTextFile(CSVFileName, true);
        file.WriteLine(HtmlTableText);
        file.close();
        alert("Export is done! \r\nCSV File Path:" + CSVFileName);
    }
    catch (e) {
        alert("Export is failed! \r\n" + e.name + "->" + e.description + "!");
    }
}

function cookie(name) {
    var cookieArray = document.cookie.split("; ");
    var cookie = new Object();
    for (var i = 0; i < cookieArray.length; i++) {
        var arr = cookieArray[i].split("=");
        if (arr[0] === name) return unescape(arr[1]);
    }
}

function delCookie(name) {
    document.cookie = name + "=;expires=" + (new Date(0)).toGMTString();
}

function getCookie(objName) {
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] === objName) return unescape(temp[1]);
    }
    return "";
}

function addCookie(objName, objValue, objHours) {
    var str = objName + "=" + escape(objValue);
    if (objHours > 0) {
        var date = new Date();
        var ms = objHours * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
    }
    document.cookie = str;
}

function SetCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr !== null) return unescape(arr[2]); return null;
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval !== null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}