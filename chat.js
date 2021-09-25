/*
	The direction main message from
	messageAnim = "left" => message move from left to right;
	messageAnim = "right" => message move from right to left;
	messageAnim = "bottom" => message move from bottom up;
*/
var messageAnim = "right";

/*
	You can put audio file in the "sfx" folder.
	Name your sfx into "chat.mp3"
*/
var chatAudioName = "chat.mp3";
var refreshRate = 250;

var lastTimestamp = -1;


const EXPR_DEFAULT = "Paimon_Lumine_Notification.gif";
const EXPR_QUESTION = "Totouri_Bunny.gif";
const EXPR_NORMAL = "";
const EXPR_EXCLAIM = "";


var CURRENTTEXT = "";
var HISTORY1 = "";
var HISTORY2 = "";
var fontsize = 36;
var chatAudio;
var animStart = 0;

var padding = 8;
var history1Height=48;
var history2Height=44;
var history3Height=40;
var mainHeight=96;

var history1Top = history2Height+history3Height;
var history2Top = history3Height;
var history3Top = 0;
var totalHeight = history1Height+history2Height+history3Height;
var mainTop = totalHeight;
var mainWidth = 0;

var expression = null;
var init = false;

function readfile() {
	jQuery.ajax({
		url: "chatfile.txt",
		ifModified: true,
		success: function(data, status) {
			var json = JSON.parse(data);
			if(lastTimestamp!=json.timestamp) {
				lastTimestamp = json.timestamp;
				updateText(json.message);
			}
		},
		complete: function(xhr, status) {
			setTimeout(function(){readfile()},refreshRate);
		}
	});
}

function updateText(txt) {
	if(init && txt != "") {	
		chatAudio.pause();
		chatAudio.currentTime = 0;
		chatAudio.play();
		$("#chatText").html(txt);
		updateHistory();
		
		CURRENTTEXT = txt;
		
		if(txt.length < 12) fontsize = 32;
		else if(txt.length < 24) fontsize = 28;
		else if(txt.length < 36) fontsize = 24;
		else if(txt.length < 48) fontsize = 20;
		else fontsize = 16
		
		$("#chatText").css("visibility", "visible");
		$("#chatText").css("font-size", fontsize);			
		$("#chatText").css("opacity", "1");
		
		if(txt.includes("?")) {
			expression.attr("src", EXPR_QUESTION);
		} else {
			expression.attr("src", EXPR_DEFAULT);
		}
		
		if(messageAnim == "left") {
			animStart = -mainHeight;
		}
		else if(messageAnim == "right") {
			animStart = mainHeight;
		}
		
		if(messageAnim == "bottom") {
			animStart = mainTop + mainHeight/2;
			$("#chatText").css("top", animStart);	
			$("#chatText").animate({					
				fontSize: fontsize,
				top: mainTop
				
			}, 250, function(){}
			);
		} else {
			$("#chatText").css("left", animStart);	
			$("#chatText").animate({					
				fontSize: fontsize ,
				left: 0
				
			}, 250, function(){}
			);
		}
		
	} else {
		init = true;
	}
}

function updateHistory() {
	if (CURRENTTEXT != "") {			
		$("#chatHistory1").css("visibility", "visible");
		$("#chatHistory1").html(CURRENTTEXT);
		$("#chatHistory1").css("opacity", "1");	
		$("#chatHistory1").css("top", mainTop);	
		$("#chatHistory1").animate({
			top: history1Top, 
			opacity: 0.85
		}, 250, function(){}
		);
		
		if(HISTORY1 != "") {
			$("#chatHistory2").css("visibility", "visible");
			$("#chatHistory2").html(HISTORY1);
			$("#chatHistory2").css("opacity", "0.85");
			
			$("#chatHistory2").css("top", history1Top);	
			$("#chatHistory2").animate(
			{
				top: history2Top, 
				opacity: 0.7
			}, 250, function(){}
			);
		}
		if(HISTORY2 != "") {
			$("#chatHistory3").css("visibility", "visible");
			$("#chatHistory3").html(HISTORY2);
			$("#chatHistory3").css("opacity", "0.7");
			
			$("#chatHistory3").css("top", history2Top);								
			$("#chatHistory3").animate({
				top: history3Top, 
				opacity: 0
			}, 250, function(){}
			);		
		}
		
		HISTORY2 = HISTORY1;
		HISTORY1 = CURRENTTEXT;
	} else {
		$("#chatHistory1").css("visibility", "hidden");
	}	
}

$(document).ready(function() {
	expression = $("#expression");
	
	chatAudio = document.createElement("audio");
	chatAudio.setAttribute("src", chatAudioName);
	chatAudio.setAttribute("preload", "auto");
	
	history1Height = $("#chatHistory1").height();
	history2Height = $("#chatHistory2").height();
	history3Height = $("#chatHistory3").height();
	mainWidth = $("#chatText").width();
					
	$("#chatHistory1").css("top", (history2Height+history3Height)+"px");
	$("#chatHistory2").css("top", (history3Height)+"px");
	$("#chatHistory3").css("top", "0px");
	$("#chatText").css("top", (totalHeight)+"px");
	
	
	$("#chatHistory1").css("visibility", "hidden");
	$("#chatHistory2").css("visibility", "hidden");
	$("#chatHistory3").css("visibility", "hidden");
	$("#chatText").css("visibility", "hidden");
	readfile();
	expression.attr("src", EXPR_DEFAULT);
});