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


@onready var health = %HealthUI

# Called when the node enters the scene tree for the first time.
func _ready():
	
	pass

func _input(event):
	pass


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	health.text = "Health: " + health_states[Player.health]


