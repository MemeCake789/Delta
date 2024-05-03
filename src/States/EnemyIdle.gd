extends State
class_name EnemyIdle

var player : CharacterBody2D
@export var enemy : CharacterBody2D
@onready var timer : Timer = %IdleTimer


func Enter():
	timer.paused = false
	timer.start()
	player = get_tree().get_first_node_in_group("Player")

	
func Update(delta : float):
	pass
	
func Physics_Update(delta : float):

	
	
	var distance = enemy.global_position - player.global_position


	
	
	
	#if distance.length() < 500:
		#timer.paused = true
		#Transitioned.emit(self, "follow")



func _on_idle_timer_timeout():
	var move_power = 1000
	var random_vector = Vector2(randf_range(-move_power, move_power), randf_range(-move_power, move_power))
	enemy.velocity = random_vector


func _on_ray_cast_2d_player_found():
	timer.paused = true
	Transitioned.emit(self, "follow")
