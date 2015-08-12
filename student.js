/**
 * Created by Alex on 10.08.2015.
 */
var bd = openDatabase("Journal", '0.1', 'Journal students', 20000);
if(!bd) {
    alert("Failed to connect to database");
}

var group, yearIn, yearOut;
group = decodeURIComponent(location.search.substring(1));

function addStudent(text){
    document.location.href = 'new_Student.html?'+text;
}
function showYear(yI, yO){
    var ul = document.getElementById('navYear');
    for(var i = yI; i <= yO; i++){
        var li = document.createElement('li');
        var div = document.createElement('div');
        div.innerHTML = i;
        div.onclick = function(){displayStudents(this.textContent)};
        li.appendChild(div);
        ul.appendChild(li);
    }
}
function getYear(){
    bd.transaction(function(tx){
       tx.executeSql("SELECT*FROM Groups WHERE number LIKE" + "\'" + group + "\'", [], function(tx, result){
           //console.log(result.rows.item(0)['yearIn']);
           showYear(result.rows.item(0)['yearIn'], result.rows.item(0)['yearOut']);
           displayStudents(result.rows.item(0)['yearIn']);
       });
    });
}
function displayStudents(year){
    bd.transaction(function(tx){
        tx.executeSql("SELECT * FROM Students WHERE num LIKE " + "\'" + group + "\'" + " AND yI <= " + year +
                        " AND yO >= " + year, [], function(tx, result){
            var mainDiv = document.getElementById('result');
            mainDiv.innerHTML = "";
            for(var i = 0; i < result.rows.length; i++) {
                //console.log(result.rows.item(i)['number'], result.rows.item(i)['yearIn']);
                var student = document.createElement('div');
                student.innerHTML = result.rows.item(i)['surname'] + " " + result.rows.item(i)['name'] + " " + result.rows.item(i)['secondname'];
                student.className = "group";
                student.id = "st"+i;
                student.onclick = function(){ changeStudent(this.textContent) };
                mainDiv.appendChild(student);
            }},null);
    });
}
function changeStudent(text){
    addStudent(text);
}
function d(){
    bd.transaction(function(tx){
       tx.executeSql("DROP TABLE Students");
    });
}
function deleteRow(){
    bd.transaction(function(tx){
        tx.executeSql("DELETE FROM Students WHERE surname LIKE \'Ремонтоса\'");
    });
}