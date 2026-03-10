const tasks = [

{id:1,title:"Rose Giveaway",description:"Give a rose to 6 random people.",hash:"a7f2"},
{id:2,title:"Sandcastle Builder",description:"Build a sandcastle on the beach.",hash:"c91b"},
{id:3,title:"Pink Spotter",description:"Find a person dressed in pink and take photo proof.",hash:"e54d"},
{id:4,title:"Collaborative Drawing",description:"Player 1 draws for 60 seconds. Player 2 finishes in 90 seconds +5 points if a stranger becomes p2.",hash:"b82c"},
{id:5,title:"Barefoot Walk",description:"Walk barefoot for 15 minutes.",hash:"d44a"},
{id:6,title:"Random Debate",description:"Debate with a stranger for more than 90 seconds.",hash:"fa31"},
{id:7,title:"Outfit Swap",description:"Exchange outfits with your partner for the entire day.",hash:"91ee"},
{id:8,title:"Seashell Collector",description:"Find 10 seashells or 3 unique ones.",hash:"3bd7"},
{id:9,title:"Reverse Directions",description:"Ask someone for directions and go opposite way both members should do it (not at same time).",hash:"72af"},
{id:10,title:"Push-Up Challenge",description:"100 pushups in hotel or 50 on beach.",hash:"cc19"},
{id:11,title:"Piggyback Challenge",description:"Carry teammate for 10 meters.",hash:"44ef"},
{id:12,title:"Card Tower",description:"Build a tower using cards.",hash:"a918"},
{id:13,title:"Name Hunt",description:"Find a person named Aryan and take a photo.",hash:"ef72"},
{id:14,title:"Bottle Flip Streak",description:"Land 7 bottle flips consecutively and take a video.",hash:"59b1"},
{id:15,title:"English or Spanish",description:"Play English or Spanish with a stranger.",hash:"b00c"},
{id:16,title:"Human Pyramid",description:"Create a 3-person human pyramid and take a photo.",hash:"8fa2"},
{id:17,title:"Compliment Challenge",description:"Compliment 3 strangers.",hash:"d1c9"}

];


function decodePoints(hash){

const map = {
"a7f2":6,
"c91b":5,
"e54d":5,
"b82c":7,
"d44a":5,
"fa31":6,
"91ee":8,
"3bd7":5,
"72af":6,
"cc19":9,
"44ef":6,
"a918":5,
"ef72":5,
"59b1":8,
"b00c":6,
"8fa2":9,
"d1c9":5
};

return map[hash];

}



let score1 = 0;
let score2 = 0;
let winnerDeclared = false;



db.ref("scores/team1").on("value",snap=>{
score1 = snap.val() || 0;
document.getElementById("score1").innerText = score1;
checkWinner();
});

db.ref("scores/team2").on("value",snap=>{
score2 = snap.val() || 0;
document.getElementById("score2").innerText = score2;
checkWinner();
});



const container = document.getElementById("tasks");

tasks.forEach(task => {

let div = document.createElement("div");
div.className = "task";

div.innerHTML = `
<h3>${task.title}</h3>

<button onclick="toggleDetails(${task.id})">View Details</button>

<div class="details" id="d${task.id}">

<p>${task.description}</p>

<div class="button-area">

<div class="team-row">
<button onclick="completeTask(${task.id},decodePoints('${task.hash}'),1)">
Team 1 Done
</button>

<span class="badge" id="b${task.id}_t1">✔ Team 1</span>
</div>

<div class="team-row">
<button onclick="completeTask(${task.id},decodePoints('${task.hash}'),2)">
Team 2 Done
</button>

<span class="badge" id="b${task.id}_t2">✔ Team 2</span>
</div>

</div>

</div>
`;

container.appendChild(div);



db.ref("tasks/"+task.id+"/team1").on("value",snap=>{
if(snap.val()){
document.getElementById("b"+task.id+"_t1").style.display="inline-block";
}
});

db.ref("tasks/"+task.id+"/team2").on("value",snap=>{
if(snap.val()){
document.getElementById("b"+task.id+"_t2").style.display="inline-block";
}
});

});



function toggleDetails(id){

let section = document.getElementById("d"+id);

if(section.style.display === "block"){
section.style.display = "none";
}else{
section.style.display = "block";
}

}



function completeTask(id,points,team){

let taskRef = db.ref("tasks/"+id+"/team"+team);

taskRef.transaction(current => {

if(current === true){
return;
}

return true;

}, (error, committed) => {

if(!committed) return;

if(team == 1){
db.ref("scores/team1").set(score1 + points);
}else{
db.ref("scores/team2").set(score2 + points);
}

});

}



function checkWinner(){

if(winnerDeclared) return;

if(score1 >= 69){

winnerDeclared = true;

alert("🏆 Team 1 Wins!\n\nTeam 2 loses!");

}

if(score2 >= 69){

winnerDeclared = true;

alert("🏆 Team 2 Wins!\n\nTeam 1 loses!");

}

}