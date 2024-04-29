extends State
class_name EnemyFollow

var player : CharacterBody2D
@export var enemy : CharacterBody2D
@onready var timer : Timer = %FollowTimer

func Enter():
	timer.paused = false
	timer.start()
	
	player = get_tree().get_first_node_in_group("Player")
	print_rich("[color=red]Enter on EnemyFollow[/color]")
	
	
func Update(delta : float):
	print_rich("[color=red]Update on EnemyFollow[/color]")
	
	#var distance = enemy.global_position - player.global_position
	print_rich("[color=red]Physics_Update on EnemyFollow[/color]")
	
	#if distance.length() > 500:
		#Transitioned.emit(self, "idle")


func _on_ray_cast_2d_player_not_found():
	timer.paused = true
	Transitioned.emit(self, "idle")


func _on_follow_timer_timeout():
	var direction = (player.global_position - enemy.global_position).normalized()
	enemy.velocity = direction * 1000
	
