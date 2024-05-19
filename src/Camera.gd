extends Camera2D


# camera offset to mouse
@export var max_distance = 500
var target_distance = 0
var center_position = position

#@export var random_shake:float = 30.0
#@export var shake_fade:float = 5.0
#var rand = RandomNumberGenerator.new()
#var shake_strength : float = 0.0

#func apply_shake():
	#shake_strength = random_shake

#func random_offset() -> Vector2:
	#return Vector2(rand.randf_range(-shake_strength,shake_strength), rand.randf_range(-shake_strength,shake_strength) ) 


func _process(delta):
	
	#if Input.is_action_just_pressed("shoot"):
		#apply_shake()
	
	#if shake_strength > 0:
		#shake_strength = lerpf(shake_strength,0,shake_fade * delta)
		
		#offset = random_offset()
		
		
	
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
