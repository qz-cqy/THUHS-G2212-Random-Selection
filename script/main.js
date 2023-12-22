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
    let key = document.getElementById("namelist").value;
    if(md5(key) != "f5c0f1a9f706b4f97a6cefa6f1c8ada6") alert("密码错误！");
    else {
        let str = "U2FsdGVkX1/C3/YuDGCyd2cUmCdKEra1Cc1x/RXXXl4yM9JR1jVZP5Jm9RMJldlqvUN3NOXKIQCIscO3sLmioXIzybvooBow7BdsBvMwp4R4cUtr58J+FJMHWfNiXTh1ln80iJ9H7UqEM3oBah9dhW5ZuJ9vxYlY7wGIv7AhrdlTiLe9SWNL6WwHR59jtrFlaFNTf01Ig1VqTFdyD1G02VVeJV3URLEt0olcTCmZjVQiB6Gd1xnw6MQ5L7Ta+dPziidXNVRV45s3a7/axIgbgu8eG4as0Nmm/yiBIXrH580dTvZN2seZREdemFCyI95lXOiezQlyE8xobya75ZIquFlm+Bz9HiBI2v2g9iN1UsyMNfOugZw8jdXhRPj+pv2r844rpjVAhjrkSANmkN+7trDa8LajKCcfWttaVFcl/qU/cH8ZO12StpxomclZq/GYjSycGb9kuYmfkOT5UDXmb1I5BQWEjQ2VYN/Sdc/Wc1H08u50kQhlVTPIy1mk4r+ciL4537YnLPjsnrPeTuxErTuhi75d8hRMSfHUhDExYshmBXxBPCESXJL0aVegMm85vX2G2DKFpLb7j3Cx7PBwhFUVbmRml3kALMJR4GY0Zm4=";
        let namelist = aesDecrypt(str, key, CryptoJS.enc.Utf8.parse("qwq"));
        arr = namelist.split(" ");
        vis = new Array(arr.length).fill(0);
        load();
    }
}