const tasks = [

{id:1,title:"Rose Giveaway",description:"Give a rose to 6 random people.",points:10},
{id:2,title:"Sandcastle Builder",description:"Build a sandcastle on the beach.",points:10},
{id:3,title:"Pink Spotter",description:"Find a person dressed in pink and take photo proof.",points:10},
{id:4,title:"Collaborative Drawing",description:"Player 1 draws for 60 seconds. Player 2 finishes in 90 seconds.",points:10},
{id:5,title:"Barefoot Walk",description:"Walk barefoot for 15 minutes.",points:10},
{id:6,title:"Random Debate",description:"Debate with a stranger for more than 90 seconds.",points:10},
{id:7,title:"Outfit Swap",description:"Exchange outfits with your partner for the entire day.",points:15},
{id:8,title:"Seashell Collector",description:"Find 10 seashells or 3 unique ones.",points:10},
{id:9,title:"Reverse Directions",description:"Ask someone for directions and go opposite way.",points:10},
{id:10,title:"Push-Up Challenge",description:"100 pushups in hotel or 50 on beach.",points:15},
{id:11,title:"Piggyback Challenge",description:"Carry teammate for 10 meters.",points:10},
{id:12,title:"Card Tower",description:"Build a tower using playing cards.",points:10},
{id:13,title:"Name Hunt",description:"Find a person named Aryan.",points:10},
{id:14,title:"Bottle Flip Streak",description:"Land 7 bottle flips consecutively.",points:15},
{id:15,title:"English or Spanish",description:"Play English or Spanish with a stranger.",points:10},
{id:16,title:"Human Pyramid",description:"Create a 3-person human pyramid.",points:15},
{id:17,title:"Compliment Challenge",description:"Compliment 3 strangers.",points:10}

];


let score1 = 0;
let score2 = 0;

db.ref("scores/team1").on("value",snap=>{
score1 = snap.val() || 0;
document.getElementById("score1").innerText = score1;
});

db.ref("scores/team2").on("value",snap=>{
score2 = snap.val() || 0;
document.getElementById("score2").innerText = score2;
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
<button onclick="completeTask(${task.id},${task.points},1)">
Team 1 Done
</button>

<span class="badge" id="b${task.id}_t1">✔ Team 1</span>
</div>

<div class="team-row">
<button onclick="completeTask(${task.id},${task.points},2)">
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

let key = "tasks/"+id+"/team"+team;

db.ref(key).once("value").then(snapshot=>{

if(snapshot.val()) return;

db.ref(key).set(true);

if(team==1){
db.ref("scores/team1").set(score1 + points);
}
else{
db.ref("scores/team2").set(score2 + points);
}

});

}