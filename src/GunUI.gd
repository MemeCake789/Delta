extends Node

@onready var ammo = %GunAmmo

const ammo_states = [
	"",
	"[]",		
	"[] []",	
	"[] [] []",	
	"[] [] [] [] ",	
	"[] [] [] [] []",
	"[] [] [] [] [] []",
	"[] [] [] [] [] [] [] ",
	"[] [] [] [] [] [] [] [] ",
	"[] [] [] [] [] [] [] [] [] ",
	"[] [] [] [] [] [] [] [] [] []",
]

# Called when the node enters the scene tree for the first time.
func _ready():
	pass

	
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
	#health.text = "Ammo: " + ammo_states[gun_ammo]


func _on_gun_update_ammo(newValue):
	if newValue > 0:
		ammo.text = "Ammo: " + ammo_states[newValue]
	else:
		ammo.text = "Ammo: [ EMPTY ]"
