extends RigidBody2D

@export var bullet_speed = 5000
var mouse_position = Vector2.ZERO  # Initialize with a default value

func _ready():
	pass  # No need to get mouse position here

func _process(delta):
	mouse_position = get_viewport().get_mouse_position()
	linear_velocity = transform.x * bullet_speed
