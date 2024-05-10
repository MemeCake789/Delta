extends Node

var health_states = [
	"[▯▯▯▯▯▯▯▯▯▯]",
	"[▮▯▯▯▯▯▯▯▯▯]",
	"[▮▮▯▯▯▯▯▯▯▯]",
	"[▮▮▮▯▯▯▯▯▯▯]",
	"[▮▮▮▮▯▯▯▯▯▯]",
	"[▮▮▮▮▮▯▯▯▯▯]",
	"[▮▮▮▮▮▮▯▯▯▯]",
	"[▮▮▮▮▮▮▮▯▯▯]",
	"[▮▮▮▮▮▮▮▮▯▯]",
	"[▮▮▮▮▮▮▮▮▮▯]",
	"[▮▮▮▮▮▮▮▮▮▮]"
]


@onready var health = %Health
# Called when the node enters the scene tree for the first time.
func _ready():
	pass


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	health.text = "Health: " + health_states[Player.health]
	
	# var offset = Player.velocity * delta
	# health.position = defalut_position + offset
	# health.text = offset
