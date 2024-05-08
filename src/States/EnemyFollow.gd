extends State
class_name EnemyFollow

var player : CharacterBody2D
@export var enemy : CharacterBody2D
@onready var timer : Timer = %FollowTimer

func Enter():
	timer.paused = false
	timer.start()
	
	player = get_tree().get_first_node_in_group("Player")

	
	
func Update(delta : float):
	pass
	
	#if distance.length() > 500:
		#Transitioned.emit(self, "idle")


func _on_ray_cast_2d_player_not_found():
	timer.paused = true
	Transitioned.emit(self, "idle")


func _on_follow_timer_timeout():
	var direction = (player.global_position - enemy.global_position).normalized()
	# Add an upward direction to the velocity vector
	direction.y -= 1
	enemy.velocity = direction * 1000

