extends RigidBody2D

@export var shoot_power = 6000

func _ready():
	var mouse_pos = get_global_mouse_position()
	var dir = (mouse_pos - global_position).normalized()
	var impulse = dir * shoot_power  # Adjust the multiplier as needed
	apply_central_impulse(impulse)


func _on_timer_timeout():
	queue_free()
