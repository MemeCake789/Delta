extends State
class_name EnemyIdle

var player : CharacterBody2D
@export var enemy : CharacterBody2D


func Enter():
	apply_random_impulse()

	player = get_tree().get_first_node_in_group("Player")
	print_rich("[color=blue]Enter on EnemyIdle[/color]")
	
func Update(delta : float):
	print_rich("[color=blue]Update on EnemyIdle[/color]")
	
func Physics_Update(delta : float):
	var distance = enemy.global_position - player.global_position

	print_rich("[color=blue]Physics_Update on EnemyIdle[/color]")
	
	
	
	if distance.length() < 200:
		Transitioned.emit(self, "follow")
	#if Input.is_action_pressed("two"):
		#Transitioned.emit(self, "follow")
	
	
func apply_random_impulse():
	var random_direction = randf_range(-1, 1) # Generates a random number between -1 and 1
	if random_direction > 0:
		# Apply impulse to the right
		enemy.apply_impulse(Vector2.ZERO, Vector2(500, 0))
	else:
		# Apply impulse to the left
		enemy.apply_impulse(Vector2.ZERO, Vector2(-500, 0))
