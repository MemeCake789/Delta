extends Node2D


@export var smoothing_factor : int = 20
@export var max_offset : int = 100  # Maximum offset value


func shoot():
	const BULLET = preload("res://scenes/bullet.tscn")
	var new_bullet = BULLET.instantiate()
	new_bullet.global_position = %ShootPoint.global_position
	new_bullet.global_rotation = %ShootPoint.global_rotation
	%ShootPoint.add_child(new_bullet)

	# Apply impulse




func _ready():
	pass  # Replace with function body.

func _input(event):
	if event.is_action_pressed("shoot"):
		shoot()

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):

	var target_rotation = global_position.angle_to_point(get_global_mouse_position())
	rotation = lerp_angle(rotation, target_rotation, delta * smoothing_factor)

	# Add position.x offset based on distance to mouse
	var mouse_position = get_global_mouse_position()
	var distance_to_mouse = global_position.distance_to(mouse_position)
	var offset_direction = -(mouse_position - global_position).normalized().x
	var offset = max_offset * (1 - distance_to_mouse / get_viewport_rect().size.length())
	position.x = offset * offset_direction

	# Flip the sprite based on rotation
	if abs(rotation) > PI / 2 :
		scale.y = -1
	else:
		scale.y = 1
