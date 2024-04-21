extends Camera2D

@export var max_distance = 500

var target_distance = 0
var center_position = position


func _process(delta):
	var direction = center_position.direction_to(get_local_mouse_position())
	var target_position = center_position + direction * target_distance
	
	target_position = target_position.clamp(
		center_position - Vector2(max_distance,max_distance),
		center_position + Vector2(max_distance,max_distance)
	)
	
	position = target_position

func _input(event):
	if event is InputEventMouseMotion:
		target_distance = center_position.distance_to(get_local_mouse_position()) / 2
