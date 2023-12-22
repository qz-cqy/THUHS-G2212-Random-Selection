function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return "-1";
}
function choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
let arr = new Array();
let vis = new Array();
let chosen = 0;
function toggle(chosen) {
    vis[chosen] ^= 1;
    load();
}
function load() {
    if(arr.length == 0) {
        let html = "";
        html += `<p>还没有数据。</p>`;
        document.getElementById("show-namelist").innerHTML = html;
    }
    else {
        let html = "";
        let n = arr.length;
        html += `<table id="namelist-table" class="no-border">`;
        for(let i = 0; i < n; i++) {
            if(i % 10 == 0) html += `<tr class="no-border">`;
            html += `<td class="student ${vis[i] ? "unavailable" : "available"}">${arr[i]}</td>`;
            if(i % 10 == 9 || i == n - 1) html += `</tr>`;
        }
        html += `</table>`;
        html += `<p style="font-size: 80%;">提示：单击单元格可以切换单元格状态。</p>`;
        document.getElementById("show-namelist").innerHTML = html;
        let namelist_table = document.getElementById("namelist-table");
        let cells = namelist_table.getElementsByTagName("td");
        for(let i = 0; i < cells.length; i++) {
            cells[i].addEventListener("click", function() {
                toggle(i);
            });
        }
    }
}
function init() {
    let str = document.getElementById("namelist").value;
    arr = str.split(" ");
    vis = new Array(arr.length).fill(0);
    load();
}
function generate() {
    let tmp = new Array();
    for(let i = 0; i < arr.length; i++) {
        if(!vis[i]) {
            tmp.push(i);
        }
    }
    if(tmp.length == 0) {
        let html = "";
        html += `<p style="color: red;">没有可抽取的！</p>`;
        chosen = 0;
        document.getElementById("regenerate").disabled = true;
        document.getElementById("display-area").innerHTML = html;
        document.getElementById("regenerate").disabled = false;
    }
    else {
        let lucky = choice(tmp);
        let html = "";
        html += `幸运的是：<div class="lucky">${arr[lucky]}</div>！`;
        chosen = 0;
        document.getElementById("regenerate").disabled = true;
        let intv = setInterval(function () {
            let lucky_t = choice(tmp);
            let html_t = "";
            html_t += `幸运的是：<div class="lucky">${arr[lucky_t]}</div>！`;
            document.getElementById("display-area").innerHTML = html_t;
        }, 100);
        setTimeout(function () {
            clearInterval(intv);
            chosen = lucky;
            document.getElementById("display-area").innerHTML = html;
            document.getElementById("regenerate").disabled = false;
            let allow_repetition = document.querySelector("input[name=\"allow-repetition\"]:checked").value;
            if(allow_repetition == "false") toggle(chosen);
        }, 2000);
    }
}
let crypto = require("./crypto.js");
function md5(str) {
    return crypto.MD5(str).toString();
}
function aesEncrypt(str, key) {
    var key = crypto.enc.Utf8.parse(key);
    var srcs = crypto.enc.Utf8.parse(str);
    var encrypted = crypto.AES.encrypt(srcs, key, { mode: crypto.mode.ECB, padding: crypto.pad.Pkcs7 });
    return encrypted.toString();
}
function aesDecrypt(str, key) {
    var key = crypto.enc.Utf8.parse(key);
    var decrypt = crypto.AES.decrypt(str, key, { mode: crypto.mode.ECB, padding: crypto.pad.Pkcs7 });
    return crypto.enc.Utf8.stringify(decrypt).toString();
}
function init_G2212() {
    let key = document.getElementById("namelist").value;
    if(md5(key) != "79e3f0902c0cb8f6d4e98dda490cbfee") alert("密码错误！");
    else {
        let str = "U2FsdGVkX1+nimrp3Zvh3T3kj8U6q3wGX1eMjJxJgAcV+WB9lr479vezfP5uewfBlWSMhyWPUXPlVz3m1FmyvydgzdMzqGJcxsGvH4cM4YJ5h1oR0D2vNZWC/+NZ7jU/pEVtFWco1pTS3ZxjnuMCin8/6etZfMevdZbsCn3wcWbzhw6zszsthT/Dw5uNnntayyFJgvis8VWkiTaCZ6aVNR5oKQnsnsYPMMDyP36l+N0Dw8R89g1qEDCQJAmMSSuLsJ0BfRPOUmj4UAxe9rAdaltekJ41DBceMOL3VAO9+6207nGp/0J00HorMhMeib6VgoxZmj8NrpmVS45WzrqSPCO+PePGsw88zh/DjLnMvmnCALrs2JXBbOt7HD1qUDKLUqzF9yLZNXjmVxolOcM7KdilvbtEIxeeMVI41bokl4CUzi8SxCpb4uBI4yD2mKdaN0ji0XLHiAnqLpZ+iKWQe+tmw9AZz7vn0Qj52yBdYXWgmE5JN98Y8/MCVo5FPozS6151vUxwDO/tlVg1msywZ12fzECvmiQwli2RPs6Qm1jD4Hkb7I+6KieYGv/gep5c3+VPC/PgpP+5kjdZs/rbomsYL/YRONjRwR/6hC1kqMI=";
        let namelist = aesDecrypt(str, key);
        arr = namelist.split(" ");
        vis = new Array(arr.length).fill(0);
        load();
    }
}