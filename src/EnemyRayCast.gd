extends RayCast2D

signal player_found
signal player_not_found

var max_range = 1500
var player : CharacterBody2D

func _ready():
	player = get_tree().get_first_node_in_group("Player")

func _process(delta):
	target_position = to_local(player.position).clamp(Vector2(-max_range,-max_range),Vector2(max_range,max_range))
	
	if get_collider() == player:
		emit_signal("player_found")
	else:
		emit_signal("player_not_found")
