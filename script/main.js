$(window).bind('beforeunload', function(){
    return '您可能有数据没有保存';
});
function getQueryletiable(letiable) {
    let query = window.location.search.substring(1);
    let lets = query.split("&");
    for (let i = 0; i < lets.length; i++) {
        let pair = lets[i].split("=");
        if (pair[0] == letiable) { return pair[1]; }
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
function clear() {
    for(let i = 0; i < arr.length; i++) if(vis[i]) toggle(i);
}
function load() {
    if(arr.length == 0) {
        let html = "";
        html += `<p>还没有数据。</p>`;
        document.getElementById("show-namelist").innerHTML = html;
    }
    else {
        let html = "";
        html += `<table id="namelist-table" class="no-border">`;
        for(let i = 0; i < arr.length; i++) {
            if(i % 10 == 0) html += `<tr class="no-border">`;
            html += `<td class="student ${vis[i] ? "unavailable" : "available"}">${arr[i]}</td>`;
            if(i % 10 == 9 || i == arr.length - 1) html += `</tr>`;
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
    for(let i = 0; i < arr.length; i++) if(!vis[i]) tmp.push(i);
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
        }, 50);
        setTimeout(function () {
            clearInterval(intv);
            chosen = lucky;
            document.getElementById("display-area").innerHTML = html;
            document.getElementById("regenerate").disabled = false;
            let allow_repetition = document.querySelector("input[name=\"allow-repetition\"]").checked;
            if(allow_repetition == false) toggle(chosen);
        }, 1000);
    }
}
function md5(str) {
    return CryptoJS.MD5(str).toString();
}
function aesEncrypt(str, key, iv) {
    let srcs = CryptoJS.enc.Utf8.parse(str);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString().toUpperCase();
}
function aesDecrypt(str, key, iv) {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(str);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}
function init_G2212() {
    let key = document.getElementById("password").value;
    if(md5(key) != "f5c0f1a9f706b4f97a6cefa6f1c8ada6") alert("密码错误！");
    else {
        let str = "E229C0DC194D9975423CD0937FDF969BE54063FEF04804E7A8392123B341AA4B84B558A92FE71E39931D72CE75D812A89AA7543D197700BFF9393B1839AA8661CAFB9D598FA229C5A15A249A9877C81E41722963D564DAE512430574047A7E67184858BB6468DD1DC2164AC17B768D7A0863800A4890DD498CE654D582CDA9585B93245BE684B5842B51B8553B39777668F060F8869EC82864570C01C6974D2043E5BE7ED7BBFE9E64A629BA1FDE149C6F68A6C9700DA0B309749945476B08CF1675B7E7C2934E8D5AC8DB7B251B094B4360B21B1EBF8D4B60B654DA349F3C8DA2CDD8F9984E976753010C8755D77757705F03AB9FEF8BE67FCF9712D6B5B3F0D271917F4FE40D42FC253F774D720EE752FED06EB3926274FCEFAAD84951E99FA30CD9F8F9A45FE14CA62BE1E9286E638B600B952243350A8FC19222B131502EAEBF5529504E4A0DD0865BBE3A08D3D5F83D62484C78BE31BFD64F1FC6535CBDA053E1AF334E2BD566240B1E9951565157E3E097F18B8875BBD8B67B13C7817F0C1F8AE9FB213DD5E41862DA731BB99D68CFAE2715759080F5B391F01251B43CBC922D8FB9C45FDAB597796532D9B90793A34BA6B20A8CBEB32D2A159857E8CA";
        let namelist = aesDecrypt(str, CryptoJS.enc.Utf8.parse(key), CryptoJS.enc.Utf8.parse("qwq"));
        arr = namelist.split(" ");
        vis = new Array(arr.length).fill(0);
        load();
    }
}