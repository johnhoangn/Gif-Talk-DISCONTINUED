import { chat as Parse } from "./parser.js"
import { uid as GenerateUUID } from "./UUID.js"


// TODO: Move configuration items to config.json
const STREAMER = "enduo"
const { messages } = await Parse(STREAMER)
const RESET_DELAY = 3
const HISTORY_LEN = 3
const HISTORY = Array(HISTORY_LEN)
const HISTORY_LABELS = Array(HISTORY_LEN)

const VISIBLE = "visible"
const HIDDEN = "hidden"

var LastMsgID = -1


// Reverts to idle IFF the last message the same one
//	that triggered the message
// @param uuid <String> unique ID of the message sent
function ResetIdle(uuid) {
	if (LastMsgID == uuid) {
		// TODO: Revert to idle
	}
}


// TODO: Change expression
function Message(text, context) {
	const thisID = GenerateUUID()

	LastMsgID = thisID
	for (let i = HISTORY_LEN; i > 0; i--) {
		HISTORY[i].html = HISTORY[i - 1].html
		HISTORY[i].style.visibility = HISTORY[i].html != null ? VISIBLE : HIDDEN
		console.log(i, HISTORY[i].style.visibility, HISTORY[i].html != null)
	}
	HISTORY[0].html = text
	HISTORY[0].style.visibility = VISIBLE

	setTimeout(function(){
		ResetIdle(thisID)
	}, RESET_DELAY)
}


// Initialize
for (let i = 0; i <= HISTORY_LEN; i++) {
	let hist = document.createElement('div')
	hist.id = `history${i}`
	hist.className = "historyLabel"
	hist.style.visibility = "hidden"

	$("#feed").prepend(hist)
	HISTORY[i] = hist
}


for (labl in HISTORY_LABELS) {
	console.log(labl)
}


// Handle message
// TODO: Grab context
for await (const evt of messages()) {
	if(evt.user != STREAMER) continue
	console.log("New chat:", evt.text)
	Message(evt.text, null)
}