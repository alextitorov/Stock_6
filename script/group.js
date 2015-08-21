var bd = openDatabase("Journal", '0.1', 'Journal students', 20000);
if(!bd) {
    alert("Failed to connect to database");
}

function saveGroup() {
    uniqGroup();
}

function uniqGroup(){
    bd.transaction(function(tx){
        tx.executeSql(request.selectData, [], f(retTrue, save));
    });
}

function f(callback, callback2){
    return function (tx, result){
        var number = document.getElementById('numGr').value;
        var count = 0;
        for(var i = 0; i < result.rows.length; i++) {
            if(result.rows.item(i)['number'] == number){
                count++;
                callback();
                break;
            }
        }
        if(count == 0){
            callback2();
        }
    };
}

function retTrue(){
    alert("Есть такая группа");
}

function save(){
    var data = getData();
    bd.transaction(function(tx){
        tx.executeSql(request.createTabGroup);
        tx.executeSql(request.insertGroup, [data.number, data.yearIn, data.yearOut], null, null);
        });
}

function getData(){
    var number,
        yearIn,
        yearOut;
    var result = {
        number: document.getElementById('numGr').value,
        yearIn: +document.getElementById('yIn').value,
        yearOut: +document.getElementById('yOut').value
    };
    return result;
}

function displayGroup(year){
    bd.transaction(function(tx){
        var str = request.selectBetweenYears.replace(/\?/g,   year);//"SELECT * FROM Groups WHERE yearIn <= " + year + " AND yearOut >= " + year
        tx.executeSql(str, [], addGroupAndDisplay(),null);
    });
}

function addGroupAndDisplay() {
    return function (tx, result) {
        var arr = [];
        var mainDiv = document.getElementById('result');
        mainDiv.innerHTML = "";
        for (var i = 0; i < result.rows.length; i++) {
            console.log(result.rows.item(i)['number'], result.rows.item(i)['yearIn'], result.rows.item(i)['yearOut']);

            arr[i] = result.rows.item(i)['number'];

        }
        var res = sortGroup(arr);
        for(i = 0; i < res.length; i++){
            var group = document.createElement('div');
            group.innerHTML = res[i];
            group.className = "group";
            group.id = "gr" + i;
            group.onclick = function () {
                displayStudents(this.textContent)
            };
            mainDiv.appendChild(group);
        }
    }
}

function sortGroup(arr){
    var rg = /(\d*)([A-Za-zА-Яа-я_]*)/i;
    var result = [];
    for(var i = 0; i < arr.length; i++){
        result[i] = rg.exec(arr[i]);
    }
    var arr0 = [];
    for(i = 0; i < result.length; i++){
        if(result[i][2] == "" && result[i].input != ""){
            arr0.push(result[i].input);
            result.splice(i, 1);
            i--;
        }
    }
    arr0.sort(onData);
    arr0.sort(onLength);
    var pgIng = /[A-Za-z]/;
    var arr1 = [];
    for(i = 0; i < result.length; i++){
        if(!isFinite(result[i][2]) && pgIng.test(result[i][2])){
            arr1.push(result[i].input);
            result.splice(i, 1);
            i--;
        }
    }
    arr1.sort(onLength);
    var pgRus = /[А-Яа-я]/;
    var arr2 = [];
    for(i = 0; i < result.length; i++){
        if(!isFinite(result[i][2]) && pgRus.test(result[i][2])){
            arr2.push(result[i].input);
            result.splice(i, 1);
            i--;
        }
    }
    arr2.sort(onLength);
    var res = arr0.concat(arr1, arr2);
    console.log(res);
    return res;
}

function onData(a, b){
    return (a < b) ? -1 : 1;
}

function onLength(a, b){
    if(a.length < b.length){
        return -1;
    }
    if(a.length > b.length){
        return 1;
    }
    return 0;
}

function displayStudents(gr){
    document.location.href = "list/students_List.html?"+gr;
}
function showYear(){
    var ul = document.getElementById('navYear');
    var nowYear = new Date().getFullYear();
    var i = nowYear;
    for(i; i > nowYear - 10 ; i--){
        var li = document.createElement('li');
        var div = document.createElement('div');
        div.innerHTML = i;
        div.onclick = function(){displayGroup(this.textContent)};
        li.appendChild(div);
        ul.appendChild(li);
    }
}

function loadYearNewGroup(){
    var nowYear = new Date().getFullYear();
    var yI = document.getElementById('yIn');
    var yO = document.getElementById('yOut');
    for(var i = nowYear + 2; i < nowYear + 15; i++){
        var optYearOut = document.createElement('option');
        if(i == nowYear + 5){
            optYearOut.selected = true;
        }
        optYearOut.textContent = i;
        yO.appendChild(optYearOut);
    }
    var yearMin = 1980,
        yearMax = nowYear + 20;
    for(i = yearMin; i < yearMax; i++){
        var opt = document.createElement('option');
        if (i == nowYear){
            opt.selected = true;
        }
        opt.textContent = i;
        yI.appendChild(opt);
    }
}

function clickYearIn(year){
    var yO = document.getElementById('yOut');
    yO.innerHTML = "";
    var yearO = +year + 5,
        yearMin = yearO - 3,
        yearMax = yearO + 10;
    for(var i = yearMin; i < yearMax; i++){
        var opt = document.createElement('option');
        if(i == yearO){
            opt.selected = true;
        }
        opt.textContent = i;
        yO.appendChild(opt);
    }
}